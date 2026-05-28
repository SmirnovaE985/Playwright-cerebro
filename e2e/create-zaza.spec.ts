// '#5411 Создание ЗаЗы межгород'
// '#5652 Создать ЗаЗу, добавить вторую'
// '#6404 Создание ЗАЗы на отрезной материал'
// '#4249 Нельзя оформить ЗаЗу на бетон'  SKIP
// '#5930 создание ЗАЗы с колеровкой'

import { test, expect } from "@playwright/test";
import { createAppeal } from "../helpers/commands";
import { addZaza } from "../helpers/commands";
import { deleteAllPositions } from "../helpers/commands";
import { label, feature } from "allure-js-commons";
import { addColoring } from "../helpers/commands";
import { AppealStartPage } from "../pages/appeal/AppealStartPage";
import { OrderCreatePage } from "../pages/order/OrderCreatePage";

// https://allure.itlabs.io/project/28/test-cases/5411?treeId=58
test(
  "#5411 Создание ЗаЗы межгород",
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
    await orderCreatePage.searchProduct("ведро");
    await orderCreatePage.openFirstProductCardFromListing();
    await addZaza(page1, {
      storeFromText: "1021 РЦ Тмн, 50 лет Октября",
      storeToText: "РЦ Екб, Шефская, 1",
    });
    await orderCreatePage.goToCart();
    await orderCreatePage.makeOrder();
    await expect(page1.locator('[data-test="zaza-Новая"]')).toBeVisible();
    await deleteAllPositions(page1);
  },
);

// https://allure.itlabs.io/project/28/test-cases/5652?treeId=58
test(
  "#5652 Создать ЗаЗу, добавить вторую",
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
    await orderCreatePage.searchProduct("ведро");
    await orderCreatePage.openFirstProductCardFromListing();
    await addZaza(page1, {
      storeFromText: "1021 РЦ Тмн, 50 лет Октября",
      storeToText: "РЦ Екб, Шефская, 1",
    });
    await orderCreatePage.goToCart();
    await orderCreatePage.makeOrder();
    await expect(page1.locator('[data-test="zaza-Новая"]')).toBeVisible();
    await orderCreatePage.openSearchFromOrder();

    await orderCreatePage.searchProduct("перчатки");
    await orderCreatePage.openFirstProductCardFromListing();
    await addZaza(page1, {
      storeFromText: "1021 РЦ Тмн, 50 лет Октября",
      storeToText: "РЦ Екб, Шефская, 1",
    });

    await orderCreatePage.goToCart();
    await orderCreatePage.saveOrder();
    // await page1.waitForTimeout(3000);
    await expect(
      page1.locator('[data-test="zaza-Новая"]').nth(0),
    ).toBeVisible();
    await expect(
      page1.locator('[data-test="zaza-Новая"]').nth(1),
    ).toBeVisible();
    await deleteAllPositions(page1);
  },
);

// https://allure.itlabs.io/project/28/test-cases/6404?treeId=58
test(
  "#6404 Создание ЗАЗы на отрезной материал",
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
    await orderCreatePage.searchProduct("геотекстиль");
    await orderCreatePage.openFirstProductCardFromListing();

    await addZaza(page1, {
      storeFromText: "1027 БМ Тмн, Щербакова, 99",
      storeToText: "РЦ Тмн, 50 лет Октября, 109 ко",
      unitCode: "ROL",
    });

    await orderCreatePage.goToCart();
    await orderCreatePage.makeOrder();
    await expect(page1.locator('[data-test="zaza-Новая"]')).toBeVisible();

    await deleteAllPositions(page1);
  },
);

// https://allure.itlabs.io/project/28/test-cases/4249?treeId=58
test.skip(
  "#4249 Нельзя оформить ЗаЗу на бетон",
  { tag: ["@regress"] },
  async ({ page }) => {
    label("tag", "regress");
    feature("Auth");
    const { page: page1 } = await createAppeal(page);

    const appealStartPage = new AppealStartPage(page1);
    const orderCreatePage = new OrderCreatePage(page1);

    await appealStartPage.openAppealSelector();
    await appealStartPage.chooseNewOrder();
    await orderCreatePage.searchProduct("бетон");
    await orderCreatePage.openFirstProductCardFromListing();
    await page1.locator('a[data-test="ZAZA"]').click();

    await expect(
      page1.locator('[data-test="search-input-store"] input'),
    ).toBeDisabled();
  },
);

// https://allure.itlabs.io/project/28/test-cases/5930?treeId=58
test(
  "#5930 создание ЗАЗы с колеровкой",
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

    await orderCreatePage.searchProduct("570060");
    await orderCreatePage.openFirstProductCardFromListing();

    await addZaza(page1, {
      storeFromText: "1027 БМ Тмн, Щербакова, 99",
      storeToText: "РЦ Тмн, 50 лет Октября, 109 ко",
    });

    await orderCreatePage.goToCart();
    await orderCreatePage.makeOrder();
    await expect(page1.locator('[data-test="zaza-Новая"]')).toBeVisible();

    await orderCreatePage.addColoring("TVT Y356");
    await expect(page1.locator('[data-test="zaza-Новая"]')).toBeVisible();
    await expect(page1.getByText("TVT Y356")).toBeVisible();
    await deleteAllPositions(page1);
  },
);
