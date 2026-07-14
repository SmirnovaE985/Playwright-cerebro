// #5369 Списание баллов на товар с ручной ценой
// #5357 Нельзя списывать баллы в предложении
// #5365 Применение баллов ПЛ, сертификата и промокода вместе
// #5373 Списание и начисление баллов в заказе с ЗАЗой
// #5980 Нельзя дополнительно списать баллы в заказе, в котором уже было списание
// #5383 Нельзя использовать недействующий сертификат
// #5375 Списание и отмена списания баллов ПЛ с применением сертификата
// #5363 Редактирование заказа с баллами ПЛ
// #5531 Применение баллов с ошибкой промокода

import { test, expect } from "@playwright/test";
import { label, feature } from "allure-js-commons";
import { createOrder } from "../helpers/commands";
import {
  createAppeal,
  deleteAllPositions,
  applyBonusesWithTelegramCode,
  setManualPriceForFirstCartPosition,
  applyPromoCode,
  applyCertificate,
  addZaza,
  addProductToCart,
} from "../helpers/commands";
import { AppealStartPage } from "../pages/appeal/AppealStartPage";
import { OrderCreatePage } from "../pages/order/OrderCreatePage";
import { EditOrderPage } from "../pages/components/ComponentPage";
import { SearchProduct } from "../pages/components/SearchProduct";

// // https://allure.itlabs.io/project/28/test-cases/5369?treeId=58
test(
  "#5369 Списание баллов на товар с ручной ценой",
  { tag: ["@regress"] },
  async ({ page }) => {
    label("tag", "regress");
    feature("Auth");

    const { page: page1, phoneNumber } = await createAppeal(page, {
      contactType: "Телефон",
      contactValue: "(900)-000-00-66",
    });

    const appealStartPage = new AppealStartPage(page1);
    const orderCreatePage = new OrderCreatePage(page1);
    const searchProduct = new SearchProduct(page1);

    await appealStartPage.openAppealSelector();
    await appealStartPage.chooseNewOrder();
    await searchProduct.selectObject("РЦ Тмн, 50 лет Октября, 109 ко");
    await searchProduct.toggleRemainSwitch();
    await searchProduct.searchProduct("ведро");
    await orderCreatePage.openFirstProductCard();

    // Добавляем товар с ручной ценой
    const manualPriceInput = page1.locator('[data-test="input-price-modal-0"]');
    await manualPriceInput.fill("500");

    // Сохраняем введённую цену
    const expectedManualPrice = await manualPriceInput.inputValue();
    await orderCreatePage.addButtonInCart();

    // Добавляем второй товар без ручной цены

    await searchProduct.searchProduct("11030");

    await addProductToCart(page1, {
      productName: "11030",
    });

    await orderCreatePage.makeOrder();
    await expect(page1.getByText("Заказ успешно создан")).toBeVisible();

    // Проверяем, что цена у позиции  "ведро" равна введённой ручной цене, после создания заказа
    const manualPricePosition = page1
      .locator('[data-test="cart-position"]')
      .filter({ hasText: "ведро" });

    await expect(manualPricePosition.first()).toBeVisible();

    const cartPriceText = await manualPricePosition
      .first()
      .locator('[data-test="cart-position-cost"]')
      .textContent();

    const actualCartPrice =
      cartPriceText
        ?.replace(/[^\d.,]/g, "")
        .replace(",", ".")
        .trim() ?? "0";

    expect(Number(actualCartPrice)).toBe(Number(expectedManualPrice));
    const code = await applyBonusesWithTelegramCode(page1, phoneNumber, "1000");
    expect(code).toHaveLength(4);
    await expect(
      page1
        .locator('[data-test="bonuses-container"]')
        .filter({ hasText: "Списано" }),
    ).toBeVisible();

    const cartPositions = page1.locator('[data-test="cart-position"]');
    const positionsCount = await cartPositions.count();

    for (let i = 0; i < positionsCount; i++) {
      const strikedPrice = cartPositions
        .nth(i)
        .locator('[data-test="cart-position-cost"][class*="_striked_"]');

      await expect(strikedPrice).toHaveCount(1);
    }
    await deleteAllPositions(page1);
  },
);

// // https://allure.itlabs.io/project/28/test-cases/5357?treeId=58
test(
  "#5357 Нельзя списывать баллы в предложении",
  { tag: ["@regress"] },
  async ({ page }) => {
    label("tag", "regress");
    feature("Auth");
    const { page: page1 } = await createAppeal(page);
    const appealStartPage = new AppealStartPage(page1);
    const orderCreatePage = new OrderCreatePage(page1);
    const searchProduct = new SearchProduct(page1);

    await page1.mouse.move(500, 300);
    await page1.mouse.move(510, 305);
    await appealStartPage.openAppealSelector();
    await appealStartPage.chooseNewOrder();
    await appealStartPage.selectSaleOrg("1000");

    await searchProduct.selectObject(["РЦ Тмн, 50 лет Октября, 109 ко"]);
    await searchProduct.searchProduct("перчатки");
    await orderCreatePage.openFirstProductCard();
    await orderCreatePage.fillQuantityForAllInputs("1");
    await orderCreatePage.addButtonInCart();
    await orderCreatePage.goToCart();
    await orderCreatePage.makeOffer();

    // блок Баллы-не отображается
    await expect(page1.locator('[data-test="bonuses-container"]')).toBeHidden();
    await page1.locator(".ant-notification-notice-close").first().click();
    await deleteAllPositions(page1);
  },
);

// https://allure.itlabs.io/project/28/test-cases/5365?treeId=58
test(
  "#5365 Применение баллов ПЛ, сертификата и промокода вместе",
  { tag: ["@regress"] },
  async ({ page }) => {
    label("tag", "regress");
    feature("Auth");

    const { page: page1, phoneNumber } = await createOrder(page, {
      makeOrder: true,
      searchText: "грунтовка",
      quantity: 3,
    });

    if (!phoneNumber) {
      throw new Error("Не удалось получить номер телефона");
    }

    const code = await applyBonusesWithTelegramCode(page1, phoneNumber, "1001");
    expect(code).toHaveLength(4);
    await applyPromoCode(page1, "CALLCENTER1");
    await applyCertificate(page1, "10");
    await expect(
      page1
        .locator('[data-test="certificate-aprove"]')
        .filter({ hasText: "Применено" }),
    ).toBeVisible();

    await deleteAllPositions(page1);
  },
);

// https://allure.itlabs.io/project/28/test-cases/5373?treeId=58
test(
  "#5373 Списание и начисление баллов в заказе с ЗАЗой",
  { tag: ["@regress"] },
  async ({ page }) => {
    label("tag", "regress");
    feature("Auth");
    const { page: page1, phoneNumber } = await createAppeal(page, {
      contactType: "Телефон",
      contactValue: "(900)-000-00-66",
    });

    if (!phoneNumber) {
      throw new Error("Не удалось получить номер телефона");
    }
    const appealStartPage = new AppealStartPage(page1);
    const orderCreatePage = new OrderCreatePage(page1);
    const searchProduct = new SearchProduct(page1);

    await appealStartPage.openAppealSelector();
    await appealStartPage.chooseNewOrder();
    await searchProduct.searchProduct("11030");
    await orderCreatePage.openFirstProductCardFromListing();
    await page1.locator('a[data-test="ZAZA"]').waitFor({ state: "visible" });

    await addZaza(page1, {
      storeFromText: "1105 БМ Тмн Дамбовская 10",
      storeToText: "РЦ Тмн, 50 лет Октября, 109 ко",
    });

    await orderCreatePage.goToCart();
    await orderCreatePage.makeOrder();
    await expect(page1.getByText("Заказ успешно создан")).toBeVisible();
    await expect(page1.locator('[data-test="zaza-Новая"]')).toBeVisible();

    const code = await applyBonusesWithTelegramCode(page1, phoneNumber, "1000");
    expect(code).toHaveLength(4);
    await expect(
      page1
        .locator('[data-test="bonuses-container"]')
        .filter({ hasText: "Списано" }),
    ).toBeVisible();
    await expect(page1.locator('[data-test="zaza-Новая"]')).toBeVisible();
    await deleteAllPositions(page1);
  },
);

// https://allure.itlabs.io/project/28/test-cases/5980?treeId=58
test(
  "#5980 Нельзя дополнительно списать баллы в заказе, в котором уже было списание",
  { tag: ["@regress"] },
  async ({ page }) => {
    label("tag", "regress");
    feature("Auth");

    const { page: page1, phoneNumber } = await createOrder(page, {
      makeOrder: true,
      searchText: "11030",
      quantity: 1,
    });

    if (!phoneNumber) {
      throw new Error("Не удалось получить номер телефона");
    }

    const orderCreatePage = new OrderCreatePage(page1);
    const searchProduct = new SearchProduct(page1);

    await orderCreatePage.closeNotification();
    const code = await applyBonusesWithTelegramCode(page1, phoneNumber, "1000");
    expect(code).toHaveLength(4);
    await expect(
      page1
        .locator('[data-test="bonuses-container"]')
        .filter({ hasText: "Списано" }),
    ).toBeVisible();
    await page1.waitForTimeout(3000);
    await orderCreatePage.openSearchFromOrder();
    await searchProduct.searchProduct("кисть");
    await orderCreatePage.openFirstProductCard();
    await orderCreatePage.addButtonInCart();
    await orderCreatePage.goToCart();

    await page1.locator('[data-test="save-order"]').click();
    await expect(
      page1.locator('button[type="button"]').filter({ hasText: "Отменить" }),
    ).toBeVisible();
    await deleteAllPositions(page1);
  },
);

// https://allure.itlabs.io/project/28/test-cases/5383?treeId=58
test(
  "#5383 Нельзя использовать недействующий сертификат",
  { tag: ["@regress"] },
  async ({ page }) => {
    label("tag", "regress");
    feature("Auth");

    const { page: page1, phoneNumber } = await createOrder(page, {
      makeOrder: true,
      searchText: "грунтовка",
      quantity: 2,
    });
    const closeBtn = page1.locator(".ant-notification-notice-close");

    if ((await closeBtn.count()) > 0 && (await closeBtn.first().isVisible())) {
      await closeBtn.first().click();
    }
    await applyCertificate(page1, "10", "SERTIFICATAUTO");
    await expect(page1.getByText("Сертификат не применен")).toBeVisible();
    await page1.locator('[data-test="save-order"]').click();
    await deleteAllPositions(page1);
  },
);

// https://allure.itlabs.io/project/28/test-cases/5375?treeId=58
test(
  "#5375 Списание и отмена списания баллов ПЛ с применением сертификата",
  { tag: ["@regress"] },
  async ({ page }) => {
    label("tag", "regress");
    feature("Auth");

    const { page: page1, phoneNumber } = await createOrder(page, {
      makeOrder: true,
      searchText: "11030",
      quantity: 2,
    });

    if (!phoneNumber) {
      throw new Error("Не удалось получить номер телефона");
    }

    const code = await applyBonusesWithTelegramCode(page1, phoneNumber, "1000");
    expect(code).toHaveLength(4);

    await applyCertificate(page1, "10");
    await expect(
      page1
        .locator('[data-test="certificate-aprove"]')
        .filter({ hasText: "Применено" }),
    ).toBeVisible();

    await expect(
      page1
        .locator('[data-test="bonuses-container"]')
        .filter({ hasText: "Списано" }),
    ).toBeVisible();
    await expect(
      page1.locator('[data-test="certificate-final-cancel"]'),
    ).toBeEnabled();
    await page1.waitForTimeout(3000);
    await page1.locator('[data-test="certificate-final-cancel"]').click();
    await expect(
      page1
        .locator('[data-test="bonuses-container"]')
        .filter({ hasText: "Списано" }),
    ).toBeVisible();
    await deleteAllPositions(page1);
  },
);

// https://allure.itlabs.io/project/28/test-cases/5363?treeId=58
test(
  "#5363 Редактирование заказа с баллами ПЛ",
  { tag: ["@regress"] },
  async ({ page }) => {
    label("tag", "regress");
    feature("Auth");

    const { page: page1, phoneNumber } = await createOrder(page, {
      makeOrder: true,
      searchText: "11030",
      quantity: 1,
    });

    if (!phoneNumber) {
      throw new Error("Не удалось получить номер телефона");
    }

    const appealStartPage = new AppealStartPage(page1);
    const orderCreatePage = new OrderCreatePage(page1);
    const editOrderPage = new EditOrderPage(page1);
    await orderCreatePage.closeNotification();
    const code = await applyBonusesWithTelegramCode(page1, phoneNumber, "1000");
    expect(code).toHaveLength(4);

    await expect(
      page1
        .locator('[data-test="bonuses-container"]')
        .filter({ hasText: "Списано" }),
    ).toBeVisible();

    // копируем и запоминаем номер заказа
    const orderNumber = await orderCreatePage.getCopiedOrderNumber();
    await orderCreatePage.closeOrder();

    await editOrderPage.searchInputEditOrderBtn(orderNumber);
    await orderCreatePage.cancelPL();
    await deleteAllPositions(page1);
  },
);

// https://allure.itlabs.io/project/28/test-cases/5531?treeId=58
test(
  "#5531 Применение баллов с ошибкой промокода",
  { tag: ["@regress"] },
  async ({ page }) => {
    label("tag", "regress");
    feature("Auth");

    const { page: page1, phoneNumber } = await createOrder(page, {
      makeOrder: true,
      searchText: "11030",
      quantity: 1,
    });

    if (!phoneNumber) {
      throw new Error("Не удалось получить номер телефона");
    }

    const appealStartPage = new AppealStartPage(page1);
    const orderCreatePage = new OrderCreatePage(page1);
    await orderCreatePage.closeNotification();
    const code = await applyBonusesWithTelegramCode(page1, phoneNumber, "1000");
    expect(code).toHaveLength(4);

    await expect(
      page1
        .locator('[data-test="bonuses-container"]')
        .filter({ hasText: "Списано" }),
    ).toBeVisible();

    await applyPromoCode(page1, "CALLCENTER1w");
    await expect(page1.getByText("Неверный промокод")).toBeVisible();
    await expect(
      page1
        .locator('[data-test="bonuses-container"]')
        .filter({ hasText: "Списано" }),
    ).toBeVisible();
    await deleteAllPositions(page1);
  },
);
