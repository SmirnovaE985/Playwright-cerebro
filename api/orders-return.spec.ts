// полный возврат отгруженного заказа (для успешного прохождения теста, необходимо положить в переменную отгруженный заказ)
// нельзя вернуть неотгруженный заказ
// Получение заказов на возврат по заказу
// Нет возвратов по заказу

import { test, expect } from "@playwright/test";

// полный возврат отгруженного заказа
test("POST /v1/orders/return/{orderId} - создать возврат в отгруженном заказе", async ({
  request,
}) => {
  const baseUrl = (process.env.BASE_URL_FOR_SAP_API as string).replace(
    /\/$/,
    "",
  );
  const orderId = process.env.ORDER_ID as string;
  const xAppClient = process.env.X_APP_CLIENT as string;
  const xToken = process.env.X_TOKEN as string;
  const username = process.env.USER_LOGIN as string;
  const password = process.env.USER_PASSWORD as string;

  const basicAuth = Buffer.from(`${username}:${password}`).toString("base64");

  const response = await request.post(
    `${baseUrl}/v1/orders/return/${orderId}`,
    {
      headers: {
        Accept: "application/json",
        "x-app-client": xAppClient,
        "x-token": xToken,
        Authorization: `Basic ${basicAuth}`,
      },
    },
  );

  const status = response.status();
  const contentType = response.headers()["content-type"] || "";
  const text = await response.text();

  console.log("status:", status);
  console.log("content-type:", contentType);
  console.log("response text:", text);

  expect(status).toBe(200);
});

// нельзя вернуть неотгруженный заказ
test("POST /v1/orders/return/{orderId} - нельзя создать возврат", async ({
  request,
}) => {
  const baseUrl = (process.env.BASE_URL_FOR_SAP_API as string).replace(
    /\/$/,
    "",
  );
  const orderId = process.env.ORDER_ID_NEGATIVE as string;
  const xAppClient = process.env.X_APP_CLIENT as string;
  const xToken = process.env.X_TOKEN as string;
  const username = process.env.USER_LOGIN as string;
  const password = process.env.USER_PASSWORD as string;

  const basicAuth = Buffer.from(`${username}:${password}`).toString("base64");

  const response = await request.post(
    `${baseUrl}/v1/orders/return/${orderId}`,
    {
      headers: {
        Accept: "application/json",
        "x-app-client": xAppClient,
        "x-token": xToken,
        Authorization: `Basic ${basicAuth}`,
      },
    },
  );

  const body = await response.json();

  console.log("status:", response.status());
  console.log("response:", JSON.stringify(body, null, 2));

  expect(response.status()).toBe(409);
  expect(body.apiVersion).toBeDefined();
  expect(body.error).toBeDefined();
  expect(body.error.code).toBe(409);
  expect(body.error.message).toBe("Conflict");
  expect(body.error.errors).toBeDefined();
  expect(body.error.errors.length).toBeGreaterThan(0);
  expect(body.error.errors[0].message).toBe("Нет позиций к возврату");
});

// Получение заказов на возврат по заказу
test("GET /v1/orders/return/{orderId}", async ({ request }) => {
  const baseUrl = (process.env.BASE_URL_FOR_SAP_API as string).replace(
    /\/$/,
    "",
  );
  const orderId = process.env.ORDER_ID as string;
  const xAppClient = process.env.X_APP_CLIENT as string;
  const xToken = process.env.X_TOKEN as string;
  const username = process.env.USER_LOGIN as string;
  const password = process.env.USER_PASSWORD as string;

  const basicAuth = Buffer.from(`${username}:${password}`).toString("base64");

  const response = await request.get(`${baseUrl}/v1/orders/return/${orderId}`, {
    headers: {
      Accept: "application/json",
      "x-app-client": xAppClient,
      "x-token": xToken,
      Authorization: `Basic ${basicAuth}`,
    },
  });

  const status = response.status();
  const contentType = response.headers()["content-type"] || "";
  const body = await response.json();

  console.log("status:", status);
  console.log("content-type:", contentType);
  console.log("response body:", JSON.stringify(body, null, 2));

  expect(status).toBe(200);
  expect(contentType).toContain("application/json");

  expect(body.apiVersion).toBeDefined();
  expect(body.data).toBeDefined();
  expect(Array.isArray(body.data)).toBe(true);
  expect(body.data.length).toBeGreaterThan(0);

  expect(body.data[0].returnOrderNumber).toBeTruthy();
  expect(body.data[0].date).toBeTruthy();
  expect(body.data[0].customer).toBeTruthy();
  expect(body.data[0].status).toBeTruthy();
  expect(body.data[0].sum).toBeDefined();
  expect(body.data[0].grossProfit).toBeDefined();
  expect(body.data[0].markup).toBeDefined();
});

// Нет возвратов по заказу
test("GET /v1/orders/return/{orderId} - не отображаем заказы, в которых нет возврата", async ({
  request,
}) => {
  const baseUrl = (process.env.BASE_URL_FOR_SAP_API as string).replace(
    /\/$/,
    "",
  );
  const orderId = process.env.ORDER_ID_NEGATIVE as string;
  const xAppClient = process.env.X_APP_CLIENT as string;
  const xToken = process.env.X_TOKEN as string;
  const username = process.env.USER_LOGIN as string;
  const password = process.env.USER_PASSWORD as string;

  const basicAuth = Buffer.from(`${username}:${password}`).toString("base64");

  const response = await request.get(`${baseUrl}/v1/orders/return/${orderId}`, {
    headers: {
      Accept: "application/json",
      "x-app-client": xAppClient,
      "x-token": xToken,
      Authorization: `Basic ${basicAuth}`,
    },
  });

  const body = await response.json();

  console.log("status:", response.status());
  console.log("response:", JSON.stringify(body, null, 2));

  expect(response.status()).toBe(409);
  expect(body.apiVersion).toBeDefined();
  expect(body.error).toBeDefined();
  expect(body.error.code).toBe(409);
  expect(body.error.message).toBe("Conflict");
  expect(body.error.errors).toBeDefined();
  expect(body.error.errors.length).toBeGreaterThan(0);
  expect(body.error.errors[0].message).toBe("Нет возвратов по заказу");
});
