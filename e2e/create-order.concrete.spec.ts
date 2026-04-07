// #6240 создание стандартного заказа для товара, который имеет признак ГТР
// #4141 Создать заказ на бетон через быстрое добавление в корзину
// #4251 Создать заказ бетона с несколькими машинами
// #4345 Создать заказ с дробным числом
// #4346 Создать заказ с комментарием к ТТН  (не использовать)
// #4130 Создать заказ бетона с через карточку товара с ручной ценой
// #4232 Создать заказ бетона с изменением объема через листинг
// #4018 Создать заказ с бетоном через причину обращения "консультация"
// #4245 Создать заказ бетона с изменением цены через листинг

import { test, expect } from "@playwright/test";
import { createAppeal } from "../helpers/commands";
import { deleteAllPositions } from "../helpers/commands";
// import { addConcrete} from '../helpers/commands';
import { label, feature } from "allure-js-commons";
import {
  label as allureLabel,
  feature as allureFeature,
} from "allure-js-commons";

// https://allure.itlabs.io/project/28/test-cases/6240?treeId=58
test(
  "#6240 создание стандартного заказа для товара, который имеет признак ГТР",
  { tag: ["@regress"] },
  async ({ page }) => {
    label("tag", "regress");
    feature("Auth");
    const { page: page1 } = await createAppeal(page);
    await page1.locator('[data-test="select-appeal"]').click();
    await page1
      .locator('[data-test="select-appeal"] li')
      .filter({ hasText: "Новый заказ" })
      .click();
    // выбираем сбытовую
    await page1.locator('[data-test="sale-orgs"]').click();
    const option = page1.locator('.ant-select-dropdown [data-test="1000"]');
    await option.scrollIntoViewIfNeeded();
    await option.click();
    await page1.locator(".ant-select-selection-overflow").click();
    await page1.getByText("РЦ Тмн, 50 лет Октября, 109 ко").click();
    await page1.locator('[data-test="search-input"]').click();
    await page1.locator('[data-test="search-input"]').fill("14904");
    await page1.locator('[data-test="search-button"]').click();
    await page1.locator('[data-test="shopping-card-button"]').first().click();
    await page1.getByRole("button", { name: "Добавить" }).click();
    await page1.locator('[data-test="to-cart-button"]').click();
    await page1.locator('[data-test="make-order"]').click();
    await expect(page1.getByText("Заказ успешно создан")).toBeVisible();
    await page1.locator("[data-test=send-sms]").click();
    await page1.locator("[data-test=pattern-sms]").click();
    await page1.getByText("Заказ. Номер сумма, адрес самовывоза").click();
    await page1.locator("[data-test=send-sms-for]").click();
    await expect(
      page1.getByText("Сообщение успешно отправлено!"),
    ).toBeVisible();
    await expect(
      page1.locator('[data-test="delete-all-position"]'),
    ).toBeVisible();
    await deleteAllPositions(page1);
  },
);

//https://allure.itlabs.io/project/28/test-cases/4141?treeId=58
test(
  "#4141Создать заказ на бетон через быстрое добавление в корзину",
  { tag: ["@regress"] },
  async ({ page }) => {
    label("tag", "regress");
    feature("Auth");
    const { page: page1 } = await createAppeal(page);
    await page1.locator('[data-test="select-appeal"]').click();
    await page1
      .locator('[data-test="select-appeal"] li')
      .filter({ hasText: "Новый заказ" })
      .click();

    await page1.locator('[data-test="search-input"]').click();
    await page1.locator('[data-test="search-input"]').fill("бетон");
    await page1.locator('[data-test="search-button"]').click();
    await page1.locator('[data-test="shopping-card-button"]').first().click();
    await page1.locator("[data-test=add-quantity-input]").click();
    await page1.locator("[data-test=add-quantity-input]").fill("6");
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
    // Нажимаем "Добавить машину"
    await page.waitForTimeout(3000);
    await page1.getByText("Добавить машину").click();
    await page1.locator('[data-test="cars-type"]').click();
    await page1.getByText("Бетоновоз 6м3").click();
    //выбрать время
    const timeInput = page1.locator(
      '[data-test="cars-time-0"] input[role="combobox"]',
    );
    await timeInput.click();
    await page1.keyboard.press("ArrowDown");
    await page1.keyboard.press("Enter");
    //ввести объём бетона
    await page1.locator('[data-test="volume-car-0"]').fill("6");
    await page1.locator(".ant-btn-primary", { hasText: "Добавить" }).click();
    //
    await page1.locator('[data-test="to-cart-button"]').click();
    await page1.locator('[data-test="make-order"]').click();
    await expect(page1.getByText("Заказ успешно создан")).toBeVisible();
  },
);

// allure.itlabs.io/project/28/test-cases/4345?treeId=58
test(
  "#4345 Создать заказ с дробным числом",
  { tag: ["@regress"] },
  async ({ page }) => {
    label("tag", "regress");
    feature("Auth");
    const { page: page1 } = await createAppeal(page);
    await page1.locator('[data-test="select-appeal"]').click();
    await page1
      .locator('[data-test="select-appeal"] li')
      .filter({ hasText: "Новый заказ" })
      .click();
    // выбираем сбытовую
    await page1.locator('[data-test="sale-orgs"]').click();
    const option = page1.locator('.ant-select-dropdown [data-test="1000"]');
    await option.scrollIntoViewIfNeeded();
    await option.click();
    await page1.locator('[data-test="search-input"]').click();
    await page1.locator('[data-test="search-input"]').fill("бетон");
    await page1.locator('[data-test="search-button"]').click();
    await page1.locator('[data-test="shopping-card-button"]').first().click();
    await page1.locator("[data-test=add-quantity-input]").fill("10,5");
    await expect(page1.locator("[data-test=add-quantity-input]")).toHaveValue(
      "10,5",
    );
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
    // Нажимаем "Добавить машину"
    await page.waitForTimeout(3000);
    await page1.getByText("Добавить машину").click();
    await page1.locator('[data-test="cars-type"]').click();
    await page1.getByText("Бетоновоз 12м3").click();
    //выбрать время
    const timeInput = page1.locator(
      '[data-test="cars-time-0"] input[role="combobox"]',
    );
    await timeInput.click();
    await page1.keyboard.press("ArrowDown");
    await page1.keyboard.press("Enter");
    //ввести объём бетона
    await page1.locator('[data-test="volume-car-0"]').fill("10.5");
    await page1.locator(".ant-btn-primary", { hasText: "Добавить" }).click();
    await page1.locator('[data-test="to-cart-button"]').click();
    await page1.locator('[data-test="make-order"]').click();
    await expect(page1.getByText("Заказ успешно создан")).toBeVisible();
  },
);

// allure.itlabs.io/project/28/test-cases/4346?treeId=58
test(
  "#4346 Создать заказ с комментарием к ТТН",
  { tag: ["@regress"] },
  async ({ page }) => {
    label("tag", "regress");
    feature("Auth");
    const { page: page1 } = await createAppeal(page);
    await page1.locator('[data-test="select-appeal"]').click();
    await page1
      .locator('[data-test="select-appeal"] li')
      .filter({ hasText: "Новый заказ" })
      .click();

    await page1.locator('[data-test="search-input"]').click();
    await page1.locator('[data-test="search-input"]').fill("бетон");
    await page1.locator('[data-test="search-button"]').click();
    await page1.locator('[data-test="shopping-card-button"]').first().click();
    await page1.locator("[data-test=add-quantity-input]").click();
    await page1.locator("[data-test=add-quantity-input]").fill("10");
    await expect(page1.locator("[data-test=add-quantity-input]")).toHaveValue(
      "10",
    );
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
    // Нажимаем "Добавить машину"
    await page.waitForTimeout(3000);
    await page1.getByText("Добавить машину").click();
    await page1.locator('[data-test="cars-type"]').click();
    await page1.getByText("Бетоновоз 10м3").click();
    //выбрать время
    const timeInput = page1.locator(
      '[data-test="cars-time-0"] input[role="combobox"]',
    );
    await timeInput.click();
    await page1.keyboard.press("ArrowDown");
    await page1.keyboard.press("Enter");
    //ввести объём бетона
    await page1.locator('[data-test="volume-car-0"]').fill("10");
    await page1.locator("[data-test=comment-car]").fill("тестовый комментарий");
    await expect(
      page1.locator('[data-test="data-test=comment-car"]'),
    ).toHaveText("тестовый комментарий");
    await page1.locator(".ant-btn-primary", { hasText: "Добавить" }).click();
    await page1.locator('[data-test="to-cart-button"]').click();
    await page1.locator('[data-test="make-order"]').click();
    await expect(page1.getByText("Заказ успешно создан")).toBeVisible();
    await page1.locator('[data-test="cart-position"]').click();
  },
);

//https:allure.itlabs.io/project/28/test-cases/4130?treeId=58
test(
  "#4130 Создать заказ бетона с через карточку товара с ручной ценой",
  { tag: ["@regress"] },
  async ({ page }) => {
    label("tag", "regress");
    feature("Auth");
    const { page: page1 } = await createAppeal(page);
    await page1.locator('[data-test="select-appeal"]').click();
    await page1
      .locator('[data-test="select-appeal"] li')
      .filter({ hasText: "Новый заказ" })
      .click();
    // выбираем сбытовую
    await page1.locator('[data-test="sale-orgs"]').click();
    const option = page1.locator('.ant-select-dropdown [data-test="1000"]');
    await option.scrollIntoViewIfNeeded();
    await option.click();
    await page1.locator('[data-test="search-input"]').click();
    await page1.locator('[data-test="search-input"]').fill("бетон");
    await page1.locator('[data-test="search-button"]').click();
    await page1.locator("[data-test=product-link]").first().click();
    await page1.locator('[data-test="add-quantity-input"]').clear();
    await page1.waitForTimeout(3000);
    await page1.locator('[data-test="add-quantity-input"]').fill("6");
    await page1.locator('[data-test="add-position"]').click();
    // вводим ручную цену
    const input = page1.locator('[data-test="input-price-modal-0"]');
    await input.clear();
    await input.fill("8000");
    // проверка, что в value будет '8000'
    await expect(input).toHaveValue("8 000");
    // если нет, делаем повторный ввод
    try {
      await expect(input).toHaveValue("8 000", { timeout: 500 });
    } catch {
      await input.clear();
      await input.fill("8 000");
      await expect(input).toHaveValue("8 000");
    }
    await page1.locator("[data-test=delivery-address]").fill("Агеева");
    await page1.getByText("Агеева").first().click();
    await page1.locator('input[placeholder*="Выберите дату"]').click();
    //определяем текущую дату и добавляем к ней 2 дн
    const today = new Date();
    const targetDate = new Date(today);
    targetDate.setDate(today.getDate() + 2);

    const year = targetDate.getFullYear();
    const month = String(targetDate.getMonth() + 1).padStart(2, "0");
    const day = String(targetDate.getDate()).padStart(2, "0");

    const targetDateFormatted = `${year}-${month}-${day}`;
    await page1.locator(`td[title="${targetDateFormatted}"]`).click();
    await page1.waitForTimeout(3000);
    await page1.locator('[data-test="add-car-concrete"]').click();
    //
    await page1.locator('[data-test="cars-type"]').click();
    await page1.getByText("Бетоновоз 10м3").click();
    //выбрать время
    const timeInput = page1.locator(
      '[data-test="cars-time-0"] input[role="combobox"]',
    );
    await timeInput.click();
    await page1.keyboard.press("ArrowDown");
    await page1.keyboard.press("Enter");
    //ввести объём бетона
    await page1.locator('[data-test="volume-car-0"]').fill("6");
    const modal = page1.locator(".ant-modal:visible"); // текущее открытое модальное окно
    await modal.locator(".ant-btn-primary", { hasText: "Добавить" }).click();
    await page1.locator('[data-test="to-cart-button"]').click();
    await page1.waitForSelector('[data-test="make-order"]', {
      state: "visible",
    });
    await page1.locator('[data-test="make-order"]').click();
    await expect(
      page1.locator('[class*="position-price-container"] span'),
    ).toHaveText("8 000 ₽");
  },
);

//https://allure.itlabs.io/project/28/test-cases/4232?treeId=58
test("#4232 Создать заказ бетона с изменением объема через листинг", async ({
  page,
}) => {
  const { page: page1 } = await createAppeal(page);
  await page1.locator('[data-test="select-appeal"]').click();
  await page1
    .locator('[data-test="select-appeal"] li')
    .filter({ hasText: "Новый заказ" })
    .click();

  await page1.locator('[data-test="search-input"]').click();
  await page1.locator('[data-test="search-input"]').fill("бетон");
  await page1.locator('[data-test="search-button"]').click();
  await page1.locator('[data-test="shopping-card-button"]').first().click();
  await page1.locator("[data-test=add-quantity-input]").click();
  await page1.locator("[data-test=add-quantity-input]").fill("10");
  await page1.locator("[data-test=delivery-address]").fill("Агеева");
  await page1.getByText("Агеева").first().click();
  await page1.locator('input[placeholder*="Выберите дату"]').click();
  //определяем текущую дату и добавляем к ней 2 дн
  const today = new Date();
  const targetDate = new Date(today);
  targetDate.setDate(today.getDate() + 2);

  const year = targetDate.getFullYear();
  const month = String(targetDate.getMonth() + 1).padStart(2, "0");
  const day = String(targetDate.getDate()).padStart(2, "0");

  const targetDateFormatted = `${year}-${month}-${day}`;
  await page1.locator(`td[title="${targetDateFormatted}"]`).click();
  await page1.waitForTimeout(3000);
  // Нажимаем "Добавить машину"
  await page1.getByText("Добавить машину").click({ trial: true });
  await page1.getByText("Добавить машину").click();
  await page1.locator('[data-test="cars-type"]').click();
  await page1.getByText("Бетоновоз 12м3").click();
  //выбрать время
  const timeInput = page1.locator(
    '[data-test="cars-time-0"] input[role="combobox"]',
  );
  await timeInput.click();
  await page1.keyboard.press("ArrowDown");
  await page1.keyboard.press("Enter");
  //ввести объём бетона
  await page1.locator('[data-test="volume-car-0"]').fill("10");
  await page1.locator(".ant-btn-primary", { hasText: "Добавить" }).click();
  await page1.locator('[data-test="to-cart-button"]').click();
  await page1.locator('[data-test="cart-position"]').click();
  //ввести объём бетона
  await page1.locator('input[placeholder*="Объём"]').fill("9");
  await page1.locator('[data-test="add-quantity-input"]').fill("9");
  const saveButton = page1.locator(".ant-btn-primary", {
    hasText: "Сохранить",
  });
  // Проверяем, что кнопка видима и активна
  await expect(saveButton).toBeVisible();
  await expect(saveButton).toBeEnabled();
  //  после этого кликаем
  await saveButton.click();
  await page1.locator('[data-test="make-order"]').click();
  await expect(page1.getByText("Заказ №")).toBeVisible();
  await expect(page1.getByText("9 м3. х")).toBeVisible();
});

//https://allure.itlabs.io/project/28/test-cases/4018?treeId=58
test(
  '#4018 Создать заказ с бетоном через причину обращения "консультация"',
  { tag: ["@regress"] },
  async ({ page }) => {
    label("tag", "regress");
    feature("Auth");
    const { page: page1 } = await createAppeal(page);
    await page1.locator('[data-test="select-appeal"]').click();
    await page1
      .locator('[data-test="select-appeal"] li')
      .filter({ hasText: "Консультация Материалы / Услуги" })
      .click();
    // выбираем сбытовую
    await page1.locator('[data-test="sale-orgs"]').click();
    const option = page1.locator('.ant-select-dropdown [data-test="1000"]');
    await option.scrollIntoViewIfNeeded();
    await option.click();
    await page1.locator('[data-test="search-input"]').click();
    await page1.locator('[data-test="search-input"]').fill("бетон");
    await page1.locator('[data-test="search-button"]').click();
    await page1.locator('[data-test="shopping-card-button"]').first().click();
    await page1.locator("[data-test=add-quantity-input]").click();
    await page1.locator("[data-test=add-quantity-input]").fill("10");
    await page1.locator("[data-test=delivery-address]").fill("Агеева");
    await page1.getByText("Агеева").first().click();
    await page1.locator('input[placeholder*="Выберите дату"]').click();
    //определяем текущую дату и добавляем к ней 2 дн
    const today = new Date();
    const targetDate = new Date(today);
    targetDate.setDate(today.getDate() + 2);

    const year = targetDate.getFullYear();
    const month = String(targetDate.getMonth() + 1).padStart(2, "0");
    const day = String(targetDate.getDate()).padStart(2, "0");

    const targetDateFormatted = `${year}-${month}-${day}`;
    await page1.locator(`td[title="${targetDateFormatted}"]`).click();
    await page1.waitForTimeout(3000);
    // Нажимаем "Добавить машину"
    await page1.getByText("Добавить машину").click({ trial: true });
    await page1.getByText("Добавить машину").click();
    await page1.locator('[data-test="cars-type"]').click();
    await page1.getByText("Бетоновоз 12м3").click();
    //выбрать время
    const timeInput = page1.locator(
      '[data-test="cars-time-0"] input[role="combobox"]',
    );
    await timeInput.click();
    await page1.keyboard.press("ArrowDown");
    await page1.keyboard.press("Enter");
    //ввести объём бетона
    await page1.locator('[data-test="volume-car-0"]').fill("10");
    await page1.locator(".ant-btn-primary", { hasText: "Добавить" }).click();
    await page1.locator('[data-test="to-cart-button"]').click();
    await page1.locator('[data-test="make-order"]').click();
    await expect(page1.getByText("Заказ №")).toBeVisible();
    await expect(page1.getByText("10 м3. х")).toBeVisible();
  },
);

//https://allure.itlabs.io/project/28/test-cases/4245?treeId=58
test("#4245 Создать заказ бетона с изменением цены через листинг", async ({
  page,
}) => {
  const { page: page1 } = await createAppeal(page);
  await page1.locator('[data-test="select-appeal"]').click();
  await page1
    .locator('[data-test="select-appeal"] li')
    .filter({ hasText: "Новый заказ" })
    .click();

  // закрыть подсказку "здравствуйте меня зовут ....."
  await page1.locator(".ant-notification-notice-close").click();
  await page1.locator('[data-test="search-input"]').click();
  await page1.locator('[data-test="search-input"]').fill("бетон");
  await page1.locator('[data-test="search-button"]').click();
  await page1.locator('[data-test="shopping-card-button"]').first().click();
  await page1.locator("[data-test=add-quantity-input]").click();
  await page1.locator("[data-test=add-quantity-input]").fill("10");
  const priceDigits = "8500";
  const priceInput = page1.locator('[data-test="input-price-modal-0"]');
  await priceInput.fill(priceDigits);
  //сравниваем по цифрам
  const priceValueDigits = (await priceInput.inputValue()).replace(/\D/g, "");
  expect(priceValueDigits).toBe(priceDigits);
  //
  await page1.locator("[data-test=delivery-address]").fill("Агеева");
  await page1.getByText("Агеева").first().click();
  await page1.locator('input[placeholder*="Выберите дату"]').click();
  //определяем текущую дату и добавляем к ней 2 дн
  const today = new Date();
  const targetDate = new Date(today);
  targetDate.setDate(today.getDate() + 2);

  const year = targetDate.getFullYear();
  const month = String(targetDate.getMonth() + 1).padStart(2, "0");
  const day = String(targetDate.getDate()).padStart(2, "0");

  const targetDateFormatted = `${year}-${month}-${day}`;
  await page1.locator(`td[title="${targetDateFormatted}"]`).click();
  await page1.waitForTimeout(3000);
  // Нажимаем "Добавить машину"
  await page1.getByText("Добавить машину").click({ trial: true });
  await page1.getByText("Добавить машину").click();
  await page1.locator('[data-test="cars-type"]').click();
  await page1.getByText("Бетоновоз 10м3").click();
  //выбрать время
  const timeInput = page1.locator(
    '[data-test="cars-time-0"] input[role="combobox"]',
  );
  await timeInput.click();
  await page1.keyboard.press("ArrowDown");
  await page1.keyboard.press("Enter");
  //ввести объём бетона
  await page1.locator('[data-test="volume-car-0"]').fill("10");
  await page1.locator(".ant-btn-primary", { hasText: "Добавить" }).click();
  await page1.locator('[data-test="to-cart-button"]').click();
  await page1.locator('[data-test="make-order"]').click();
  await expect(page1.getByText("Заказ №")).toBeVisible();
  await expect(page1.getByText("10 м3. х")).toBeVisible();
  //
  const unitPriceRub = page1.locator('span:has-text("₽")').first();
  await expect(unitPriceRub).toBeVisible({ timeout: 30_000 });
  const unitPriceContainer = unitPriceRub.locator("xpath=ancestor::div[1]");
  // убеждаемся, что это строка вида "... x ... ₽"
  await expect(unitPriceContainer).toContainText("8 500");
  const unitDigits = (await unitPriceRub.innerText()).replace(/\D/g, "");
  expect(unitDigits).toBe(priceDigits);
});
