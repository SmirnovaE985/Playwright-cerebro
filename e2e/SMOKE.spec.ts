// #6021 Создание нового обращения и регистрация клиента в ПЛ
//

import { label, feature } from "allure-js-commons";
import {
  createAppeal,
  deleteAllPositions,
  createOrder,
  createAppealWithRandomPhoneAndClient,
} from "../helpers/commands";
import { AppealStartPage } from "../pages/appeal/AppealStartPage";
import { OrderCreatePage } from "../pages/order/OrderCreatePage";
import { test, expect } from "@playwright/test";

// https://allure.itlabs.io/project/28/test-cases/6021?treeId=58
test(
  "#6021 Создание нового обращения и регистрация клиента в ПЛ",
  { tag: ["@regress"] },
  async ({ page }) => {
    label("tag", "regress");
    feature("Auth");
    const { page: page1 } = await createAppealWithRandomPhoneAndClient(page, {
      clientType: "Физическое лицо",
      clientName: "Иван Васильевич",
    });

    const appealStartPage = new AppealStartPage(page1);
    const orderCreatePage = new OrderCreatePage(page1);

    await appealStartPage.openAppealSelector();
    await appealStartPage.chooseNewOrder();
    await appealStartPage.selectSaleOrg("1000");

    await orderCreatePage.closeNotification();
    await page1.waitForTimeout(2000);
    await orderCreatePage.clickRegisterInLoyaltyProgram();
    await orderCreatePage.clickSendInLoyaltyRegistrationModal();
  },
);
