import { expect, Page } from "@playwright/test";

export type ConcreteCarFormData = {
  quantity: string;
  address: string;
  comment?: string;
};

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

export class EditOrderPage {
  constructor(private readonly page: Page) {}

  // поле "Номер заказа" при причине обращения "Редактирование"
  private readonly searchInputEditOrder = () =>
    this.page.locator('[data-test="search-input-number-order"]');

  // кликнуть найти
  private readonly addButtonSearch = () =>
    this.page.getByRole("button", { name: " Найти " });

  // ввести номер заказа в причине обращения "Редактирование"
  async searchInputEditOrderBtn(orderNumber?: string | number) {
    const input = this.searchInputEditOrder();

    await input.waitFor({ state: "visible" });
    await input.click();

    if (orderNumber !== undefined && orderNumber !== null) {
      await input.press("Control+A");
      await input.press("Backspace");
      await input.type(String(orderNumber));
      await expect(input).toHaveValue(String(orderNumber));
      await this.addButtonSearch().click();
    }
  }
}

export class SendSms {
  constructor(private readonly page: Page) {}

  // =============
  // ОТПРАВКА SMS
  // ==================

  // открыть отправку sms
  private readonly sendSmsButton = () =>
    this.page.locator('[data-test="send-sms"]');

  // открыть список шаблонов sms
  private readonly patternSmsButton = () =>
    this.page.locator('[data-test="pattern-sms"]');

  // выбрать шаблон sms по названию
  private readonly smsPatternOption = (patternName: string) =>
    this.page.getByText(patternName);

  // отправить sms
  private readonly sendSmsForButton = () =>
    this.page.locator('[data-test="send-sms-for"]');

  // сообщение об успешной отправке sms
  private readonly smsSentSuccessMessage = () =>
    this.page.getByText("Сообщение успешно отправлено!");

  // ========
  //  методы
  // ========

  // открыть модалку/форму отправки sms
  async openSendSms() {
    await this.sendSmsButton().click();
  }

  // открыть список шаблонов sms
  async openSmsPatterns() {
    await this.patternSmsButton().click();
  }

  // выбрать шаблон sms
  async chooseSmsPattern(patternName: string) {
    await this.smsPatternOption(patternName).click();
  }

  // отправить sms
  async sendSms() {
    await this.sendSmsForButton().click();
  }

  // полный сценарий отправки sms по шаблону
  async sendSmsWithPattern(patternName: string) {
    await this.openSendSms();
    await this.openSmsPatterns();
    await this.chooseSmsPattern(patternName);
    await this.sendSms();
  }

  // ожидание успешной отправки sms
  async expectSmsSentSuccess() {
    await expect(this.smsSentSuccessMessage()).toBeVisible();
  }
}
