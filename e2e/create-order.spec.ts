// #4609 Перевод предложения в заказ (POM)
// #5301 Создание нового заказа, после закрытия старого заказа и возврата в поиск (POM)
// #4605 Отмена позиции до и после создания заказа (POM)
// #5664 Создание стандартного заказа через мессенджер, со сменой ЕИ (POM)
// #4584 Создание заказа с нескольких магазинов (POM)
// #4608 Создание заказа с отрезным материалом с БМ или МОК (POM)
// #6290 Создание заказа с отрезным материалом с РЦ  (POM)
// #5929 создание заказа с колеровкой, другим товаром (POM)
// #5927 создание и изменение в заказе с несколькими колеровками  (POM)

import { label, feature } from "allure-js-commons";
import {
  createAppeal,
  deleteAllPositions,
  createOrder,
} from "../helpers/commands";
import { AppealStartPage } from "../pages/appeal/AppealStartPage";
import { OrderCreatePage } from "../pages/order/OrderCreatePage";
import { test, expect } from "@playwright/test";

// https://allure.itlabs.io/project/28/test-cases/4609?treeId=58
test(
  "#4609 Перевод предложения в заказ",
  { tag: ["@regress"] },
  async ({ page }) => {
    label("tag", "regress");
    feature("Auth");
    const { page: page1, phoneNumber } = await createOrder(page, {
      makeOrder: false,
      searchText: "цемент",
      quantity: 1,
    });

    const appealStartPage = new AppealStartPage(page1);
    const orderCreatePage = new OrderCreatePage(page1);
    await orderCreatePage.closeNotification();
    await orderCreatePage.makeOffer();
  },
);

// https://allure.itlabs.io/project/28/test-cases/5301?treeId=58
test(
  "#5301 Создание нового заказа, после закрытия старого заказа и возврата в поиск",
  { tag: ["@regress"] },
  async ({ page }) => {
    label("tag", "regress");
    feature("Auth");
    const { page: page1, phoneNumber } = await createOrder(page, {
      makeOrder: true,
      searchText: "цемент",
      quantity: 1,
    });

    const appealStartPage = new AppealStartPage(page1);
    const orderCreatePage = new OrderCreatePage(page1);

    await orderCreatePage.closeNotification();
    await orderCreatePage.closeOrder();
    await page1.getByText("Перейти в поиск").click();
    await orderCreatePage.searchProduct("кисть");
    await orderCreatePage.openFirstProductCard();
    await orderCreatePage.addButtonInCart();

    await orderCreatePage.goToCart();
    await orderCreatePage.makeOrder();

    await orderCreatePage.expectOrderCreatedSuccess();
    await deleteAllPositions(page1);
  },
);

//https://allure.itlabs.io/project/28/test-cases/4605?treeId=58
test(
  "#4605 Отмена позиции до и после создания заказа",
  { tag: ["@regress"] },
  async ({ page }) => {
    label("tag", "regress");
    feature("Auth");
    const { page: page1 } = await createAppeal(page);

    const appealStartPage = new AppealStartPage(page1);
    const orderCreatePage = new OrderCreatePage(page1);

    await appealStartPage.openAppealSelector();
    await appealStartPage.chooseNewOrder();
    await appealStartPage.selectSaleOrg("1000");
    await orderCreatePage.selectObject("РЦ Тмн, 50 лет Октября, 109 ко");

    await orderCreatePage.searchProduct("цемент");
    await orderCreatePage.openFirstProductCard();
    await orderCreatePage.addButtonInCart();
    //
    await orderCreatePage.searchProduct("ведро");
    await orderCreatePage.openFirstProductCard();
    await orderCreatePage.addButtonInCart();

    await orderCreatePage.goToCart();
    await orderCreatePage.closeNotification();

    const positionsCountBeforeDelete =
      await orderCreatePage.getCartPositionsCount();

    await orderCreatePage.deleteCartPosition(0);

    const positionsCountAfterDelete =
      await orderCreatePage.getCartPositionsCount();
    await orderCreatePage.makeOrder();

    await orderCreatePage.expectOrderCreatedSuccess();

    await orderCreatePage.expectCartPositionsCountToBe(
      positionsCountAfterDelete,
    );
    await orderCreatePage.saveOrder();
    await deleteAllPositions(page1);
  },
);

// https://allure.itlabs.io/project/28/test-cases/5664?treeId=58
test(
  "#5664 Создание стандартного заказа через мессенджер, со сменой ЕИ",
  { tag: ["@regress"] },
  async ({ page }) => {
    label("tag", "regress");
    feature("Auth");
    function normalizePrice(value: string | null | undefined): string {
      return String(value ?? "").replace(/[^0-9]/g, "");
    }
    const { page: page1, phoneNumber } = await createAppeal(page, {
      contactType: "Мессенджер",
      contactValue: "(910)0000056",
    });

    const appealStartPage = new AppealStartPage(page1);
    const orderCreatePage = new OrderCreatePage(page1);

    await appealStartPage.openAppealSelector();
    await appealStartPage.chooseNewOrder();
    await appealStartPage.selectSaleOrg("1000");
    await orderCreatePage.selectObject("РЦ Тмн, 50 лет Октября, 109 ко");

    await orderCreatePage.searchProduct("цемент");
    await orderCreatePage.openFirstProductCard();
    await orderCreatePage.addButtonInCart();
    await orderCreatePage.goToCart();
    await orderCreatePage.closeNotification();

    await orderCreatePage.openCartPosition(0);
    const priceBeforeUnitChange =
      await orderCreatePage.getModalEditInputPriceNormalized();
    await orderCreatePage.changeUnit("1пар. = 2меш.");
    await orderCreatePage.waitModalEditInputPriceChanged(priceBeforeUnitChange);
    const expectedTotalCost =
      await orderCreatePage.getModalEditInputPriceNormalized();
    await orderCreatePage.saveEditedPosition();

    await orderCreatePage.makeOrder();

    await orderCreatePage.expectCartTotalCostToBe(expectedTotalCost);
    await orderCreatePage.expectOrderCreatedSuccess();
    await deleteAllPositions(page1);
  },
);

// https://allure.itlabs.io/project/28/test-cases/4584
test(
  "#4584 Создание заказа с нескольких магазинов",
  { tag: ["@regress"] },
  async ({ page }) => {
    label("tag", "regress");
    feature("Auth");
    const { page: page1 } = await createAppeal(page);

    const appealStartPage = new AppealStartPage(page1);
    const orderCreatePage = new OrderCreatePage(page1);

    await appealStartPage.openAppealSelector();
    await appealStartPage.chooseNewOrder();
    await appealStartPage.selectSaleOrg("1000");

    await orderCreatePage.selectObject([
      "БМ Ожогина Садовая 3А",
      "РЦ Тмн, 50 лет Октября, 109 ко",
      "БМ Тмн Московский тракт 5 км",
    ]);
    await orderCreatePage.searchProduct("перчатки");
    await orderCreatePage.openFirstProductCard();
    await orderCreatePage.fillQuantityForAllInputs("1");
    await orderCreatePage.addButtonInCart();
    await orderCreatePage.goToCart();
    await orderCreatePage.makeOrder();
    await orderCreatePage.expectOrderCreatedSuccess();
    await expect(page1.getByText("Заказ успешно создан")).toBeVisible();
    await expect(
      page1.getByText("РЦ Тмн, 50 лет Октября, 109 ко"),
    ).toBeVisible();
    await expect(page1.getByText("БМ Ожогина Садовая 3А")).toBeVisible();
    await expect(page1.getByText("БМ Тмн Московский тракт 5 км")).toBeVisible();
    await deleteAllPositions(page1);
  },
);

// https://allure.itlabs.io/project/28/test-cases/4608
test(
  "#6290 Создание заказа с отрезным материалом РЦ",
  { tag: ["@regress"] },
  async ({ page }) => {
    label("tag", "regress");
    feature("Auth");
    const { page: page1 } = await createAppeal(page);

    const appealStartPage = new AppealStartPage(page1);
    const orderCreatePage = new OrderCreatePage(page1);

    await appealStartPage.openAppealSelector();
    await appealStartPage.chooseNewOrder();
    await appealStartPage.selectSaleOrg("1000");

    await orderCreatePage.selectObject("РЦ Тмн, 50 лет Октября, 109 ко");
    await orderCreatePage.searchProduct("87745");
    await orderCreatePage.openFirstProductCard();

    await orderCreatePage.addButtonInCart();
    await orderCreatePage.goToCart();
    await orderCreatePage.openCartPosition(0);

    await orderCreatePage.changeUnit("пм.");

    await orderCreatePage.saveEditedPosition();

    await orderCreatePage.makeOrder();
    await expect(
      page1.getByText("Произошла ошибка, заказ не сохранен"),
    ).toBeVisible();
    await orderCreatePage.closeNotification();

    await orderCreatePage.openCartPosition(0);
    await orderCreatePage.changeUnit("1бух. = 50м.");
    await orderCreatePage.saveEditedPosition();
    await orderCreatePage.makeOrder();
    await orderCreatePage.expectOrderCreatedSuccess();
    await orderCreatePage.expectOrderCreatedSuccess();

    await orderCreatePage.closeNotification();
    await deleteAllPositions(page1);
    await orderCreatePage.closeNotification();
    await deleteAllPositions(page1);
  },
);

// https://allure.itlabs.io/project/28/test-cases/6290
test(
  "#4608 Создание заказа с отрезным материалом с БМ или МОК",
  { tag: ["@regress"] },
  async ({ page }) => {
    label("tag", "regress");
    feature("Auth");
    const { page: page1 } = await createAppeal(page);

    const appealStartPage = new AppealStartPage(page1);
    const orderCreatePage = new OrderCreatePage(page1);

    await appealStartPage.selectNewOrder();
    await orderCreatePage.selectObject("БМ Ожогина Садовая 3А");
    await orderCreatePage.searchProduct("геотекстиль");
    await orderCreatePage.openFirstProductCard();
    await orderCreatePage.addButtonInCart();
    await orderCreatePage.goToCart();
    await orderCreatePage.makeOrder();
    await orderCreatePage.expectOrderCreatedSuccess();
    await orderCreatePage.closeNotification();
    await deleteAllPositions(page1);
  },
);

// https://allure.itlabs.io/project/28/test-cases/5929
test(
  " #5929 создание заказа с колеровкой, другим товаром",
  { tag: ["@regress"] },
  async ({ page }) => {
    label("tag", "regress");
    feature("Auth");

    const { page: page1 } = await createAppeal(page);
    const appealStartPage = new AppealStartPage(page1);
    const orderCreatePage = new OrderCreatePage(page1);

    await appealStartPage.selectNewOrder();
    await orderCreatePage.selectObject("РЦ Тмн, 50 лет Октября, 109 ко");

    await orderCreatePage.searchProduct("краска");
    await orderCreatePage.openFirstProductCard();
    await orderCreatePage.addButtonInCart();

    await orderCreatePage.goToCart();

    await orderCreatePage.makeOrder();

    await orderCreatePage.expectOrderCreatedSuccess();
    await orderCreatePage.closeNotification();
    await orderCreatePage.addColoring("TVT Y356");

    await orderCreatePage.openSearchFromOrder();
    await orderCreatePage.searchProduct("кисть");
    await orderCreatePage.openFirstProductCard();
    await orderCreatePage.addButtonInCart();
    await orderCreatePage.goToCart();

    await orderCreatePage.saveOrder();
    await orderCreatePage.expectOrderSavedSuccess();
    await orderCreatePage.expectColorCodeVisible("TVT Y356");

    await deleteAllPositions(page1);
  },
);

// https://allure.itlabs.io/project/28/test-cases/7345?treeId=58
test(
  "#5927 создание и изменение в заказе с несколькими колеровками",
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
    await orderCreatePage.toggleRemainSwitch();
    await orderCreatePage.searchProduct("краска");

    await orderCreatePage.openProductCardByIndex(2);
    await orderCreatePage.addButtonInCart();

    await orderCreatePage.openProductCardByIndex(3);
    await orderCreatePage.addButtonInCart();

    await orderCreatePage.goToCart();
    await orderCreatePage.makeOrder();
    await orderCreatePage.expectOrderCreatedSuccess();
    await orderCreatePage.closeNotification();
    await orderCreatePage.addColoringByIndex(0, "TVT Y356");
    await orderCreatePage.addColoringByIndex(1, "BM OC-46");

    await orderCreatePage.expectColorCodeVisible("TVT Y356");
    await orderCreatePage.expectColorCodeVisible("BM OC-46");
    // await orderCreatePage.waitForSpinnerHidden();

    // await orderCreatePage.editColoringByIndex(0, "TVT K441");
    // модалка открывается, но не вводит код
    await orderCreatePage.addColoringByIndex(0, "TVT K441");
    await deleteAllPositions(page1);
  },
);
