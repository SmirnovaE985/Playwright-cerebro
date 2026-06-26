import { Page, expect } from "@playwright/test";

export class Services {
  constructor(private readonly page: Page) {}

  private readonly modal = () => this.page.locator(".ant-modal-content");

  private readonly servicesButton = () =>
    this.page.getByRole("button", { name: "Сервисы" });

  private readonly serviceMenuButton = () =>
    this.page.getByText("Услуги", { exact: true });

  private readonly serviceTypeSelect = () =>
    this.modal().locator(".ant-select-selector");

  private serviceOption = (serviceName: string) =>
    this.page.locator(".ant-select-item-option", { hasText: serviceName });

  private readonly buttonOk = () =>
    this.modal().getByRole("button", { name: "OK" });

  private readonly successfullyCheck = () =>
    this.page.getByText("Услуга отправлена");

  async selectServiceType(serviceName: string) {
    await this.servicesButton().click();
    await this.page.waitForTimeout(3000);
    await this.serviceMenuButton().click();
    await this.page.waitForTimeout(2000);
    await expect(this.serviceTypeSelect()).toBeVisible();
    await this.serviceTypeSelect().click();
    await this.page.waitForTimeout(2000);
    await expect(this.serviceOption(serviceName)).toBeVisible();
    await this.serviceOption(serviceName).click();
    await this.page.waitForTimeout(2000);

    await expect(this.serviceTypeSelect()).toContainText(serviceName);

    await expect(this.buttonOk()).toBeEnabled({ timeout: 10000 });
    await this.buttonOk().click();
    await expect(this.successfullyCheck()).toBeVisible();
  }
}
