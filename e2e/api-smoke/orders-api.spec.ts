import { test, expect } from "@playwright/test";
import { label, feature } from "allure-js-commons";

test(
  "Создание заказа через POST /v1/orders",
  { tag: ["@api", "@smoke"] },
  async ({ request }) => {
    label("tag", "api");
    label("tag", "smoke");
    feature("Orders API");

    const response = await request.post("https://test.pas.sdvor.com/api/cerebro/v1/orders", {
      headers: {
        "x-app-client": "ТУТ_X_APP_CLIENT",
        "x-token": "ТУТ_X_TOKEN",
        "Authorization": "ТУТ_AUTHORIZATION",
        "Content-Type": "application/json",
      },
      data: {
        parentNumber: "123456",
        typeCode: "stri",
        source: "stri",
        guid: "test-guid-123",
        authorCode: "string",
        contractCode: "string",
        proxyCode: "string",
        salesOrgCode: "stri",
        salesDepCode: "stri",
        salesChnCode: "str",
        salesGrpCode: "str",
        payment: {
          totalOld: 99.99
        }
      },
    });

    expect(response.status()).toBe(200);

    const body = await response.json();

    expect(body).toBeDefined();
    expect(body.apiVersion).toBeDefined();
    expect(body.data).toBeDefined();
  }
);