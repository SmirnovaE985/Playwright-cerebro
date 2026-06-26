// #6021 Создание нового обращения и регистрация клиента в ПЛ
// #6034 Создание заказа с ЗАЗОЙ c услугой колеровки
// #6734 Списание и отмена списания баллов

import { label, feature } from "allure-js-commons";
import {
  createAppeal,
  deleteAllPositions,
  createOrder,
  createAppealWithRandomPhoneAndClient,
  addZaza,
  applyBonusesWithTelegramCode,
  confirmLoyaltyRegistrationWithTelegramCode,
} from "../helpers/commands";
import { AppealStartPage } from "../pages/appeal/AppealStartPage";
import { OrderCreatePage } from "../pages/order/OrderCreatePage";
import { LoyaltyComponent } from "../pages/components/ComponentPage";
import { test, expect } from "@playwright/test";
import { SearchProduct } from "../pages/components/SearchProduct";

// https://allure.itlabs.io/project/28/test-cases/6021?treeId=58
test(
  "#6021 Создание нового обращения и регистрация клиента в ПЛ",
  { tag: ["@smoke"] },
  async ({ page }) => {
    label("tag", "smoke");
    feature("Auth");
    const { page: page1, phoneNumber } =
      await createAppealWithRandomPhoneAndClient(page, {
        clientType: "Физическое лицо",
        clientName: "Иван Васильевич",
      });

    const appealStartPage = new AppealStartPage(page1);
    const orderCreatePage = new OrderCreatePage(page1);
    const loyaltyComponent = new LoyaltyComponent(page1);

    await appealStartPage.openAppealSelector();
    await page1.mouse.move(500, 300);
    await page1.mouse.move(510, 305);
    await appealStartPage.chooseNewOrder();
    await appealStartPage.selectSaleOrg("1000");

    await orderCreatePage.closeNotification();
    await page1.waitForTimeout(2000);
    await loyaltyComponent.clickRegisterInLoyalty();
    await loyaltyComponent.chooseSendCode();
    await loyaltyComponent.clickLoyaltyRegistrationSend();

    const code = await confirmLoyaltyRegistrationWithTelegramCode(
      page1,
      phoneNumber,
    );

    console.log("Registration code:", code);
    await expect(
      page1.locator('[data-test="client-promo-status"]', { hasText: "Умелец" }),
    ).toBeVisible();
  },
);

// https://allure.itlabs.io/project/28/test-cases/6034?treeId=58
test(
  "#6034 Создание заказа с ЗАЗОЙ c услугой колеровки",
  { tag: ["@smoke"] },
  async ({ page }) => {
    label("tag", "smoke");
    feature("Auth");
    const { page: page1 } = await createAppeal(page);

    const appealStartPage = new AppealStartPage(page1);
    const orderCreatePage = new OrderCreatePage(page1);
    const searchProduct = new SearchProduct(page1);

    // постепенный скрол до появления нужного элемента
    await appealStartPage.selectSaleOrg("3000");
    await appealStartPage.openAppealSelector();
    await appealStartPage.chooseNewOrder();

    await searchProduct.searchProduct("краска");
    await orderCreatePage.openFirstProductCardFromListing();

    await addZaza(page1, {
      storeFromText: "3005 БМ Брз, Пролетарская, 4А",
      storeToText: "РЦ Екб, Шефская, 1",
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

// https://allure.itlabs.io/project/28/test-cases/6734?treeId=58
test(
  "#6734 Списание и отмена списания баллов",
  { tag: ["@smoke"] },
  async ({ page }) => {
    label("tag", "smoke");
    feature("Auth");

    const { page: page1, phoneNumber } = await createOrder(page, {
      makeOrder: true,
      searchText: "грунтовка",
      quantity: 1,
    });

    if (!phoneNumber) {
      throw new Error("Не удалось получить номер телефона");
    }

    const code = await applyBonusesWithTelegramCode(page1, phoneNumber, "4");
    expect(code).toHaveLength(4);
    await expect(
      page1
        .locator('[data-test="bonuses-container"]')
        .filter({ hasText: "Списано" }),
    ).toBeVisible();

    await page1.getByRole("button", { name: "Отменить" }).click();
    await expect(page1.getByText("Применение баллов отменено")).toBeVisible();
    await deleteAllPositions(page1);
  },
);
