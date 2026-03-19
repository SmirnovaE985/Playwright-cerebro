// '#5411 Создание ЗаЗы межгород'
// '#5652 Создать ЗаЗу, добавить вторую'
// '#6404 Создание ЗАЗы на отрезной материал'
// '#4249 Нельзя оформить ЗаЗу на бетон'
// '#5930 создание ЗАЗы с колеровкой'

import { test, expect } from "@playwright/test";
import { createAppeal } from "../helpers/commands";
import { addZaza } from "../helpers/commands";
import { deleteAllPositions } from "../helpers/commands";
import { label, feature } from "allure-js-commons";
import { addColoring } from "../helpers/commands";
// import {
//   label as allureLabel,
//   feature as allureFeature,
// } from "allure-js-commons";

// https://allure.itlabs.io/project/28/test-cases/5411?treeId=58
test(
  "#5411 Создание ЗаЗы межгород",
  { tag: ["@regress"] },
  async ({ page }) => {
    label("tag", "regress");
    feature("Auth");
    const page1 = await createAppeal(page);
    await page1.locator('[data-test="select-appeal"]').click();
    await page1
      .locator('[data-test="select-appeal"] li')
      .filter({ hasText: "Новый заказ" })
      .click();
    await page1.locator('[data-test="search-input"]').click();
    await page1.locator('[data-test="search-input"]').fill("лопата");
    await page1.locator('[data-test="search-button"]').click();
    await page1.locator('[data-test="product-link"]').first().click();
    await page1.locator('a[data-test="ZAZA"]').waitFor({ state: "visible" });

    await addZaza(page1, {
      storeFromText: "1021 РЦ Тмн, 50 лет Октября",
      storeToText: "РЦ Екб, Шефская, 1",
    });

    await page1.locator('[data-test="to-cart-button"]').click();
    await page1.locator('[data-test="make-order"]').click();
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
    const page1 = await createAppeal(page);
    await page1.locator('[data-test="select-appeal"]').click();
    await page1
      .locator('[data-test="select-appeal"] li')
      .filter({ hasText: "Новый заказ" })
      .click();
    await page1.locator('[data-test="search-input"]').click();
    await page1.locator('[data-test="search-input"]').fill("лопата");
    await page1.locator('[data-test="search-button"]').click();
    await page1.locator('[data-test="product-link"]').first().click();
    await page1.locator('a[data-test="ZAZA"]').waitFor({ state: "visible" });

    await addZaza(page1, {
      storeFromText: "1021 РЦ Тмн, 50 лет Октября",
      storeToText: "РЦ Екб, Шефская, 1",
    });

    await page1.locator('[data-test="to-cart-button"]').click();
    await page1.locator('[data-test="make-order"]').click();
    await expect(page1.locator('[data-test="zaza-Новая"]')).toBeVisible();

    await page1.locator('[data-test="btn-go-in-search"]').click();
    await page1.locator('[data-test="search-input"]').click();
    await page1.locator('[data-test="search-input"]').fill("штукатурка");
    await page1.locator('[data-test="search-button"]').click();
    await page1.locator('[data-test="product-link"]').first().click();
    await page1.locator('a[data-test="ZAZA"]').waitFor({ state: "visible" });

    await addZaza(page1, {
      storeFromText: "1027 БМ Тмн, Щербакова, 99",
      storeToText: "РЦ Тмн, 50 лет Октября, 109 ко",
    });

    await page1.locator('[data-test="to-cart-button"]').click();
    await page1.locator('[data-test="save-order"]').click();
    await expect(page1.getByText("Успешно сохранено")).toBeVisible();

    const zazaItems = page1.locator('[data-test="zaza-Новая"]');
    await expect(zazaItems).toHaveCount(2);
    await expect(zazaItems.nth(0)).toBeVisible();
    await expect(zazaItems.nth(1)).toBeVisible();

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
    const page1 = await createAppeal(page);
    await page1.locator('[data-test="select-appeal"]').click();
    await page1
      .locator('[data-test="select-appeal"] li')
      .filter({ hasText: "Новый заказ" })
      .click();
    await page1.locator('[data-test="search-input"]').click();
    await page1.locator('[data-test="search-input"]').fill("геотекстиль");
    await page1.locator('[data-test="search-button"]').click();
    await page1.locator('[data-test="product-link"]').first().click();
    await page1.locator('a[data-test="ZAZA"]').waitFor({ state: "visible" });

    await addZaza(page1, {
      storeFromText: "1027 БМ Тмн, Щербакова, 99",
      storeToText: "РЦ Тмн, 50 лет Октября, 109 ко",
      unitCode: "ROL",
    });

    await page1.locator('[data-test="to-cart-button"]').click();
    await page1.locator('[data-test="make-order"]').click();
    await expect(page1.locator('[data-test="zaza-Новая"]')).toBeVisible();
    await deleteAllPositions(page1);
  },
);

// https://allure.itlabs.io/project/28/test-cases/4249?treeId=58
test(
  "#4249 Нельзя оформить ЗаЗу на бетон",
  { tag: ["@regress"] },
  async ({ page }) => {
    label("tag", "regress");
    feature("Auth");
    const page1 = await createAppeal(page);
    await page1.locator('[data-test="select-appeal"]').click();
    await page1
      .locator('[data-test="select-appeal"] li')
      .filter({ hasText: "Новый заказ" })
      .click();
    await page1.locator('[data-test="search-input"]').click();
    await page1.locator('[data-test="search-input"]').fill("бетон");
    await page1.locator('[data-test="search-button"]').click();
    await page1.locator('[data-test="product-link"]').first().click();
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
    const page1 = await createAppeal(page);
    // постепенный скрол до появления нужного элемента
    await page1.locator('[data-test="sale-orgs"]').click();
    const holder = page1.locator(
      ".ant-select-dropdown .rc-virtual-list-holder",
    );
    const option = page1.locator('.ant-select-dropdown [data-test="3000"]');

    for (let i = 0; i < 10; i++) {
      if (await option.count()) break;

      await holder.evaluate((el) => {
        el.scrollTop += 300;
      });

      await page1.waitForTimeout(300);
    }
    await option.click();
    await page1.locator('[data-test="select-appeal"]').click();
    await page1
      .locator('[data-test="select-appeal"] li')
      .filter({ hasText: "Новый заказ" })
      .click();
    await page1.locator('[data-test="search-input"]').click();
    await page1.locator('[data-test="search-input"]').fill("160010");
    await page1.locator('[data-test="search-button"]').click();
    await page1.locator('[data-test="product-link"]').click();
    await page1.locator('a[data-test="ZAZA"]').waitFor({ state: "visible" });

    await addZaza(page1, {
      storeFromText: "3119 МОК Большой ИстокДекабристов1г",
      storeToText: "РЦ Екб, Шефская, 1",
    });

    await page1.locator('[data-test="to-cart-button"]').click();
    await page1.locator('[data-test="make-order"]').click();
    await expect(page1.locator('[data-test="zaza-Новая"]')).toBeVisible();
    await page1.locator('[data-icon="format-painter"]').click();
    await addColoring(page1, "TVT Y356");
    await expect(page1.getByText("Услуга успешно добавлена")).toBeVisible();
    await expect(page1.locator('[data-test="zaza-Новая"]')).toBeVisible();
    await expect(page1.getByText("TVT Y356")).toBeVisible();
    await deleteAllPositions(page1);
  },
);
