// #5376 Создание заказа с ручной ценой и товаром без ручной цены +
// #5362 Баллы ПЛ не начисляются при изменении ручной цены +
// #5368 Применение ручной цены ДО СОЗДАНИЯ заказа, с начислением баллов ПЛ
// #5374 Нельзя применять промокод на ручные цены

import { test, expect } from "@playwright/test";
import { createAppeal } from "../helpers/commands";
import { deleteAllPositions } from "../helpers/commands";
import { label, feature } from "allure-js-commons";
import {
  addProductToCart,
  getCartTotalBonus,
  expectCartTotalBonus,
  createOrder,
  applyPromoCode,
} from "../helpers/commands";
import { AppealStartPage } from "../pages/appeal/AppealStartPage";
import { OrderCreatePage } from "../pages/order/OrderCreatePage";
import { SearchProduct } from "../pages/components/SearchProduct";

//https://allure.itlabs.io/project/28/test-cases/5376?treeId=58
test(
  "#5376 Создание заказа с ручной ценой и товаром без ручной цены",
  { tag: ["@regress"] },
  async ({ page }) => {
    label("tag", "regress");
    feature("Auth");

    const { page: page1 } = await createAppeal(page);

    const appealStartPage = new AppealStartPage(page1);
    const orderCreatePage = new OrderCreatePage(page1);
    const searchProduct = new SearchProduct(page1);

    await appealStartPage.openAppealSelector();
    await appealStartPage.chooseNewOrder();
    await searchProduct.selectObject("РЦ Тмн, 50 лет Октября, 109 ко");
    await searchProduct.searchProduct("ведро");
    await orderCreatePage.openFirstProductCard();

    // Добавляем товар с ручной ценой
    const manualPriceInput = page1.locator('[data-test="input-price-modal-0"]');
    await manualPriceInput.clear();
    await manualPriceInput.fill("500");

    // Сохраняем введённую цену
    const expectedManualPrice = await manualPriceInput.inputValue();
    await orderCreatePage.addButtonInCart();

    // Добавляем второй товар без ручной цены
    await searchProduct.toggleRemainSwitch();
    await searchProduct.searchProduct("кисть");

    await addProductToCart(page1, {
      productName: "кисть",
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
    await deleteAllPositions(page1);
  },
);

// // https://allure.itlabs.io/project/28/test-cases/5362?treeId=58
test(
  "#5362 Баллы ПЛ не начисляются при изменении ручной цены",
  { tag: ["@regress"] },
  async ({ page }) => {
    label("tag", "regress");
    feature("Auth");

    const { page: page1 } = await createAppeal(page);

    const appealStartPage = new AppealStartPage(page1);
    const orderCreatePage = new OrderCreatePage(page1);
    const searchProduct = new SearchProduct(page1);

    await appealStartPage.openAppealSelector();
    await appealStartPage.chooseNewOrder();
    await searchProduct.selectObject("РЦ Тмн, 50 лет Октября, 109 ко");
    await searchProduct.toggleRemainSwitch();
    await searchProduct.searchProduct("кисть");
    await orderCreatePage.openFirstProductCard();

    // Добавляем товар с ручной ценой
    const manualPriceInput = page1.locator('[data-test="input-price-modal-0"]');
    await manualPriceInput.clear();
    await manualPriceInput.fill("200");

    // Сохраняем введённую цену
    const expectedManualPrice = await manualPriceInput.inputValue();
    await orderCreatePage.addButtonInCart();
    await orderCreatePage.goToCart();
    await orderCreatePage.makeOrder();
    await expect(page1.getByText("Заказ успешно создан")).toBeVisible();
    // Проверяем, что цена у позиции с "кисть" равна введённой ручной цене
    const manualPricePosition = page1
      .locator('[data-test="cart-position"]')
      .filter({ hasText: "кисть" });

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
    await expect(
      page1.locator('[data-test="cart-total-bonus-total"]'),
    ).toHaveText("0");
    await deleteAllPositions(page1);
  },
);

// // https://allure.itlabs.io/project/28/test-cases/5368?treeId=58
test(
  "#5368 Применение ручной цены ДО СОЗДАНИЯ заказа, с начислением баллов ПЛ",
  { tag: ["@regress"] },
  async ({ page }) => {
    label("tag", "regress");
    feature("Auth");

    const { page: page1 } = await createAppeal(page);

    const appealStartPage = new AppealStartPage(page1);
    const orderCreatePage = new OrderCreatePage(page1);
    const searchProduct = new SearchProduct(page1);

    await appealStartPage.openAppealSelector();
    await appealStartPage.chooseNewOrder();
    await searchProduct.selectObject("РЦ Тмн, 50 лет Октября, 109 ко");
    await searchProduct.toggleRemainSwitch();
    await searchProduct.searchProduct("валик");
    await orderCreatePage.openFirstProductCard();
    await orderCreatePage.addButtonInCart();
    await orderCreatePage.goToCart();
    // Запоминаем бонусы ДО изменения цены
    const expectedBonus = await getCartTotalBonus(page1);

    // Открываем модалку редактирования позиции
    await orderCreatePage.openCartPosition(0);
    // Меняем цену вручную
    const manualPriceInput = page1.locator(
      '[data-test="modal-edit-input-price"]',
    );
    await expect(manualPriceInput).toBeVisible();
    await manualPriceInput.clear();
    await manualPriceInput.fill("150");
    await expect(manualPriceInput).toHaveValue("150");
    await orderCreatePage.saveEditedPosition();

    // Ждём возврата в корзину
    await expect(
      page1.locator('[data-test="cart-total-bonus-total"]'),
    ).toBeVisible();

    // Снова открываем модалку редактирования позиции
    await orderCreatePage.openCartPosition(0);
    // Возвращаем цену ИМКЦ
    await orderCreatePage.saveIMKS();
    await orderCreatePage.saveEditedPosition();
    // Ждём возврата в корзину
    await expect(
      page1.locator('[data-test="cart-total-bonus-total"]'),
    ).toBeVisible();

    // Проверяем, что бонусы после возврата ИМКЦ равны исходным
    await expectCartTotalBonus(page1, {
      expected: expectedBonus,
    });

    await orderCreatePage.closeNotification();
    await orderCreatePage.makeOrder();
    await orderCreatePage.expectOrderCreatedSuccess();

    await expect(page1.getByText("Заказ успешно создан")).toBeVisible();
    // После создания заказа бонусы тоже равны исходным
    await expectCartTotalBonus(page1, {
      expected: expectedBonus,
    });
    await deleteAllPositions(page1);
  },
);

// https://allure.itlabs.io/project/28/test-cases/5374?treeId=58
test(
  "#5374 Нельзя применять промокод на ручные цены",
  { tag: ["@regress"] },
  async ({ page }) => {
    label("tag", "regress");
    feature("Auth");

    const { page: page1 } = await createAppeal(page);

    const appealStartPage = new AppealStartPage(page1);
    const orderCreatePage = new OrderCreatePage(page1);
    const searchProduct = new SearchProduct(page1);

    await appealStartPage.selectSaleOrg("1000");
    await appealStartPage.openAppealSelector();
    await appealStartPage.chooseNewOrder();

    await searchProduct.selectObject("РЦ Тмн, 50 лет Октября, 109 ко");
    await searchProduct.searchProduct("638318");
    await orderCreatePage.openFirstProductCard();
    await orderCreatePage.addButtonInCart();
    await orderCreatePage.goToCart();
    await orderCreatePage.makeOrder();
    await orderCreatePage.closeNotification();

    // Меняем цену вручную
    await orderCreatePage.openCartPosition(0);
    // Меняем цену вручную
    const manualPriceInput = page1.locator(
      '[data-test="modal-edit-input-price"]',
    );
    await expect(manualPriceInput).toBeVisible();
    await manualPriceInput.clear();
    await manualPriceInput.fill("2000");
    await orderCreatePage.saveEditedPosition();
    // Ждём возврата в корзину
    await expect(
      page1.locator('[data-test="cart-total-bonus-total"]'),
    ).toBeVisible();
    await page1.locator('[data-test="save-order"]').click();
    await applyPromoCode(page1, "CALLCENTER1");
    await expect(
      page1.getByText(
        "Позиции для применения промокода CALLCENTER1 отсутствуют",
      ),
    ).toBeVisible();
    await deleteAllPositions(page1);
  },
);
