// #5376 Создание заказа с ручной ценой и товаром без ручной цены
// #5362 Баллы ПЛ не начисляются при изменении ручной цены
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
} from "../helpers/commands";

//https://allure.itlabs.io/project/28/test-cases/5376?treeId=58
test(
  "#5376 Создание заказа с ручной ценой и товаром без ручной цены",
  { tag: ["@regress"] },
  async ({ page }) => {
    label("tag", "regress");
    feature("Auth");

    const { page: page1 } = await createAppeal(page);

    await page1.locator('[data-test="select-appeal"]').click();
    await page1
      .locator('[data-test="select-appeal"] li')
      .filter({ hasText: "Новый заказ" })
      .click();
    // выбираем сбытовую
    await page1.locator('[data-test="sale-orgs"]').click();
    const option = page1.locator('.ant-select-dropdown [data-test="1000"]');
    await option.scrollIntoViewIfNeeded();
    await option.click();

    await page1.locator(".ant-select-selection-overflow").click();
    await page1.getByText("РЦ Тмн, 50 лет Октября, 109 ко").click();

    // Добавляем товар с ручной ценой
    await page1.locator('[data-test="search-input"]').click();
    await page1.locator('[data-test="search-input"]').fill("кисть");
    await page1.locator('[data-test="search-button"]').click();
    await page1.locator('[data-test="shopping-card-button"]').first().click();

    const manualPriceInput = page1.locator('[data-test="input-price-modal-0"]');
    await manualPriceInput.clear();
    await manualPriceInput.fill("170");

    // Сохраняем введённую цену
    const expectedManualPrice = await manualPriceInput.inputValue();

    await page1.getByRole("button", { name: "Добавить" }).click();
    await page1.locator('[data-test="to-cart-button"]').click();
    await page1.locator('[data-test="make-order"]').click();
    await page1.locator(".ant-notification-notice-close").first().click();
    await expect(page1.getByText("Заказ успешно создан")).toBeVisible();

    // Добавляем второй товар без ручной цены
    await page1.locator('[data-test="btn-go-in-search"]').click();
    await addProductToCart(page1, {
      productName: "ведро",
    });

    // Сохраняем заказ
    await page1.locator('[data-test="save-order"]').click();

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
    await deleteAllPositions(page1);
  },
);

// https://allure.itlabs.io/project/28/test-cases/5362?treeId=58
test(
  "#5362 Баллы ПЛ не начисляются при изменении ручной цены",
  { tag: ["@regress"] },
  async ({ page }) => {
    label("tag", "regress");
    feature("Auth");

    const { page: page1 } = await createAppeal(page);

    await page1.locator('[data-test="select-appeal"]').click();
    await page1
      .locator('[data-test="select-appeal"] li')
      .filter({ hasText: "Новый заказ" })
      .click();
    // выбираем сбытовую
    await page1.locator('[data-test="sale-orgs"]').click();
    const option = page1.locator('.ant-select-dropdown [data-test="1000"]');
    await option.scrollIntoViewIfNeeded();
    await option.click();
    await page1.locator(".ant-select-selection-overflow").click();
    await page1.getByText("РЦ Тмн, 50 лет Октября, 109 ко").click();

    // Добавляем товар с ручной ценой
    await page1.locator('[data-test="search-input"]').click();
    await page1.locator('[data-test="search-input"]').fill("кисть");
    await page1.locator('[data-test="search-button"]').click();
    await page1.locator('[data-test="shopping-card-button"]').first().click();

    const manualPriceInput = page1.locator('[data-test="input-price-modal-0"]');
    await manualPriceInput.clear();
    await manualPriceInput.fill("170");

    // Сохраняем введённую цену
    const expectedManualPrice = await manualPriceInput.inputValue();

    await page1.getByRole("button", { name: "Добавить" }).click();
    await page1.locator('[data-test="to-cart-button"]').click();
    await page1.locator('[data-test="make-order"]').click();
    await page1.locator(".ant-notification-notice-close").first().click();
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

// https://allure.itlabs.io/project/28/test-cases/5368?treeId=58
test(
  "#5368 Применение ручной цены ДО СОЗДАНИЯ заказа, с начислением баллов ПЛ",
  { tag: ["@regress"] },
  async ({ page }) => {
    label("tag", "regress");
    feature("Auth");

    const { page: page1 } = await createAppeal(page);

    await page1.locator('[data-test="select-appeal"]').click();
    await page1
      .locator('[data-test="select-appeal"] li')
      .filter({ hasText: "Новый заказ" })
      .click();
    // выбираем сбытовую
    await page1.locator('[data-test="sale-orgs"]').click();
    const option = page1.locator('.ant-select-dropdown [data-test="1000"]');
    await option.scrollIntoViewIfNeeded();
    await option.click();
    await page1.locator(".ant-select-selection-overflow").click();
    await page1.getByText("РЦ Тмн, 50 лет Октября, 109 ко").click();

    await addProductToCart(page1, {
      productName: "кисть",
    });

    // Запоминаем бонусы ДО изменения цены
    const expectedBonus = await getCartTotalBonus(page1);

    // Открываем модалку редактирования позиции
    await page1.locator('[data-test="cart-position"]').first().click();

    // Меняем цену вручную
    const manualPriceInput = page1.locator(
      '[data-test="modal-edit-input-price"]',
    );
    await expect(manualPriceInput).toBeVisible();
    await manualPriceInput.clear();
    await manualPriceInput.fill("170");
    await expect(manualPriceInput).toHaveValue("170");
    await page1
      .locator('[data-test="save-btn-in-modal-edit-position"]')
      .click();

    // Ждём возврата в корзину
    await expect(
      page1.locator('[data-test="cart-total-bonus-total"]'),
    ).toBeVisible();

    // Снова открываем модалку редактирования позиции
    await page1.locator('[data-test="cart-position"]').first().click();

    // Возвращаем цену ИМКЦ
    await page1.locator('[data-test="price-imkc-edit-modal"]').click();
    await page1
      .locator('[data-test="save-btn-in-modal-edit-position"]')
      .click();

    // Ждём возврата в корзину
    await expect(
      page1.locator('[data-test="cart-total-bonus-total"]'),
    ).toBeVisible();

    // Проверяем, что бонусы после возврата ИМКЦ равны исходным
    await expectCartTotalBonus(page1, {
      expected: expectedBonus,
    });
    await page1.locator('[data-test="make-order"]').click();
    await page1.locator(".ant-notification-notice-close").first().click();
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
    const { page: page1 } = await createOrder(page, {
      searchText: "631179",
      makeOrder: true,
    });
    await page1.locator(".ant-notification-notice-close").first().click();
    // Меняем цену вручную
    await page1.locator('[data-test="cart-position"]').click();
    await page1.locator('[data-test="modal-edit-input-price"]').clear();
    await page1.locator('[data-test="modal-edit-input-price"]').fill("2700");
    await page1
      .locator('[data-test="save-btn-in-modal-edit-position"]')
      .click();

    // Ждём возврата в корзину
    await expect(
      page1.locator('[data-test="cart-total-bonus-total"]'),
    ).toBeVisible();
    await page1.locator('[data-test="save-order"]').click();
    await page1.locator('[data-test="promocode-block-title"]').click();
    await page1.locator('[data-test="promocode"]').fill("CALLCENTER1");
    await page1.locator('[data-test="promocode-apply"]').click();
    await expect(
      page1.getByText(
        "Позиции для применения промокода CALLCENTER1 отсутствуют",
      ),
    ).toBeVisible();
    await deleteAllPositions(page1);
  },
);
