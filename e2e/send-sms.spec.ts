// #5307 Отправка СМС клиенту с сегментом "мастер"
// #5631 Отправка СМС клиенту с сегментом "эксперт"
// #5632 Отправка СМС клиенту без сегмента
// #6676 Отправка смс в созданном заказе

import { label, feature } from "allure-js-commons";
import {
  createAppeal,
  deleteAllPositions,
  createOrder,
  sendSms,
  createAppealWithRandomPhoneAndClient,
} from "../helpers/commands";
import { AppealStartPage } from "../pages/appeal/AppealStartPage";
import { OrderCreatePage } from "../pages/order/OrderCreatePage";
import { test, expect } from "@playwright/test";

// https://allure.itlabs.io/project/28/test-cases/5307?treeId=58
test(
  '#5307 Отправка СМС клиенту с сегментом "мастер"',
  { tag: ["@regress"] },
  async ({ page }) => {
    label("tag", "regress");
    feature("Auth");
    const { page: page1 } = await createAppeal(page, {
      contactType: "Телефон",
      contactValue: "9000000022",
    });
    const orderCreatePage = new OrderCreatePage(page1);
    await orderCreatePage.closeNotification();
    await expect(page1.getByText("Мастер")).toHaveCount(2);
    await sendSms(page1, {
      templateText: "Контакт. Для физических лиц",
      needScrollToTemplate: true,
    });
  },
);

// https://allure.itlabs.io/project/28/test-cases/5631?treeId=58
test(
  '#5631 Отправка СМС клиенту с сегментом "эксперт"',
  { tag: ["@regress"] },
  async ({ page }) => {
    label("tag", "regress");
    feature("Auth");
    const { page: page1 } = await createAppeal(page, {
      contactType: "Телефон",
      contactValue: "9000000066",
    });
    const orderCreatePage = new OrderCreatePage(page1);
    await orderCreatePage.closeNotification();
    await expect(page1.getByText("Эксперт")).toHaveCount(2);
    await sendSms(page1, {
      templateText: "Контакт. Для физических лиц",
      needScrollToTemplate: true,
    });
  },
);

// https://allure.itlabs.io/project/28/test-cases/5632?treeId=58
test(
  "#5632 Отправка СМС клиенту без сегмента",
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
    await sendSms(page1, {
      templateText: "Заказ. Номер сумма, адрес самовывоза",
    });
  },
);

// https://allure.itlabs.io/project/28/test-cases/6676?treeId=58
test(
  "#6676 Отправка смс в созданном заказе",
  { tag: ["@regress"] },
  async ({ page }) => {
    label("tag", "regress");
    feature("Auth");
    const { page: page1, phoneNumber } = await createOrder(page, {
      makeOrder: true,
      searchText: "цемент",
      quantity: 1,
    });
    const orderCreatePage = new OrderCreatePage(page1);
    await orderCreatePage.closeNotification();

    await sendSms(page1, {
      templateText: "Заказ. Номер сумма, адрес самовывоза",
    });

    const plantText =
      (
        await page1.locator('[data-test="plantAdress1"]').textContent()
      )?.trim() ?? "";

    await page1.locator('[data-test="send-sms"]').click();
    await page1.waitForTimeout(3000);
    await page1.locator("[data-test=pattern-sms]").click();
    await page1
      .locator('[data-test="Заказ. Номер сумма, адрес самовывоза"]')
      .click();
    const smsValue = (
      await page1.locator('[data-test="empty-form"]').inputValue()
    ).toLowerCase();

    const plantParts = plantText
      .toLowerCase()
      .split(",")
      .map((part) => part.trim())
      .filter((part) => part.length > 3);

    const hasMatch = plantParts.some((part) => smsValue.includes(part));

    expect(hasMatch).toBeTruthy();
  },
);
