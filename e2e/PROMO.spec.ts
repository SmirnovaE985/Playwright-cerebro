// #5369 Списание баллов на товар с ручной ценой
// #5357 Нельзя списывать баллы в предложении
// #5365 Применение баллов ПЛ, сертификата и промокода вместе
// #5373 Списание и начисление баллов в заказе с ЗАЗой
// #5980 Нельзя дополнительно списать баллы в заказе, в котором уже было списание
// #5383 Нельзя использовать недействующий сертификат
// #5375 Списание и отмена списания баллов ПЛ с применением сертификата

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

// // https://allure.itlabs.io/project/28/test-cases/5369?treeId=58
test(
  "#5369 Списание баллов на товар с ручной ценой",
  { tag: ["@regress"] },
  async ({ page }) => {
    label("tag", "regress");
    feature("Auth");

    const { page: page1, phoneNumber } = await createAppeal(page, {
      contactType: "Телефон",
    });

    if (!phoneNumber) {
      throw new Error("Не удалось получить phoneNumber для Telegram");
    }

    const saveOrderButton = page1.locator('[data-test="save-order"]');
    const firstProductLink = page1
      .locator('[data-test="product-link"]')
      .first();
    const firstCartPosition = page1
      .locator('[data-test="cart-position"]')
      .first();
    const saveBtnInModal = page1.locator(
      '[data-test="save-btn-in-modal-edit-position"]',
    );
    const editModal = page1.locator('[data-test="cart-position-edit-modal"]');

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
    await page1.locator(".ant-notification-notice-close").first().click();

    // Добавляем первый товар
    await page1.locator('[data-test="search-input"]').fill("молоток");
    await page1.locator('[data-test="search-button"]').click();

    await expect(firstProductLink).toBeVisible();
    await firstProductLink.click();

    await expect(page1.getByRole("button", { name: "Добавить" })).toBeVisible();
    await page1.getByRole("button", { name: "Добавить" }).click();

    await page1.locator('[data-test="link-back"]').click();

    // Добавляем второй товар
    await page1.locator('[data-test="search-input"]').fill("ведро");
    await page1.locator('[data-test="search-button"]').click();

    await expect(firstProductLink).toBeVisible();
    await firstProductLink.click();

    await expect(page1.getByRole("button", { name: "Добавить" })).toBeVisible();
    await page1.getByRole("button", { name: "Добавить" }).click();

    await expect(page1.locator('[data-test="to-cart-button"]')).toBeVisible();
    await page1.locator('[data-test="to-cart-button"]').click();

    await expect(page1.locator('[data-test="make-order"]')).toBeVisible();
    await page1.locator('[data-test="make-order"]').click();

    // Применяем ручную цену к первой позиции
    await setManualPriceForFirstCartPosition(page1, "200");

    await expect(saveOrderButton).toBeVisible();
    await expect(saveOrderButton).toBeEnabled();
    await saveOrderButton.click();
    await expect(page1.getByText("Перс. цена").first()).toBeVisible();
    // expect(code).toHaveLength(4);
    // Списываем баллы
    const code = await applyBonusesWithTelegramCode(page1, phoneNumber, "4");
    expect(code).toHaveLength(4);

    // У каждой позиции должна появиться зачеркнутая цена
    const cartPositions = page1.locator('[data-test="cart-position"]');
    const positionsCount = await cartPositions.count();

    for (let i = 0; i < positionsCount; i++) {
      const strikedPrice = cartPositions
        .nth(i)
        .locator('[data-test="cart-position-cost"][class*="striked"]');

      await expect(strikedPrice).toHaveCount(1);
    }

    // Сохраняем заказ после списания баллов
    await expect(saveOrderButton).toBeVisible();
    await expect(saveOrderButton).toBeEnabled();
    await page1.locator('[data-test="save-order"]');
    await expect(page1.getByText("Успешно сохранено").first()).toBeVisible();
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
    await page1.locator('[data-test="select-appeal"]').click();
    // выбираем сбытовую
    await page1.locator('[data-test="sale-orgs"]').click();
    const option = page1.locator('.ant-select-dropdown [data-test="1000"]');
    await option.scrollIntoViewIfNeeded();
    await option.click();
    await page1
      .locator('[data-test="select-appeal"] li')
      .filter({ hasText: "Новый заказ" })
      .click();
    await page1.locator(".ant-select-selection-overflow").click();
    await page1.getByText("РЦ Тмн, 50 лет Октября, 109 ко").click();
    await page1.locator('[data-test="search-input"]').click();
    await page1.locator('[data-test="search-input"]').fill("молоток");
    await page1.locator('[data-test="search-button"]').click();
    await page1.locator('[data-test="product-link"]').first().click();
    await page1.getByRole("button", { name: "Добавить" }).click();
    await page1.locator('[data-test="to-cart-button"]').click();
    await page1.locator('[data-test="make-offer"]').click();
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
      searchText: "цемент",
      quantity: 5,
    });

    if (!phoneNumber) {
      throw new Error("Не удалось получить номер телефона");
    }

    const code = await applyBonusesWithTelegramCode(page1, phoneNumber, "4");
    expect(code).toHaveLength(4);
    await applyCertificate(page1, "10");
    await expect(
      page1
        .locator('[data-test="certificate-aprove"]')
        .filter({ hasText: "Применено" }),
    ).toBeVisible();
    await applyPromoCode(page1);

    await expect(
      page1
        .locator('[data-test="bonuses-container"]')
        .filter({ hasText: "Списано" }),
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
    await page1.locator('[data-test="search-input"]').click();
    await page1.locator('[data-test="search-input"]').fill("лопата");
    await page1.locator('[data-test="search-button"]').click();
    await page1.locator('[data-test="product-link"]').first().click();

    await page1.locator('a[data-test="ZAZA"]').waitFor({ state: "visible" });

    await addZaza(page1, {
      storeFromText: "1024 БМ Тмн, Мельникайте, 123",
      storeToText: "РЦ Тмн, 50 лет Октября, 109 ко",
    });

    await page1.locator('[data-test="to-cart-button"]').click();
    await page1.locator('[data-test="make-order"]').click();
    await expect(page1.locator('[data-test="zaza-Новая"]')).toBeVisible();

    const code = await applyBonusesWithTelegramCode(page1, phoneNumber, "4");
    expect(code).toHaveLength(4);
    await expect(
      page1
        .locator('[data-test="bonuses-container"]')
        .filter({ hasText: "Списано" }),
    ).toBeVisible();
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
      searchText: "цемент",
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
    await page1.locator('[data-test="btn-go-in-search"]').click();
    await addProductToCart(page1, {
      productName: "кисть",
      quantity: 2,
    });
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
      searchText: "цемент",
      quantity: 3,
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
      searchText: "цемент",
      quantity: 5,
    });

    if (!phoneNumber) {
      throw new Error("Не удалось получить номер телефона");
    }

    const code = await applyBonusesWithTelegramCode(page1, phoneNumber, "4");
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
    await page1.getByRole("button", { name: "Отменить" }).first().click();
    await expect(page1.locator('[data-test="bonuses-check"]')).toBeVisible();
    await expect(
      page1
        .locator('[data-test="certificate-aprove"]')
        .filter({ hasText: "Применено" }),
    ).toBeVisible();
    await deleteAllPositions(page1);
  },
);
