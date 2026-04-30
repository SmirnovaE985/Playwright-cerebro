// #6240 создание стандартного заказа для товара, который имеет признак ГТР
// #4141 Создать заказ на бетон через быстрое добавление в корзину
// #4345 Создать заказ с дробным числом
// #4346 Создать заказ с комментарием к ТТН  (не использовать)
// #4130 Создать заказ бетона с через карточку товара с ручной ценой
// #4232 Создать заказ бетона с изменением объема через листинг   !!!!!!!!!!!!!
// #4018 Создать заказ с бетоном через причину обращения "консультация"
// #4245 Создать заказ бетона с изменением цены через листинг

import { test, expect } from "@playwright/test";
import { createAppeal } from "../helpers/commands";
import { deleteAllPositions } from "../helpers/commands";
import { label, feature } from "allure-js-commons";
import {
  label as allureLabel,
  feature as allureFeature,
} from "allure-js-commons";
import { AppealStartPage } from "../pages/appeal/AppealStartPage";
import { OrderCreatePage } from "../pages/order/OrderCreatePage";

// https://allure.itlabs.io/project/28/test-cases/6240?treeId=58
test(
  "#6240 создание стандартного заказа для товара, который имеет признак ГТР",
  { tag: ["@regress"] },
  async ({ page }) => {
    label("tag", "regress");
    feature("Auth");

    const { page: page1 } = await createAppeal(page);

    const appealStartPage = new AppealStartPage(page1);
    const orderCreatePage = new OrderCreatePage(page1);

    await appealStartPage.selectNewOrder();
    await appealStartPage.selectSaleOrg("1000");

    await orderCreatePage.selectObject("РЦ Тмн, 50 лет Октября, 109 ко");
    await orderCreatePage.searchProduct("14904");
    await orderCreatePage.openFirstProductCard();
    await orderCreatePage.addButtonInCart();
    await orderCreatePage.goToCart();
    await orderCreatePage.makeOrder();
    await orderCreatePage.expectOrderCreatedSuccess();

    await orderCreatePage.sendSmsWithPattern(
      "Заказ. Номер сумма, адрес самовывоза",
    );
    await orderCreatePage.expectSmsSentSuccess();
    await orderCreatePage.expectDeleteAllPositionsVisible();

    await deleteAllPositions(page1);
  },
);

// //https://allure.itlabs.io/project/28/test-cases/4141?treeId=58
test(
  "#4141Создать заказ на бетон через быстрое добавление в корзину",
  { tag: ["@regress"] },
  async ({ page }) => {
    label("tag", "regress");
    feature("Auth");

    const { page: page1 } = await createAppeal(page);

    const appealStartPage = new AppealStartPage(page1);
    const orderCreatePage = new OrderCreatePage(page1);

    await appealStartPage.selectNewOrder();

    await orderCreatePage.searchProduct("бетон");
    await orderCreatePage.openFirstProductCard();
    await orderCreatePage.fillQuickAddQuantity("6");
    await orderCreatePage.fillDeliveryAddress("Агеева");
    await orderCreatePage.selectTomorrowDeliveryDate();
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
    await orderCreatePage.submitAddedCar();
    await orderCreatePage.goToCart();
    await orderCreatePage.makeOrder();
    await orderCreatePage.expectOrderCreatedSuccess();
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

    const appealStartPage = new AppealStartPage(page1);
    const orderCreatePage = new OrderCreatePage(page1);

    await appealStartPage.selectNewOrder();

    await orderCreatePage.searchProduct("бетон");
    await orderCreatePage.openFirstProductCard();
    await orderCreatePage.fillQuickAddQuantity("10,5");
    await orderCreatePage.fillDeliveryAddress("Агеева");
    await orderCreatePage.selectTomorrowDeliveryDate();
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

    await orderCreatePage.submitAddedCar();
    await orderCreatePage.goToCart();
    await orderCreatePage.makeOrder();
    await orderCreatePage.expectOrderCreatedSuccess();
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

    const appealStartPage = new AppealStartPage(page1);
    const orderCreatePage = new OrderCreatePage(page1);

    await appealStartPage.selectNewOrder();

    await orderCreatePage.searchProduct("бетон");
    await orderCreatePage.openFirstProductCard();
    await orderCreatePage.fillQuickAddQuantity("10");
    await orderCreatePage.fillDeliveryAddress("Агеева");
    await orderCreatePage.selectTomorrowDeliveryDate();
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
    await page.waitForTimeout(3000);
    await orderCreatePage.fillCarComment("тестовый комментарий");
    await orderCreatePage.expectCarCommentToHaveValue("тестовый комментарий");
    await orderCreatePage.submitAddedCar();
    await orderCreatePage.goToCart();
    await orderCreatePage.makeOrder();
    await orderCreatePage.expectOrderCreatedSuccess();
    await orderCreatePage.openCartPosition(0);
    await orderCreatePage.expectCarCommentToHaveValue("тестовый комментарий");
  },
);

//https:allure.itlabs.io/project/28/test-cases/4130?treeId=58
test(
  "#4130 Создать заказ бетона с ручной ценой",
  { tag: ["@regress"] },
  async ({ page }) => {
    label("tag", "regress");
    feature("Auth");
    const { page: page1 } = await createAppeal(page);

    const appealStartPage = new AppealStartPage(page1);
    const orderCreatePage = new OrderCreatePage(page1);

    await appealStartPage.selectNewOrder();

    await orderCreatePage.searchProduct("бетон");
    await orderCreatePage.openFirstProductCard();
    await orderCreatePage.fillQuickAddQuantity("6");
    // вводим ручную цену
    await page.waitForTimeout(3000);
    const input = page1.locator('[data-test="input-price-modal-0"]');
    await input.clear();
    await input.fill("8100");
    // проверка, что в value будет '8100'
    await expect(input).toHaveValue("8 100");
    // если нет, делаем повторный ввод
    try {
      await expect(input).toHaveValue("8 100", { timeout: 500 });
    } catch {
      await input.clear();
      await input.fill("8 100");
      await expect(input).toHaveValue("8 100");
    }

    await orderCreatePage.fillDeliveryAddress("Агеева");
    await orderCreatePage.selectTomorrowDeliveryDate();
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

    await orderCreatePage.submitAddedCar();
    await orderCreatePage.goToCart();
    await orderCreatePage.makeOrder();
    await orderCreatePage.expectOrderCreatedSuccess();
    await expect(
      page1.locator('[class*="position-price-container"] span'),
    ).toHaveText("8 100 ₽");
  },
);

//https://allure.itlabs.io/project/28/test-cases/4232?treeId=58
test(
  "#4232 Создать заказ бетона с изменением объема из корзины",
  { tag: ["@regress"] },
  async ({ page }) => {
    label("tag", "regress");
    feature("Auth");
    const { page: page1 } = await createAppeal(page);

    const appealStartPage = new AppealStartPage(page1);
    const orderCreatePage = new OrderCreatePage(page1);

    await appealStartPage.selectNewOrder();

    await orderCreatePage.searchProduct("бетон");
    await orderCreatePage.openFirstProductCard();
    await orderCreatePage.fillQuickAddQuantity("10");
    await orderCreatePage.fillDeliveryAddress("Агеева");
    await orderCreatePage.selectTomorrowDeliveryDate();
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

    await orderCreatePage.submitAddedCar();
    await orderCreatePage.goToCart();
    await orderCreatePage.makeOrder();
    await orderCreatePage.expectOrderCreatedSuccess();
    await orderCreatePage.openCartPosition(0);
    await orderCreatePage.fillQuickAddQuantity("5");
    await orderCreatePage.selectTomorrowDeliveryDate();
    // Нажимаем "Добавить машину"
    await page.waitForTimeout(3000);
    await page1.locator('[data-test="cars-type"]').click();
    await page1.getByText("Бетоновоз 6м3").click();
    //выбрать время
    const timeInput2 = page1.locator(
      '[data-test="cars-time-0"] input[role="combobox"]',
    );
    await timeInput2.click();
    await page1.keyboard.press("ArrowDown");
    await page1.keyboard.press("Enter");
    //ввести объём бетона
    await page1.locator('[data-test="volume-car-0"]').fill("5");
    await orderCreatePage.submitSavedCar();
    await page1.locator('[data-test="save-order"]').click();
    const btn = page.locator("button.ant-btn.ant-btn-primary", {
      hasText: "Сохранить заказ",
    });
    if (await btn.count()) {
      await btn.first().click();
    }
  },
);

//https://allure.itlabs.io/project/28/test-cases/4018?treeId=58
test(
  '#4018 Создать заказ с бетоном через причину обращения "консультация"',
  { tag: ["@regress"] },
  async ({ page }) => {
    label("tag", "regress");
    feature("Auth");
    const { page: page1 } = await createAppeal(page);

    const appealStartPage = new AppealStartPage(page1);
    const orderCreatePage = new OrderCreatePage(page1);
    await appealStartPage.openAppealSelector();
    await appealStartPage.chooseConsultationMaterialsServices();

    await orderCreatePage.searchProduct("бетон");
    await orderCreatePage.openFirstProductCard();
    await orderCreatePage.fillQuickAddQuantity("10");
    await orderCreatePage.fillDeliveryAddress("Агеева");
    await orderCreatePage.selectTomorrowDeliveryDate();
    // Нажимаем "Добавить машину"
    await page.waitForTimeout(3000);
    await page1.locator('[data-test="add-car-concrete"]').click();
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
    await orderCreatePage.submitAddedCar();
    await orderCreatePage.goToCart();
    await orderCreatePage.makeOrder();
    await orderCreatePage.expectOrderCreatedSuccess();
    await expect(page1.getByText("10 м3. х")).toBeVisible();
  },
);

//https://allure.itlabs.io/project/28/test-cases/4245?treeId=58
test("#4245 Создать заказ бетона с изменением цены через листинг", async ({
  page,
}) => {
  const { page: page1 } = await createAppeal(page);
  const orderCreatePage = new OrderCreatePage(page1);
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
  await orderCreatePage.fillDeliveryAddress("Агеева");
  await orderCreatePage.selectTomorrowDeliveryDate();
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
  await orderCreatePage.submitAddedCar();
  await orderCreatePage.goToCart();
  await orderCreatePage.makeOrder();
  await orderCreatePage.expectOrderCreatedSuccess();
  //
  const unitPriceRub = page1.locator('span:has-text("₽")').first();
  await expect(unitPriceRub).toBeVisible({ timeout: 30_000 });
  const unitPriceContainer = unitPriceRub.locator("xpath=ancestor::div[1]");
  // убеждаемся, что это строка вида "... x ... ₽"
  await expect(unitPriceContainer).toContainText("8 500");
  const unitDigits = (await unitPriceRub.innerText()).replace(/\D/g, "");
  expect(unitDigits).toBe(priceDigits);
});
