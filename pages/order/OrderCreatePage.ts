import { expect, Page } from "@playwright/test";

export class OrderCreatePage {
  constructor(private readonly page: Page) {}

  private readonly objectSelect = () =>
    this.page.locator(".ant-select-selection-overflow");

  private readonly searchInput = () =>
    this.page.locator('[data-test="search-input"]');

  private readonly searchButton = () =>
    this.page.locator('[data-test="search-button"]');

  private readonly firstShoppingCardButton = () =>
    this.page.locator('[data-test="shopping-card-button"]').first();

  private readonly editUnitsButton = () =>
    this.page.locator('[data-test="modal-edit-units"]');

  private readonly unitPm = () => this.page.locator('[data-test="unit-PM"]');

  private readonly addButton = () =>
    this.page.getByRole("button", { name: "Добавить" });

  private readonly toCartButton = () =>
    this.page.locator('[data-test="to-cart-button"]');

  private readonly makeOrderButton = () =>
    this.page.locator('[data-test="make-order"]');

  private readonly cartPosition = () =>
    this.page.locator('[data-test="cart-position"]');

  private readonly unitRol = () => this.page.locator('[data-test="unit-ROL"]');

  private readonly saveEditPositionButton = () =>
    this.page.locator('[data-test="save-btn-in-modal-edit-position"]');

  private readonly notificationCloseButton = () =>
    this.page.locator(".ant-notification-notice-close").first();

  async selectObject(objectName: string) {
    await this.objectSelect().click();
    await this.page.getByText(objectName).click();
  }

  async searchProduct(productName: string) {
    await this.searchInput().click();
    await this.searchInput().fill(productName);
    await this.searchButton().click();
  }

  async openFirstProductCard() {
    await this.firstShoppingCardButton().click();
  }

  async editUnitsToPm() {
    await this.editUnitsButton().click();
    await this.unitPm().click();
  }

  async addSelectedUnits() {
    await this.addButton().click();
  }

  async addToCart() {
    await this.toCartButton().click();
  }

  async makeOrder() {
    await this.makeOrderButton().click();
  }

  async expectOrderNotSavedError() {
    await expect(
      this.page.getByText("Произошла ошибка, заказ не сохранен"),
    ).toBeVisible();
  }

  async openCartPosition() {
    await this.cartPosition().click();
  }

  async changeUnitToRol() {
    await this.editUnitsButton().click();
    await this.unitRol().click();
  }

  async saveEditedPosition() {
    await this.saveEditPositionButton().click();
  }

  async expectOrderCreatedSuccess() {
    await expect(this.page.getByText("Заказ успешно создан")).toBeVisible();
  }

  async closeNotification() {
    await this.notificationCloseButton().click();
  }
}
