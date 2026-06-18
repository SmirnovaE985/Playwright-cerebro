import { expect, Page } from "@playwright/test";

export class OrderPaymentByLink {
  constructor(private readonly page: Page) {}

  private readonly paymentModal = () =>
    this.page.getByRole("dialog", { name: "Оплата заказа через смс" });

  private readonly payMethodsButton = () =>
    this.page.locator('[data-test="pay-methods"]');

  private readonly smsPaymentButton = () =>
    this.page.locator('[data-test="sms-payment"]');

  private readonly sendSmsButton = () =>
    this.paymentModal().getByRole("button", { name: "Отправить смс" });

  private readonly saveOrderButton = () =>
    this.page.getByText("Сохранить заказ", { exact: true });

  private readonly fullyPaidStatus = () =>
    this.page.getByText("Полностью оплачен", { exact: true });

  async openPayMethods() {
    await expect(this.payMethodsButton()).toBeVisible({ timeout: 10000 });
    await this.payMethodsButton().click();
  }

  async chooseSmsPayment() {
    await expect(this.smsPaymentButton()).toBeVisible({ timeout: 10000 });
    await this.smsPaymentButton().click();
  }

  async clickSendSmsButton() {
    await expect(this.paymentModal()).toBeVisible({ timeout: 10000 });
    await expect(this.sendSmsButton()).toBeVisible({ timeout: 10000 });
    await expect(this.sendSmsButton()).toBeEnabled();
    await this.sendSmsButton().click();
  }

  async saveOrder() {
    await expect(this.saveOrderButton()).toBeVisible({ timeout: 10000 });
    await this.saveOrderButton().click();
  }

  async expectOrderFullyPaid() {
    await expect(this.fullyPaidStatus()).toBeVisible({ timeout: 10000 });
  }

  async payViaSmsLink() {
    await this.openPayMethods();
    await this.chooseSmsPayment();
    await this.clickSendSmsButton();
  }
}
