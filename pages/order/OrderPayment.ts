import { expect, Page } from "@playwright/test";

//  поправить кликеры на плайт, проблема в смс
export class OrderPaymentByLink {
  constructor(private readonly page: Page) {}

  // сценарий оплаты по ссылке
  private readonly paymentModal = () =>
    this.page.getByRole("dialog", { name: "Оплата заказа через смс" });

  private readonly payMethodsButton = () =>
    this.page.locator('[data-test="pay-methods"]');

  private readonly smsPaymentButton = () =>
    this.page.locator('[data-test="sms-payment"]');

  private readonly sendSmsButton = () =>
    this.paymentModal().getByRole("button", { name: "Отправить смс" });

  // сценарий оплаты плайт

  private readonly paymentModalPlait = () =>
    this.page.getByRole("dialog", { name: "Оплата заказа через Плайт" });

  private readonly plaitPaymentButton = () =>
    this.page.locator('[data-test="plait-payment"]');

  private readonly sendSmsButtonPlait = () =>
    this.paymentModalPlait().getByRole("button", { name: "Отправить смс" });

  //
  private readonly saveOrderButton = () =>
    this.page.getByText("Сохранить заказ", { exact: true });

  private readonly fullyPaidStatus = () =>
    this.page.getByText("Полностью оплачен", { exact: true });

  async openPayMethods() {
    await expect(this.payMethodsButton()).toBeVisible({ timeout: 10000 });
    await this.payMethodsButton().click();
  }

  // выбрать тип оплаты
  async chooseSmsPayment() {
    await expect(this.smsPaymentButton()).toBeVisible({ timeout: 10000 });
    await this.smsPaymentButton().click();
  }

  // выбрать тип оплаты Плайт
  async choosePlaitPayment() {
    await expect(this.plaitPaymentButton()).toBeVisible({ timeout: 10000 });
    await this.plaitPaymentButton().click();
  }

  // отпр смс на оплату
  async clickSendSmsButton() {
    await expect(this.paymentModal()).toBeVisible({ timeout: 10000 });
    await expect(this.sendSmsButton()).toBeVisible({ timeout: 10000 });
    await expect(this.sendSmsButton()).toBeEnabled();
    await this.sendSmsButton().click();
  }

  async clickSendSmsButtonPlait() {
    await expect(this.paymentModalPlait()).toBeVisible({ timeout: 10000 });
    await expect(this.sendSmsButtonPlait()).toBeVisible({ timeout: 10000 });
    await expect(this.sendSmsButtonPlait()).toBeEnabled();
    await this.sendSmsButtonPlait().click();
  }
  // ожидание доступности сохранения заказа
  async waitForSaveOrderButton() {
    await expect(this.saveOrderButton()).toBeVisible({ timeout: 10000 });
    await expect(this.saveOrderButton()).toBeEnabled();
  }

  async saveOrder() {
    await this.waitForSaveOrderButton();
    await this.saveOrderButton().click();
  }

  async expectOrderFullyPaid() {
    await expect(this.fullyPaidStatus()).toBeVisible({ timeout: 10000 });
  }

  // открыли модалку, выбрали тип, отправили смс
  async payViaSmsLink() {
    await this.openPayMethods();
    await this.chooseSmsPayment();
    await this.clickSendSmsButton();
  }

  // открыли модалку, выбрали тип, отправили смс
  async payPlait() {
    await this.openPayMethods();
    await this.choosePlaitPayment();
    await this.clickSendSmsButtonPlait();
  }
}
