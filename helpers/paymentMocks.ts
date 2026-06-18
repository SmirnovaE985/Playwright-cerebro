import { Page } from "@playwright/test";

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

export async function setupOrderPaidStatusMock(page: Page) {
  let paidModeEnabled = false;

  await page.route("**/api/sapApi/api/cerebro/v1/orders/**", async (route) => {
    const request = route.request();

    if (request.method() !== "PUT") {
      await route.continue();
      return;
    }

    if (!paidModeEnabled) {
      await route.continue();
      return;
    }

    const response = await route.fetch();
    const json = await response.json();

    console.log("Original order payment status:", json?.data?.payment?.status);

    if (json?.data?.payment) {
      json.data.payment = {
        ...json.data.payment,
        payed: json.data.payment.total,
        plait: true,
        status: "Полностью оплачен",
      };
    }

    console.log("Mocked order payment status:", json?.data?.payment?.status);

    await route.fulfill({
      status: response.status(),
      headers: response.headers(),
      contentType: "application/json",
      body: JSON.stringify(json),
    });
  });

  return {
    enablePaidMode: () => {
      paidModeEnabled = true;
    },
  };
}
