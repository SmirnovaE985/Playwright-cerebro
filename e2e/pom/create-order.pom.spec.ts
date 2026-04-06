import { test } from "@playwright/test";
import { label, feature } from "allure-js-commons";
import {
  createAppeal,
  deleteAllPositions,
  addColoring,
} from "../../helpers/commands";
import { AppealStartPage } from "../../pages/appeal/AppealStartPage";
import { OrderCreatePage } from "../../pages/order/OrderCreatePage";

test(
  "#6290 Создание заказа с отрезным материалом РЦ",
  { tag: ["@regress"] },
  async ({ page }) => {
    label("tag", "regress");
    feature("Auth");
    const { page: page1 } = await createAppeal(page);

    const appealStartPage = new AppealStartPage(page1);
    const orderCreatePage = new OrderCreatePage(page1);

    await appealStartPage.selectNewOrder();
    await orderCreatePage.selectObject("РЦ Тмн, 50 лет Октября, 109 ко");
    await orderCreatePage.searchProduct("геотекстиль");
    await orderCreatePage.openFirstProductCard();
    await orderCreatePage.editUnitsToPm();
    await orderCreatePage.addSelectedUnits();
    await orderCreatePage.addToCart();
    await orderCreatePage.makeOrder();
    await orderCreatePage.expectOrderNotSavedError();
    await orderCreatePage.openCartPosition();
    await orderCreatePage.changeUnitToRol();
    await orderCreatePage.saveEditedPosition();
    await orderCreatePage.makeOrder();
    await orderCreatePage.expectOrderCreatedSuccess();
    await orderCreatePage.closeNotification();
    await deleteAllPositions(page1);
  },
);

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
    await orderCreatePage.addSelectedUnits();
    await orderCreatePage.addToCart();

    await orderCreatePage.makeOrder();
    await orderCreatePage.expectOrderCreatedSuccess();
    await orderCreatePage.closeNotification();

    await orderCreatePage.openColoring();
    await addColoring(page1, "TVT Y356");

    await orderCreatePage.openSearchFromOrder();
    await orderCreatePage.searchProduct("кисть");
    await orderCreatePage.openFirstProductCard();
    await orderCreatePage.addSelectedUnits();
    await orderCreatePage.addToCart();

    await orderCreatePage.saveOrder();
    await orderCreatePage.expectOrderSavedSuccess();
    await orderCreatePage.expectColorCodeVisible("TVT Y356");

    await deleteAllPositions(page1);
  },
);
