import { expect, Page } from "@playwright/test";

export type ConcreteCarFormData = {
  quantity: string;
  address: string;
  comment?: string;
};

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

export class LoyaltyComponent {
  constructor(private readonly page: Page) {}

  private readonly registerInLoyaltyButton = () =>
    this.page.getByRole("button", { name: "Зарегистрируй клиента в ПЛ" });

  private readonly loyaltyRegistrationModal = () =>
    this.page.getByRole("button", { name: "Подтверждение кодом" });

  private readonly loyaltyRegistrationSendButton = () =>
    this.page.getByRole("button", { name: "Отправить" });

  async clickRegisterInLoyalty() {
    await this.registerInLoyaltyButton().click();
  }

  async chooseSendCode() {
    await this.loyaltyRegistrationModal().click();
  }

  async expectLoyaltyRegistrationModalVisible() {
    await expect(this.loyaltyRegistrationModal()).toBeVisible();
  }

  async clickLoyaltyRegistrationSend() {
    await this.loyaltyRegistrationSendButton().click();
  }
}

export class ConcreteComponent {
  constructor(private readonly page: Page) {}

  private readonly quantityInputs = () =>
    this.page.locator('[data-test="add-quantity-input"]');

  private readonly deliveryAddressInput = () =>
    this.page.locator('[data-test="delivery-address"]');

  private readonly firstAddressSuggestion = (addressText: string) =>
    this.page.getByText(addressText).first();

  private readonly deliveryDateInput = () =>
    this.page.locator('input[placeholder*="Выберите дату"]');

  private readonly deliveryDateCell = (date: string) =>
    this.page.locator(`td[title="${date}"]`);

  private readonly commentCarInput = () =>
    this.page.locator('[data-test="comment-car"]');

  private readonly addConcreteCarSubmitButton = () =>
    this.page.locator(".ant-btn-primary", { hasText: "Добавить" });

  private readonly saveConcreteCarSubmitButton = () =>
    this.page.locator(".ant-btn-primary", { hasText: "Сохранить" });

  async fillQuickAddQuantity(value: string) {
    await this.quantityInputs().first().click();
    await this.quantityInputs().first().clear();
    await this.quantityInputs().first().fill(value);
  }

  async fillDeliveryAddress(address: string) {
    await this.deliveryAddressInput().fill(address);
    await this.firstAddressSuggestion(address).click();
  }

  async selectTomorrowDeliveryDate() {
    await this.deliveryDateInput().click();

    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const year = tomorrow.getFullYear();
    const month = String(tomorrow.getMonth() + 1).padStart(2, "0");
    const day = String(tomorrow.getDate()).padStart(2, "0");
    const tomorrowFormatted = `${year}-${month}-${day}`;

    await this.deliveryDateCell(tomorrowFormatted).click();
  }

  async fillCarComment(comment: string) {
    await this.commentCarInput().fill(comment);
  }

  async expectCarCommentToHaveValue(comment: string) {
    await expect(this.commentCarInput()).toHaveValue(comment);
  }

  async submitAddedCar() {
    await this.addConcreteCarSubmitButton().click();
  }

  async submitSavedCar() {
    await this.saveConcreteCarSubmitButton().click();
  }

  async saveConcreteCar(data: ConcreteCarFormData) {
    await this.fillQuickAddQuantity(data.quantity);
    await this.fillDeliveryAddress(data.address);
    await this.selectTomorrowDeliveryDate();

    if (data.comment) {
      await this.fillCarComment(data.comment);
    }

    await this.submitAddedCar();
  }
}
