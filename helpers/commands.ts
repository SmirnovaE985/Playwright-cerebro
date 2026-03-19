import { Page, expect } from '@playwright/test';

function getLogin(): string {
  const login = process.env.USER_LOGIN;
  if (!login) {
    throw new Error('USER_LOGIN не задан в .env');
  }
  return login;
}

function getPassword(): string {
  const password = process.env.USER_PASSWORD;
  if (!password) {
    throw new Error('USER_PASSWORD не задан в .env');
  }
  return password;
}


// ======================================
// авторизация в наумен 
//=======================================

export async function fillLoginForm(page: Page): Promise<Page> {
  await page.goto('/');

  await page.locator('input[name="login"]').fill(getLogin());
  await page.locator('input[name="password"]').fill(getPassword());
  await page.getByRole('button', { name: 'Войти' }).click();

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

export async function createAppeal(
  page: Page,
  options: CreateAppealOptions = {}
): Promise<Page> {
  const {
    contactType = "Телефон",
    contactValue = "(900)-000-00-66",
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

  await expect(page1).toHaveURL(/\/appeal/);
  return page1;
}


//========================
//создание простого заказа
// =======================
export async function createOrder(
  page: Page,
  options?: 
  { makeOrder?: boolean
    searchText?: string;
   }): Promise<Page> {
  const { makeOrder = true,
    searchText = 'цемент',
   } = options ?? {};

  await fillLoginForm(page);
  // Находим пункт "Клиенты" 
   await page.getByText("Клиенты").hover({ force: true });
   await page.getByText("Клиенты").click();
   const newAppeal = page.getByRole('link', { name: 'Новое обращение' });
  // Ждём пока элемент будет доступен
await expect(newAppeal).toBeVisible();
await newAppeal.click();
  await page.getByRole("textbox", { name: "Телефон" }).fill("(900)-000-00-66");

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
    .filter({ hasText: 'Новый заказ' })
    .click();

  await page1.locator('.ant-select-selection-overflow').click();
  await page1.getByText('РЦ Тмн, 50 лет Октября, 109 ко').click();
  await page1.locator('[data-test="search-input"]').fill(searchText);
  await page1.locator('[data-test="search-button"]').click();
  await page1.locator('[data-test="shopping-card-button"]').first().click();
  await page1.getByRole('button', { name: 'Добавить' }).click();
  await page1.locator('[data-test="to-cart-button"]').click();
  //  опциональный шаг
  if (makeOrder) {
    await page1.locator('[data-test="make-order"]').click();
    await expect(page1.getByText('Заказ успешно создан')).toBeVisible();
    
  }
 
  return page1;
 
}

//====================================
//выбор даты и времени внутри доставки
//====================================
export async function pickFirstAvailableDate(page: Page) {
  await page.getByText('Выберите дату').click();

  const datepicker = page.locator('div[class^="_container"] > div[class^="_datepicker"]');
  await datepicker.locator('div[class^="_month-changer"]').last().click();
  await datepicker.locator('div[data-test="available-day"]').first().click();

  await page
    .locator('[class^="_valuepicker-body"]')
    .locator('[class^="_value_"]')
    .first()
    .click();
}

//==============================
//удаление всех позиций в заказе
// =============================
export async function deleteAllPositions(page: Page) {
  const deleteAllButton = page.locator('[data-test="delete-all-position"]');

  await deleteAllButton.waitFor({ state: 'visible' });
  await deleteAllButton.scrollIntoViewIfNeeded();
  await deleteAllButton.click();

  await page.locator('[data-test="delete-all-position-ok-button"]').click();
  await page.locator('[data-test="save-order"], [data-test="save-offer"]').click();
}



//====================================================================
// создание заказа \ добавление без создания, с проверками промо и цен
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
  const {
    makeOrder = true,
    searchText = 'цемент',
    quantity,
  } = options ?? {};

  // Авторизация и создание обращения

  await fillLoginForm(page);
  
  await page.getByText('Клиенты').first().click();
  await page.getByRole('link', { name: 'Новое обращение' }).click();
  await page
    .getByRole('textbox', { name: 'Телефон' })
    .fill('(900)-000-00-66');
  const page1Promise = page.waitForEvent('popup');
  await page
    .getByRole('button', { name: 'Создать новое обращение' })
    .click();
  const page1 = await page1Promise;
  const getCartValue = async (selector: string) => {
    const text = await page1.locator(selector).innerText();
    return parseFloat(
      text.replace(/[^\d.,]/g, '').replace(/,/g, '.'),
    );
  };

  await page1
    .getByRole('listitem')
    .first()
    .locator('[data-test="select-client"]')
    .click();
  await page1.locator('[data-test="select-appeal"]').click();
  await page1
    .locator('[data-test="select-appeal"] li')
    .filter({ hasText: 'Новый заказ' })
    .click();
  await page1.locator('.ant-select-selection-overflow').click();
  await page1.getByText('РЦ Тмн, 50 лет Октября, 109 ко').click();
  // Поиск и открытие карточки товара
  await page1.locator('[data-test="search-input"]').fill(searchText);
  await page1.locator('[data-test="search-button"]').click();
  await page1.locator('[data-test="shopping-card-button"]').first().click();
  // Модальное окно товара (цены и бонусы)
  const modal = page1.locator('.ant-modal:visible');
  const parseNumber = async (selector: string) => {
    const text = await modal.locator(selector).innerText();
    return parseFloat(
      text.replace(/[^\d.,]/g, '').replace(/,/g, '.'),
    );
  };

  const productPrice = await parseNumber(
    '[data-test="product-info-price"]',
  );
  const productBonus = await parseNumber(
    '[data-test="product-info-bonus"]',
  );

  let finalQuantity = 1;
  if (quantity !== undefined) {
    const quantityInput = modal.locator(
      'input[data-test="add-quantity-input"]',
    );
    await quantityInput.fill('');
    await quantityInput.fill(String(quantity));
    finalQuantity = quantity;
  }

  const modalCostText = await modal
    .locator('[data-test="modal-position-cost"]')
    .innerText();

  const modalCost = parseFloat(
    modalCostText.replace(/[^\d.,]/g, '').replace(/,/g, '.'),
  );

  expect(modalCost).toBeCloseTo(productPrice * finalQuantity, 2);

// Добавление товара и переход в корзину
  await page1.getByRole('button', { name: 'Добавить' }).click();
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
  const modal = page1.locator('.ant-modal').last();
  const codeInput = modal.getByRole('textbox', { name: 'Код', exact: true });

  await expect(modal).toBeVisible();
  await expect(codeInput).toBeVisible();

  await codeInput.click();
  await codeInput.fill(code);

  const option = modal.locator('[data-test="colors-item"]').filter({ hasText: code });
  await expect(option).toBeVisible({ timeout: 5000 });
  await option.click();

  const saveButton = modal.getByRole('button', { name: 'Сохранить', exact: true });
  await expect(saveButton).toBeVisible({ timeout: 5000 });
  await expect(saveButton).toBeEnabled({ timeout: 5000 });
  await saveButton.click();

  await expect(page1.getByText('Услуга успешно добавлена')).toBeVisible({ timeout: 10000 });
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

  // await zazaButton.scrollIntoViewIfNeeded();
await expect(zazaButton).toBeVisible();
await expect(zazaButton).toBeEnabled();
await zazaButton.click();

  // storeFrom — всегда выбор по тексту
  await expect(storeFrom).toBeVisible();
  await storeFrom.click();

  let dropdown = page1.locator('.ant-select-dropdown:visible').last();
  await expect(dropdown).toBeVisible();

  const storeFromOption = dropdown.locator('.ant-select-item-option').filter({
    has: page1.getByText(storeFromText, { exact: false }),
  }).first();

  await expect(storeFromOption).toBeVisible();
  await storeFromOption.click();

  // storeTo — если текст передан, выбираем по тексту, иначе первый элемент
  await expect(storeTo).toBeVisible();
  await storeTo.click();

  dropdown = page1.locator('.ant-select-dropdown:visible').last();
  await expect(dropdown).toBeVisible();

  if (storeToText) {
    const storeToOption = dropdown.locator('.ant-select-item-option').filter({
      has: page1.getByText(storeToText, { exact: false }),
    }).first();

    await expect(storeToOption).toBeVisible();
    await storeToOption.click();
  } else {
    const firstStoreToOption = dropdown.locator('.ant-select-item-option').first();
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
//заполнение модалки бетона для теста 
//====================================
export async function addConcrete(page1: Page) {
  await page1.locator('[data-test="search-button"]').click();
await page1.locator('[data-test="shopping-card-button"]').first().click();
await page1.locator('[data-test=add-quantity-input]').click();
// вводим в инпут объем, проверяем, если не заполнилось-повторяем
const addQuntInp = page1.locator('[data-test="add-quantity-input"]');
const valueToSet = '20';
await addQuntInp.waitFor({ state: 'visible' });
await addQuntInp.fill(valueToSet);
let currentValue = await addQuntInp.inputValue();
if (currentValue !== valueToSet) {
// Если  не установилось — пробуем ещё раз
  await addQuntInp.fill('');
  await addQuntInp.fill(valueToSet);
// Финальная проверка
  await expect(addQuntInp).toHaveValue(valueToSet);
}

await page1.locator('[data-test=delivery-address]').fill('Агеева');
await page1.getByText('Агеева').first().click();
await page1.locator('input[placeholder*="Выберите дату"]').click();
 //определяем текущую дату и добавляем к ней 1 день
  const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const year = tomorrow.getFullYear();
    const month = String(tomorrow.getMonth() + 1).padStart(2, '0');
    const day = String(tomorrow.getDate()).padStart(2, '0');
    const tomorrowFormatted = `${year}-${month}-${day}`;
    await page1.locator(`td[title="${tomorrowFormatted}"]`).click();
     //Нажать кнопку "нужен автобетононасос"
     await page1.waitForTimeout(3000);
const label = page1.locator('div', { hasText: 'Нужен автобетононасос' });
const toggle = label.locator('button[role="switch"]');
if (await toggle.getAttribute('aria-checked') === 'false') {
  await toggle.click();
}
// выбираем насос
const pumpInput = page1
  .locator('[data-test="length-of-pump"] input[role="combobox"]');
await pumpInput.scrollIntoViewIfNeeded();
await pumpInput.click();
await page1.keyboard.press('ArrowDown');
await page1.keyboard.press('Enter');
const intervalInput = page1.locator('[data-test="interval-of-pump"] input[role="combobox"]');
await intervalInput.click();
await page1.keyboard.press('ArrowDown');
await page1.keyboard.press('Enter');
// Нажимаем "Добавить машину"
 await page1.getByText('Добавить машину').click();
await page1.locator('[data-test="cars-type"]').click();
await page1.getByText('Бетоновоз 10м3').click();
//выбрать время
const timeInput2 = page1.locator('[data-test="cars-time-0"] input[role="combobox"]');
await timeInput2.click();
await page1.keyboard.press('ArrowDown');
await page1.keyboard.press('Enter');
//ввести объём бетона
await page1.locator('input[placeholder*="Объём"]').fill('10');
// Нажимаем "Добавить машину 2"
 await page1.getByText('Добавить машину').click();
await page1.locator('[data-test="cars-type"]', { hasText: 'Выберите тип' }).click();
await page1.getByText('Бетоновоз 12м3').first().click();
//выбрать время
const timeInput = page1.locator('[data-test="cars-time-0"] input[role="combobox"]');
await timeInput.click();
await page1.keyboard.press('ArrowDown');
await page1.keyboard.press('Enter');
//ввести объём бетона
const modal = page1.locator('.ant-modal:visible');
const volumeInput = modal.locator('input[placeholder*="Объём"]').first();
await volumeInput.waitFor({ state: 'visible' });
await volumeInput.click({ clickCount: 3 }); 
await volumeInput.press('Backspace'); 
await volumeInput.type('10', { delay: 120 });

}
// 
// шаблон для тестов
// test('#1111 name', async ({ page }) => {
// const page1 = await createAppeal?????(page);



// });