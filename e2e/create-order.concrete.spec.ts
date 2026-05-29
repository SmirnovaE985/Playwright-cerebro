// #6240 создание стандартного заказа для товара, который имеет признак ГТР
// #4141 Создать заказ на бетон через быстрое добавление в корзину

import { test, expect } from "@playwright/test";
import { createAppeal } from "../helpers/commands";
import { deleteAllPositions } from "../helpers/commands";
import { label, feature } from "allure-js-commons";
import { AppealStartPage } from "../pages/appeal/AppealStartPage";
import { OrderCreatePage } from "../pages/order/OrderCreatePage";
import { ConcreteComponent } from "../pages/components/ComponentPage";

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

    await appealStartPage.selectSaleOrg("1000");
    await appealStartPage.openAppealSelector();
    await appealStartPage.chooseNewOrder();

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
test.skip(
  "#4141Создать заказ на бетон через быстрое добавление в корзину",
  { tag: ["@regress"] },
  async ({ page }) => {
    label("tag", "regress");
    feature("Auth");

    const { page: page1 } = await createAppeal(page);

    const appealStartPage = new AppealStartPage(page1);
    const orderCreatePage = new OrderCreatePage(page1);

    await appealStartPage.selectSaleOrg("1000");
    await appealStartPage.openAppealSelector();
    await appealStartPage.chooseNewOrder();

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

// //https://allure.itlabs.io/project/28/test-cases/4141?treeId=58
test.skip(
  "заказ на бетон не доступен в церебро, не использовать",
  { tag: ["@regress"] },
  async ({ page }) => {
    label("tag", "regress");
    feature("Auth");

    const { page: page1 } = await createAppeal(page);

    const appealStartPage = new AppealStartPage(page1);
    const orderCreatePage = new OrderCreatePage(page1);
    const concreteComponent = new ConcreteComponent(page1);

    await appealStartPage.selectSaleOrg("1000");
    await appealStartPage.openAppealSelector();
    await appealStartPage.chooseNewOrder();

    await orderCreatePage.searchProduct("бетон");
    await orderCreatePage.openFirstProductCard();

    await concreteComponent.saveConcreteCar({
      quantity: "6",
      address: "Агеева 141",
      comment: "Позвонить за час",
    });

    await orderCreatePage.goToCart();
    await orderCreatePage.makeOrder();
    await orderCreatePage.expectOrderCreatedSuccess();
  },
);
