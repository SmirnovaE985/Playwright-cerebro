import { test, expect } from "@playwright/test";
import { createAppeal } from "../helpers/commands";
import { label, feature } from "allure-js-commons";
import { AppealStartPage } from "../pages/appeal/AppealStartPage";
import { OrderCreatePage } from "../pages/order/OrderCreatePage";
import { SearchProduct } from "../pages/components/SearchProduct";
import { OrderGTR } from "../pages/order/OrderGTR";

// https://allure.itlabs.io/project/28/test-cases/9414?treeId=58
test(
  "#9414 Создание ГТР самовывозом",
  { tag: ["@regress"] },
  async ({ page }) => {
    label("tag", "regress");
    feature("Auth");
    const { page: page1 } = await createAppeal(page);

    const appealStartPage = new AppealStartPage(page1);
    const orderCreatePage = new OrderCreatePage(page1);
    const searchProduct = new SearchProduct(page1);
    const orderGTR = new OrderGTR(page1);

    await appealStartPage.selectSaleOrg("1000");
    await appealStartPage.openAppealSelector();
    await appealStartPage.chooseNewOrder();

    await searchProduct.searchProduct("кирпич");
    await page1
      .locator("svg._common-icon_1eycw_1._gtr-icon_1eycw_23")
      .first()
      .click();
    await orderGTR.selectChoose();

    await orderGTR.goToNextStep();
    await orderGTR.goToNextStep();
    await orderGTR.selectDate();
    await orderGTR.goToNextStep();

    await orderGTR.goToNextStep();
    const dateRegex = /\b\d{2}\.\d{2}\.\d{4}\b/;

    const firstDateText = await page1
      .locator("span.ant-typography")
      .filter({ hasText: dateRegex })
      .first()
      .innerText();

    const firstDate = firstDateText.match(dateRegex)?.[0];

    expect(firstDate).toBeDefined();
    await orderGTR.createOrder();
    await orderGTR.confirmOrder();
    await orderGTR.expectOrderCreated();
    const secondDateText = await page1
      .locator("div._secondary_losjl_76")
      .first()
      .innerText();

    const secondDate = secondDateText.match(dateRegex)?.[0];

    expect(secondDate).toBeDefined();
    expect(firstDate).toBe(secondDate);
  },
);

// https://allure.itlabs.io/project/28/test-cases/6149?treeId=58
test(
  "#6149 Создание ГТР с доставкой",
  { tag: ["@regress"] },
  async ({ page }) => {
    label("tag", "regress");
    feature("Auth");
    const { page: page1 } = await createAppeal(page);

    const appealStartPage = new AppealStartPage(page1);
    const orderCreatePage = new OrderCreatePage(page1);
    const searchProduct = new SearchProduct(page1);
    const orderGTR = new OrderGTR(page1);

    await appealStartPage.selectSaleOrg("1000");
    await appealStartPage.openAppealSelector();
    await appealStartPage.chooseNewOrder();

    await searchProduct.searchProduct("кирпич");
    await page1
      .locator("svg._common-icon_1eycw_1._gtr-icon_1eycw_23")
      .first()
      .click();
    await orderGTR.selectChoose();
    await orderGTR.goToNextStep();

    await orderGTR.goToNextStep();
    await orderGTR.selectDate();
    await orderGTR.goToNextStep();
    await orderGTR.openDeliveryTab();
    await orderGTR.fillDeliveryAddress("Агеева 141");
    await orderGTR.waitForAddressDropdown();
    await orderGTR.selectAddress("улица Агеева, дом 141");
    await page1
      .getByRole("button", {
        name: "Добавить транспорт",
      })
      .click();
    await orderGTR.openDeliveryMethodSelect();

    await orderGTR.selectDeliveryMethod("Доставка 10 тонн манипулятор");
    await orderGTR.goToNextStep();

    const dateRegex = /\b\d{2}\.\d{2}\.\d{4}\b/;

    const firstDateText = await page1
      .locator("span.ant-typography")
      .filter({ hasText: dateRegex })
      .first()
      .innerText();

    const firstDate = firstDateText.match(dateRegex)?.[0];

    expect(firstDate).toBeDefined();
    await orderGTR.createOrder();
    await orderGTR.confirmOrder();
    await orderGTR.expectOrderCreated();
    const secondDateText = await page1
      .locator("div._secondary_losjl_76")
      .first()
      .innerText();

    const secondDate = secondDateText.match(dateRegex)?.[0];

    expect(secondDate).toBeDefined();
    expect(firstDate).toBe(secondDate);
    await expect(page1.getByText("г Тюмень ул Агеева д 141")).toBeVisible();
  },
);

// https://allure.itlabs.io/project/28/test-cases/6158?treeId=58
test(
  "#6158 Создание ГТР с двумя товарами и самовывозом",
  { tag: ["@regress"] },
  async ({ page }) => {
    label("tag", "regress");
    feature("Auth");
    const { page: page1 } = await createAppeal(page);

    const appealStartPage = new AppealStartPage(page1);
    const orderCreatePage = new OrderCreatePage(page1);
    const searchProduct = new SearchProduct(page1);
    const orderGTR = new OrderGTR(page1);

    await appealStartPage.selectSaleOrg("1000");
    await appealStartPage.openAppealSelector();
    await appealStartPage.chooseNewOrder();

    await searchProduct.searchProduct("кирпич");
    await page1
      .locator("svg._common-icon_1eycw_1._gtr-icon_1eycw_23")
      .first()
      .click();
    await orderGTR.selectChoose();

    await orderGTR.goToNextStep();
    await orderGTR.addMaterial();
    await orderGTR.chooseMaterial();
    await orderGTR.goToNextStep();

    await orderGTR.selectDate();
    await orderGTR.goToNextStep();

    await orderGTR.goToNextStep();
    const dateRegex = /\b\d{2}\.\d{2}\.\d{4}\b/;

    const firstDateText = await page1
      .locator("span.ant-typography")
      .filter({ hasText: dateRegex })
      .first()
      .innerText();

    const firstDate = firstDateText.match(dateRegex)?.[0];

    expect(firstDate).toBeDefined();
    await orderGTR.createOrder();
    await orderGTR.confirmOrder();
    await orderGTR.expectOrderCreated();
    const secondDateText = await page1
      .locator("div._secondary_losjl_76")
      .first()
      .innerText();

    const secondDate = secondDateText.match(dateRegex)?.[0];

    expect(secondDate).toBeDefined();
    expect(firstDate).toBe(secondDate);
  },
);
