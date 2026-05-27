import { expect, Page } from "@playwright/test";

type ConcreteCarFormData = {
  quantity: string;
  address: string;
  comment?: string;
};

export class ComponentPage {
  constructor(private readonly page: Page) {}

  // ==========
  // БЕТОН
  // ЛОКАТОРЫ
  // ==========

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

  // ==========
  // БЕТОН
  // МЕТОДЫ
  // ==========

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

  async submitSavedCar() {}

  // ==========================
  // РЕГИСТРАЦИЯ В ЛОЯЛЬНОСТИ
  // ЛОКАТОРЫ
  // ==========================

  private readonly registerInLoyaltyButton = () =>
    this.page.getByRole("button", { name: "Зарегистрируй клиента в ПЛ" });

  private readonly loyaltyRegistrationModal = () =>
    this.page.getByRole("button", { name: "Подтверждение кодом" });

  private readonly loyaltyRegistrationSendButton = () =>
    this.page.getByRole("button", { name: "Отправить" });

  // ==========================
  // РЕГИСТРАЦИЯ В ЛОЯЛЬНОСТИ
  // МЕТОДЫ
  // ==========================

  async clickRegisterInLoyalty() {
    await this.registerInLoyaltyButton().click();
  }

  async choseSendCode() {
    await this.loyaltyRegistrationModal().click();
  }

  async expectLoyaltyRegistrationModalVisible() {
    await expect(this.loyaltyRegistrationModal()).toBeVisible();
  }

  async clickLoyaltyRegistrationSend() {
    await this.loyaltyRegistrationSendButton().click();
  }
}
