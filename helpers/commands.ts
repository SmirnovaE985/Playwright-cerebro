// #авторизация в наумен
// #создание обращения и открытие страницы
// #создание простого заказа
// #быстрое добавление товара ( с опциями)
// #удаление всех позиций в заказе
// #создание заказа \ добавление в корзину без создания, с проверками промо и цен
// ( если меняем количество в карточке)
// #добавление колеровки
// #добавление ЗАЗЫ
// #заполнение модалки бетона для теста
// #Получение бонусов из общего чека
// #Проверка бонусов в общем чеке
// #применение списания баллов через телеграмм бот
// #применение промокода
// #применение сертификата

import { expect, Page, request } from "@playwright/test";

function getLogin(): string {
  const login = process.env.USER_LOGIN;
  if (!login) {
    throw new Error("USER_LOGIN не задан в .env");
  }
  return login;
}

function getPassword(): string {
  const password = process.env.USER_PASSWORD;
  if (!password) {
    throw new Error("USER_PASSWORD не задан в .env");
  }
  return password;
}

// ======================================
// авторизация в наумен
//=======================================

export async function fillLoginForm(page: Page): Promise<Page> {
  await page.goto("/");

  await page.locator('input[name="login"]').fill(getLogin());
  await page.locator('input[name="password"]').fill(getPassword());
  await page.getByRole("button", { name: "Войти" }).click();

  return page;
}
// ======================================
// создание обращения и открытие страницы
//=======================================

type ContactType = "Телефон" | "E-mail" | "Мессенджер";

interface CreateAppealOptions {
  contactType?: ContactType;
  contactValue?: string;
}

interface CreateAppealResult {
  page: Page;
  contactType: ContactType;
  contactValue: string;
  phoneNumber: string | null;
}

export async function createAppeal(
  page: Page,
  options: CreateAppealOptions = {},
): Promise<CreateAppealResult> {
  const { contactType = "Телефон", contactValue = "(900)-000-00-66" } = options;

  await fillLoginForm(page);
  await page.getByText("Клиенты").hover({ force: true });
  await page.getByText("Клиенты").click();

  const newAppeal = page.getByRole("link", { name: "Новое обращение" });
  await expect(newAppeal).toBeVisible();
  await newAppeal.click();

  await page.getByText(contactType, { exact: true }).click();
  await page.getByRole("textbox").fill(contactValue);

  const page1Promise = page.waitForEvent("popup");
  await page.getByRole("button", { name: "Создать новое обращение" }).click();
  const page1 = await page1Promise;

  await page1
    .getByRole("listitem")
    .first()
    .locator('[data-test="select-client"]')
    .click();

  await expect(page1).toHaveURL(/\/appeal/);

  const phoneNumber =
    contactType === "Телефон" ? `+7${contactValue.replace(/\D/g, "")}` : null;

  return {
    page: page1,
    contactType,
    contactValue,
    phoneNumber,
  };
}

// =======================
//создание простого заказа
// =======================

interface CreateOrderOptions {
  contactType?: ContactType;
  contactValue?: string;
  makeOrder?: boolean;
  searchText?: string;
  quantity?: number;
}

interface CreateOrderResult {
  page: Page;
  contactType: ContactType;
  contactValue: string;
  phoneNumber: string | null;
}

export async function createOrder(
  page: Page,
  options: CreateOrderOptions = {},
): Promise<CreateOrderResult> {
  const {
    contactType = "Телефон",
    contactValue = "(900)-000-00-66",
    makeOrder = true,
    searchText = "цемент",
    quantity,
  } = options;

  await fillLoginForm(page);
  await page.getByText("Клиенты").hover({ force: true });
  await page.getByText("Клиенты").click();

  const newAppeal = page.getByRole("link", { name: "Новое обращение" });
  await expect(newAppeal).toBeVisible();
  await newAppeal.click();

  await page.getByText(contactType, { exact: true }).click();
  await page.getByRole("textbox").fill(contactValue);

  const page1Promise = page.waitForEvent("popup");
  await page.getByRole("button", { name: "Создать новое обращение" }).click();
  const page1 = await page1Promise;

  await page1
    .getByRole("listitem")
    .first()
    .locator('[data-test="select-client"]')
    .click();

  await page1.locator('[data-test="select-appeal"]').click();
  await page1
    .locator('[data-test="select-appeal"] li')
    .filter({ hasText: "Новый заказ" })
    .click();

  await page1.locator(".ant-select-selection-overflow").click();
  await page1.getByText("РЦ Тмн, 50 лет Октября, 109 ко").click();

  await page1.locator('[data-test="search-input"]').fill(searchText);
  await page1.locator('[data-test="search-button"]').click();

  await page1.locator('[data-test="shopping-card-button"]').first().click();

  if (quantity !== undefined) {
    await page1
      .locator('[data-test="add-quantity-input"]')
      .fill(String(quantity));
  }

  await page1.getByRole("button", { name: "Добавить" }).click();
  await page1.locator('[data-test="to-cart-button"]').click();

  if (makeOrder) {
    await page1.locator('[data-test="make-order"]').click();
    await expect(page1.getByText("Заказ успешно создан")).toBeVisible();
  }

  const phoneNumber =
    contactType === "Телефон" ? `+7${contactValue.replace(/\D/g, "")}` : null;

  return {
    page: page1,
    contactType,
    contactValue,
    phoneNumber,
  };
}
// использование в тестах (без списания баллов)
/*test('создание заказа', async ({ page }) => {
  const { page: page1, phoneNumber } = await createOrder(page, {
    contactType: 'Телефон',
    contactValue: '(900)-000-00-66',
    makeOrder: true,
    searchText: 'цемент',
    quantity: 3,
  });
});
*/

// если используем списание баллов
// test('создание заказа и получение промокода', async ({ page }) => {
//   const { page: page1, phoneNumber } = await createOrder(page, {
//     contactType: 'Телефон',
//     contactValue: '(900)-000-00-66',
//     makeOrder: true,
//     searchText: 'цемент',
//     quantity: 3,
//   });

//   if (!phoneNumber) {
//     throw new Error('Не удалось получить номер телефона');
//   }

//   const promoCode = await getPromoCodeFromChatRosaMessage(phoneNumber);

//   await expect(page1.getByText('Заказ успешно создан')).toBeVisible();
//   expect(promoCode).toMatch(/^\d{4}$/);
// });

// ======================================
// быстрое добавление товара ( с опциями)
// ======================================

type AddProductToCartOptions = {
  productName: string;
  quantity?: string | number;
  price?: string | number;
};

export async function addProductToCart(
  page1: Page,
  options: AddProductToCartOptions,
): Promise<void> {
  const { productName, quantity, price } = options;

  await page1.locator('[data-test="search-input"]').click();
  await page1.locator('[data-test="search-input"]').fill(productName);
  await page1.locator('[data-test="search-button"]').click();

  await page1.locator('[data-test="shopping-card-button"]').first().click();

  if (quantity !== undefined) {
    const quantityInput = page1.locator('[data-test="add-quantity-input"]');
    await quantityInput.clear();
    await quantityInput.fill(String(quantity));
  }

  if (price !== undefined) {
    const priceInput = page1.locator('[data-test="input-price-modal-0"]');
    await priceInput.clear();
    await priceInput.fill(String(price));
  }

  await page1.getByRole("button", { name: "Добавить" }).click();
  await page1.locator('[data-test="to-cart-button"]').click();
}

// применение в тестах
// await addProductToCart(page1, {
//   productName: "кисть",
//   quantity: 2,
//   price: 170,
// });

//==============================
//удаление всех позиций в заказе
// =============================
export async function deleteAllPositions(page1: Page) {
  const deleteAllButton = page1.locator('[data-test="delete-all-position"]');
  const closeBtn = page1.locator(".ant-notification-notice-close");

  if ((await closeBtn.count()) > 0 && (await closeBtn.first().isVisible())) {
    await closeBtn.first().click();
  }
  await deleteAllButton.waitFor({ state: "visible" });
  await deleteAllButton.scrollIntoViewIfNeeded();
  await deleteAllButton.click();

  await page1.locator('[data-test="delete-all-position-ok-button"]').click();
  await page1
    .locator('[data-test="save-order"], [data-test="save-offer"]')
    .click();
}

//====================================================================
// создание заказа \ добавление без создания, с проверками промо и цен
// ( если меняем количество в карточке)
//====================================================================
type CreateOrderCheckPromoOptions = {
  makeOrder?: boolean;
  searchText?: string;
  quantity?: number;

  beforeMakeOrder?: (page: Page) => Promise<void>;
  afterMakeOrder?: (page: Page) => Promise<void>;
};

export async function createOrderCheckPromo(
  page: Page,
  options?: CreateOrderCheckPromoOptions,
) {
  const { makeOrder = true, searchText = "цемент", quantity } = options ?? {};

  // Авторизация и создание обращения

  await fillLoginForm(page);

  await page.getByText("Клиенты").first().click();
  await page.getByRole("link", { name: "Новое обращение" }).click();
  await page.getByRole("textbox", { name: "Телефон" }).fill("(900)-000-00-66");
  const page1Promise = page.waitForEvent("popup");
  await page.getByRole("button", { name: "Создать новое обращение" }).click();
  const page1 = await page1Promise;
  const getCartValue = async (selector: string) => {
    const text = await page1.locator(selector).innerText();
    return parseFloat(text.replace(/[^\d.,]/g, "").replace(/,/g, "."));
  };

  await page1
    .getByRole("listitem")
    .first()
    .locator('[data-test="select-client"]')
    .click();
  await page1.locator('[data-test="select-appeal"]').click();
  await page1
    .locator('[data-test="select-appeal"] li')
    .filter({ hasText: "Новый заказ" })
    .click();
  await page1.locator(".ant-select-selection-overflow").click();
  await page1.getByText("РЦ Тмн, 50 лет Октября, 109 ко").click();
  // Поиск и открытие карточки товара
  await page1.locator('[data-test="search-input"]').fill(searchText);
  await page1.locator('[data-test="search-button"]').click();
  await page1.locator('[data-test="shopping-card-button"]').first().click();
  // Модальное окно товара (цены и бонусы)
  const modal = page1.locator(".ant-modal:visible");
  const parseNumber = async (selector: string) => {
    const text = await modal.locator(selector).innerText();
    return parseFloat(text.replace(/[^\d.,]/g, "").replace(/,/g, "."));
  };

  const productPrice = await parseNumber('[data-test="product-info-price"]');
  const productBonus = await parseNumber('[data-test="product-info-bonus"]');

  let finalQuantity = 1;
  if (quantity !== undefined) {
    const quantityInput = modal.locator(
      'input[data-test="add-quantity-input"]',
    );
    await quantityInput.fill("");
    await quantityInput.fill(String(quantity));
    finalQuantity = quantity;
  }

  const modalCostText = await modal
    .locator('[data-test="modal-position-cost"]')
    .innerText();

  const modalCost = parseFloat(
    modalCostText.replace(/[^\d.,]/g, "").replace(/,/g, "."),
  );

  expect(modalCost).toBeCloseTo(productPrice * finalQuantity, 2);

  // Добавление товара и переход в корзину
  await page1.getByRole("button", { name: "Добавить" }).click();
  await page1.locator('[data-test="to-cart-button"]').click();
  // Корзина — проверяем значения ДО создания

  const cartPositionCostBefore = await getCartValue(
    '[data-test="cart-position-cost"]',
  );
  const cartPositionBonusBefore = await getCartValue(
    '[data-test="cart-position-bonus"]',
  );
  const cartTotalCostBefore = await getCartValue(
    '[data-test="cart-total-cost"]',
  );
  const cartTotalBonusBefore = await getCartValue(
    '[data-test="cart-total-bonus"]',
  );

  //  опциональные шаги ДО создания заказа
  if (options?.beforeMakeOrder) {
    await options.beforeMakeOrder(page1);
  }
  // Опциональное создание заказа
  if (makeOrder) {
    await page1.locator('[data-test="make-order"]').click();
    // опциональные шаги ПОСЛЕ создания заказа
    if (options?.afterMakeOrder) {
      await options.afterMakeOrder(page1);
    }

    const cartPositionCostAfter = await getCartValue(
      '[data-test="cart-position-cost"]',
    );
    const cartPositionBonusAfter = await getCartValue(
      '[data-test="cart-position-bonus"]',
    );
    const cartTotalCostAfter = await getCartValue(
      '[data-test="cart-total-cost"]',
    );
    const cartTotalBonusAfter = await getCartValue(
      '[data-test="cart-total-bonus"]',
    );

    expect(cartPositionCostAfter).toBe(cartPositionCostBefore);
    expect(cartPositionBonusAfter).toBe(cartPositionBonusBefore);
    expect(cartTotalCostAfter).toBe(cartTotalCostBefore);
    expect(cartTotalBonusAfter).toBe(cartTotalBonusBefore);
  }
}

//======================
// добавление колеровки
//======================
export async function addColoring(page1: Page, code: string) {
  const modal = page1.locator(".ant-modal").last();
  const codeInput = modal.getByRole("textbox", { name: "Код", exact: true });

  await expect(modal).toBeVisible();
  await expect(codeInput).toBeVisible();

  await codeInput.click();
  await codeInput.fill(code);

  const option = modal
    .locator('[data-test="colors-item"]')
    .filter({ hasText: code });
  await expect(option).toBeVisible({ timeout: 5000 });
  await option.click();

  const saveButton = modal.getByRole("button", {
    name: "Сохранить",
    exact: true,
  });
  await expect(saveButton).toBeVisible({ timeout: 5000 });
  await expect(saveButton).toBeEnabled({ timeout: 5000 });
  await saveButton.click();

  await expect(page1.getByText("Услуга успешно добавлена")).toBeVisible({
    timeout: 10000,
  });
}

// ==================
//  добавление ЗАЗЫ
// ==================

type AddZazaOptions = {
  storeFromText: string;
  storeToText?: string;
  unitCode?: string;
};

export async function addZaza(page1: Page, options: AddZazaOptions) {
  const { storeFromText, storeToText, unitCode } = options;

  const zazaButton = page1.locator('a[data-test="ZAZA"]');
  const storeFrom = page1.locator('[data-test="search-input-store"]');
  const storeTo = page1.locator('[data-test="search-input-shipment"]');
  const addPositionButton = page1.locator('[data-test="add-position"]');

  await expect(zazaButton).toBeVisible();
  await expect(zazaButton).toBeEnabled();
  await zazaButton.click();

  // storeFrom — всегда выбор по тексту
  await expect(storeFrom).toBeVisible();
  await storeFrom.click();

  let dropdown = page1.locator(".ant-select-dropdown:visible").last();
  await expect(dropdown).toBeVisible();

  const storeFromOption = dropdown
    .locator(".ant-select-item-option")
    .filter({
      has: page1.getByText(storeFromText, { exact: false }),
    })
    .first();

  await expect(storeFromOption).toBeVisible();
  await storeFromOption.click();

  // storeTo — если текст передан, выбираем по тексту, иначе первый элемент
  await expect(storeTo).toBeVisible();
  await storeTo.click();

  dropdown = page1.locator(".ant-select-dropdown:visible").last();
  await expect(dropdown).toBeVisible();

  if (storeToText) {
    const storeToOption = dropdown
      .locator(".ant-select-item-option")
      .filter({
        has: page1.getByText(storeToText, { exact: false }),
      })
      .first();

    await expect(storeToOption).toBeVisible();
    await storeToOption.click();
  } else {
    const firstStoreToOption = dropdown
      .locator(".ant-select-item-option")
      .first();
    await expect(firstStoreToOption).toBeVisible();
    await firstStoreToOption.click();
  }

  // Выбор единицы измерения, если передана
  if (unitCode) {
    await page1.locator('[data-test="modal-edit-units"]').click();

    const unitOption = page1.locator(`[data-test="unit-${unitCode}"]`);
    await expect(unitOption).toBeVisible();
    await unitOption.click();
  }
  await expect(addPositionButton).toBeVisible();
  await addPositionButton.click();
}
// вызов в тесте
// магазин- получатель, отправитель по умолчанию первый
// await addZaza(page1, {
//   storeFromText: '1021 РЦ Тмн, 50 лет Октября',
// });
// выбор двух магазинов
// await addZaza(page1, {
//   storeFromText: '1021 РЦ Тмн, 50 лет Октября',
//   storeToText: 'СД Тюмень',
// });

//====================================
//заполнение модалки бетона
//====================================
export async function addConcrete(page1: Page) {
  await page1.locator('[data-test="search-button"]').click();
  await page1.locator('[data-test="shopping-card-button"]').first().click();
  await page1.locator("[data-test=add-quantity-input]").click();
  // вводим в инпут объем, проверяем, если не заполнилось-повторяем
  const addQuntInp = page1.locator('[data-test="add-quantity-input"]');
  const valueToSet = "20";
  await addQuntInp.waitFor({ state: "visible" });
  await addQuntInp.fill(valueToSet);
  let currentValue = await addQuntInp.inputValue();
  if (currentValue !== valueToSet) {
    // Если  не установилось — пробуем ещё раз
    await addQuntInp.fill("");
    await addQuntInp.fill(valueToSet);
    // Финальная проверка
    await expect(addQuntInp).toHaveValue(valueToSet);
  }

  await page1.locator("[data-test=delivery-address]").fill("Агеева");
  await page1.getByText("Агеева").first().click();
  await page1.locator('input[placeholder*="Выберите дату"]').click();
  //определяем текущую дату и добавляем к ней 1 день
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const year = tomorrow.getFullYear();
  const month = String(tomorrow.getMonth() + 1).padStart(2, "0");
  const day = String(tomorrow.getDate()).padStart(2, "0");
  const tomorrowFormatted = `${year}-${month}-${day}`;
  await page1.locator(`td[title="${tomorrowFormatted}"]`).click();
  //Нажать кнопку "нужен автобетононасос"
  await page1.waitForTimeout(3000);
  const label = page1.locator("div", { hasText: "Нужен автобетононасос" });
  const toggle = label.locator('button[role="switch"]');
  if ((await toggle.getAttribute("aria-checked")) === "false") {
    await toggle.click();
  }
  // выбираем насос
  const pumpInput = page1.locator(
    '[data-test="length-of-pump"] input[role="combobox"]',
  );
  await pumpInput.scrollIntoViewIfNeeded();
  await pumpInput.click();
  await page1.keyboard.press("ArrowDown");
  await page1.keyboard.press("Enter");
  const intervalInput = page1.locator(
    '[data-test="interval-of-pump"] input[role="combobox"]',
  );
  await intervalInput.click();
  await page1.keyboard.press("ArrowDown");
  await page1.keyboard.press("Enter");
  // Нажимаем "Добавить машину"
  await page1.getByText("Добавить машину").click();
  await page1.locator('[data-test="cars-type"]').click();
  await page1.getByText("Бетоновоз 10м3").click();
  //выбрать время
  const timeInput2 = page1.locator(
    '[data-test="cars-time-0"] input[role="combobox"]',
  );
  await timeInput2.click();
  await page1.keyboard.press("ArrowDown");
  await page1.keyboard.press("Enter");
  //ввести объём бетона
  await page1.locator('input[placeholder*="Объём"]').fill("10");
  // Нажимаем "Добавить машину 2"
  await page1.getByText("Добавить машину").click();
  await page1
    .locator('[data-test="cars-type"]', { hasText: "Выберите тип" })
    .click();
  await page1.getByText("Бетоновоз 12м3").first().click();
  //выбрать время
  const timeInput = page1.locator(
    '[data-test="cars-time-0"] input[role="combobox"]',
  );
  await timeInput.click();
  await page1.keyboard.press("ArrowDown");
  await page1.keyboard.press("Enter");
  //ввести объём бетона
  const modal = page1.locator(".ant-modal:visible");
  const volumeInput = modal.locator('input[placeholder*="Объём"]').first();
  await volumeInput.waitFor({ state: "visible" });
  await volumeInput.click({ clickCount: 3 });
  await volumeInput.press("Backspace");
  await volumeInput.type("10", { delay: 120 });
}
//
// шаблон для тестов
// test('#1111 name', async ({ page }) => {
// const page1 = await createAppeal?????(page);

// });

// ==============================
// Получение бонусов из общего чека
// ==============================
export async function getCartTotalBonus(page: Page): Promise<number> {
  const bonusText = await page
    .locator('[data-test="cart-total-bonus-total"]')
    .textContent();

  return Number(
    bonusText
      ?.replace(/[^\d.,-]/g, "")
      .replace(",", ".")
      .trim() ?? "0",
  );
}

// ==============================
// Проверка бонусов в общем чеке
// ==============================
type ExpectCartTotalBonusOptions = {
  expected: number;
  timeout?: number;
};
export async function expectCartTotalBonus(
  page: Page,
  options: ExpectCartTotalBonusOptions,
): Promise<void> {
  const { expected, timeout = 10000 } = options;

  const bonusLocator = page.locator('[data-test="cart-total-bonus-total"]');
  await expect(bonusLocator).toBeVisible({ timeout });
}

// ==============================================
// забираем смс-код через телеграмм бот
// ===============================================
type TelegramUpdate = {
  update_id: number;
  message?: {
    text?: string;
  };
  channel_post?: {
    text?: string;
  };
};

type TelegramResponse = {
  ok: boolean;
  result: TelegramUpdate[];
};

export async function getPromoCodeFromChatRosaMessage(
  phoneNumber: string,
): Promise<string> {
  const botUrl =
    process.env.TG_BOT_ROSA_MESSAGE ||
    process.env.CYPRESS_TELEGRAM_BOT_FOR_ROSA_MESSAGE_GATEWAY;

  if (!botUrl) {
    throw new Error(
      "Не задана переменная окружения TG_BOT_ROSA_MESSAGE или CYPRESS_TELEGRAM_BOT_FOR_ROSA_MESSAGE_GATEWAY",
    );
  }

  const apiUrl = `${botUrl}/getUpdates`;
  const apiContext = await request.newContext();

  try {
    const initialResponse = await apiContext.get(apiUrl);
    const initialBody = (await initialResponse.json()) as TelegramResponse;
    const oldUpdates = initialBody.result || [];

    const lastUpdateId = oldUpdates.reduce(
      (max, update) => (update.update_id > max ? update.update_id : max),
      0,
    );

    let promoCode: string | null = null;

    await expect
      .poll(
        async () => {
          const response = await apiContext.get(
            `${apiUrl}?offset=${lastUpdateId + 1}`,
          );
          const body = (await response.json()) as TelegramResponse;
          const updates = body.result || [];

          const latestMatchingMessage = [...updates].reverse().find((u) => {
            const text = u.message?.text || u.channel_post?.text || "";
            return text.includes(phoneNumber);
          });

          const text =
            latestMatchingMessage?.message?.text ||
            latestMatchingMessage?.channel_post?.text ||
            "";

          if (!text) {
            return null;
          }

          const codeMatch = text.match(
            /Последние\s*4\s*цифры[\s\S]*?списания\s*баллов\s*-\s*(\d{4})/i,
          );

          promoCode = codeMatch?.[1] ?? null;
          return promoCode;
        },
        {
          timeout: 60000,
          intervals: [1000, 2000, 3000, 5000],
          message: `Не удалось найти код подтверждения для номера ${phoneNumber}`,
        },
      )
      .not.toBeNull();

    if (!promoCode) {
      throw new Error(
        `Не удалось получить код подтверждения для номера ${phoneNumber}`,
      );
    }

    return promoCode;
  } finally {
    await apiContext.dispose();
  }
}

//
interface CreateOrderOptions {
  contactType?: ContactType;
  contactValue?: string;
  makeOrder?: boolean;
  searchText?: string;
  quantity?: number;
}

interface CreateOrderResult {
  page: Page;
  contactType: ContactType;
  contactValue: string;
  phoneNumber: string | null;
}

// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
// применение баллов и ввод кода внутри корзины
// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
export async function applyBonusesWithTelegramCode(
  page: Page,
  phoneNumber: string,
  amount: string = "1",
): Promise<string> {
  const bonusesInput = page.getByRole("textbox", { name: "Укажите баллы" });
  await expect(bonusesInput).toBeVisible();
  await bonusesInput.fill(amount);

  const bonusesCheck = page.locator('[data-test="bonuses-check"]');
  await expect(bonusesCheck).toBeVisible();
  await bonusesCheck.click();

  const applyingBonusesButton = page.locator('[data-test="applying-bonuses"]');
  await expect(applyingBonusesButton).toBeVisible();
  await applyingBonusesButton.click();

  await expect(page.getByText("Списание баллов")).toBeVisible();

  const promoCodeInput = page.locator('input[placeholder="____"]');
  await expect(promoCodeInput).toBeVisible();

  const promoCode = await getPromoCodeFromChatRosaMessage(phoneNumber);
  await promoCodeInput.fill(promoCode);

  const submitButton = page.locator('[data-test="submit-modal-btn"]');
  await expect(submitButton).toBeVisible();
  await submitButton.click();

  await expect(page.getByText("Баллы подтверждены")).toBeVisible();

  return promoCode;
}

// ==============================
//  манульные цены и возврат ИМКЦ
// ==============================
export async function setManualPriceForFirstCartPosition(
  page: Page,
  price: string,
): Promise<void> {
  const firstCartPosition = page.locator('[data-test="cart-position"]').first();
  const modalPriceInput = page.locator('[data-test="modal-edit-input-price"]');
  const saveBtnInModal = page.locator(
    '[data-test="save-btn-in-modal-edit-position"]',
  );
  const editModal = page.locator('[data-test="cart-position-edit-modal"]');

  await expect(firstCartPosition).toBeVisible();
  await firstCartPosition.click();

  await expect(editModal).toBeVisible();
  await expect(modalPriceInput).toBeVisible();

  await modalPriceInput.clear();
  await modalPriceInput.fill(price);

  await expect(saveBtnInModal).toBeVisible();
  await saveBtnInModal.click();

  await expect(editModal).toBeHidden();
}

// вернуть цену ИМКЦ
export async function restoreImkcPriceForFirstCartPosition(
  page: Page,
): Promise<void> {
  const firstCartPosition = page.locator('[data-test="cart-position"]').first();
  const imkcPriceButton = page.locator('[data-test="price-imkc-edit-modal"]');
  const saveBtnInModal = page.locator(
    '[data-test="save-btn-in-modal-edit-position"]',
  );
  const editModal = page.locator('[data-test="cart-position-edit-modal"]');

  await expect(firstCartPosition).toBeVisible();
  await firstCartPosition.click();

  await expect(editModal).toBeVisible();
  await expect(imkcPriceButton).toBeVisible();
  await imkcPriceButton.click();

  await expect(saveBtnInModal).toBeVisible();
  await saveBtnInModal.click();

  await expect(editModal).toBeHidden();
}

// =====================
//  применение промокода
// =====================
export async function applyPromoCode(
  page: Page,
  promoCode: string = "CALLCENTER1",
): Promise<void> {
  await page.locator('[data-test="promocode-block-title"]').click();
  await page.locator('[data-test="promocode"]').fill(promoCode);
  await page.locator('[data-test="promocode-apply"]').click();
  await expect(
    page
      .locator('[data-test="promocode-aprove"]')
      .filter({ hasText: "Применено" }),
  ).toBeVisible();
}

// =======================
//  применение сертификата
// =======================
export async function applyCertificate(
  page: Page,
  amount: string,
  certificateCode: string = "CERTCALLCENTER",
): Promise<void> {
  await page.locator('[data-test="promocode-block-title"]').click();
  await page.getByText("Сертификат").click();
  await page.locator('[data-test="sertificat"]').fill(certificateCode);
  await page.locator('[data-test="use-sertificat"]').click();
  await page.locator('[data-test="certificate-value"]').fill(amount);
  await page.locator('[data-test="use"]').click();
}

// если используем дефолтный сертификат
// await applyCertificate(page1, "10");

// если нужен другой сертификат
// await applyCertificate(page1, "10", "MY_CERT_123");
