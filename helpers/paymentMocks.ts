import { Page } from "@playwright/test";

// отправка смс мб удалить
export async function mockSmsPaymentRequest(page: Page) {
  await page.route(
    "**/api/eCardPaymentsApi/api/v1/orders/payments:createWithSmsSending",
    async (route) => {
      const request = route.request();
      const body = request.postDataJSON();

      console.log("SMS payment request body:", body);

      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          success: true,
          message: "SMS отправлена успешно",
        }),
      });
    },
  );
}

// подмена payment
export async function mockOrderPaidStatus(page: Page) {
  await page.route("**/api/sapApi/api/cerebro/v1/orders/**", async (route) => {
    const request = route.request();

    if (request.method() !== "PUT") {
      await route.continue();
      return;
    }

    const requestBody = request.postDataJSON();
    console.log("Original PUT order request body:", requestBody);

    const response = await route.fetch();
    const json = await response.json();

    console.log("Original PUT order response payment:", json?.data?.payment);

    if (json?.data?.payment) {
      json.data.payment = {
        ...json.data.payment,
        totalOld: json.data.payment.totalOld ?? json.data.payment.total,
        total: json.data.payment.total,
        payed: json.data.payment.total,
        plait: false,
        status: "Полностью оплачен",
        card: 0,
        cash: 0,
        qr: 0,
        scores: 0,
      };
    }

    console.log("Mocked PUT order response payment:", json?.data?.payment);

    await route.fulfill({
      status: response.status(),
      headers: response.headers(),
      contentType: "application/json",
      body: JSON.stringify(json),
    });
  });
}

// оплата ПЛАЙТ
export async function mockFullPlait(page: Page) {
  await page.route("**/api/sapApi/api/cerebro/v1/orders/**", async (route) => {
    const request = route.request();

    if (request.method() !== "PUT") {
      await route.continue();
      return;
    }

    const requestBody = request.postDataJSON();
    console.log("Original PUT order request body:", requestBody);

    const response = await route.fetch();
    const json = await response.json();

    console.log("Original PUT order response payment:", json?.data?.payment);

    if (json?.data?.payment) {
      json.data.payment = {
        ...json.data.payment,
        totalOld: json.data.payment.totalOld ?? json.data.payment.total,
        total: json.data.payment.total,
        payed: json.data.payment.total,
        plait: true,
        status: "Полностью оплачен",
        card: 0,
        cash: 0,
        qr: 0,
        scores: 0,
      };
    }

    console.log("Mocked PUT order response payment:", json?.data?.payment);

    await route.fulfill({
      status: response.status(),
      headers: response.headers(),
      contentType: "application/json",
      body: JSON.stringify(json),
    });
  });
}
