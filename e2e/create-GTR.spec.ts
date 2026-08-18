import { test, expect } from "@playwright/test";
import { createAppeal } from "../helpers/commands";
import { deleteAllPositions } from "../helpers/commands";
import { label, feature } from "allure-js-commons";
import { AppealStartPage } from "../pages/appeal/AppealStartPage";
import { OrderCreatePage } from "../pages/order/OrderCreatePage";
import { ConcreteComponent } from "../pages/components/ComponentPage";
import { SendSms } from "../pages/components/ComponentPage";
import { SearchProduct } from "../pages/components/SearchProduct";

test(
  "#4584 Создание заказа с нескольких магазинов",
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

    await searchProduct.searchProduct("кирпич");
  },
);
