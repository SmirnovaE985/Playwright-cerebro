import { Page } from "@playwright/test";

export class SearchProduct {
  constructor(private readonly page: Page) {}

  // выбор магазина в листинге
  private readonly objectSelect = () =>
    this.page.locator(".ant-select-selection-overflow");

  // ввести запрос на поиск товара
  private readonly searchInput = () =>
    this.page.locator('[data-test="search-input"]');

  // найти товар
  private readonly searchButton = () =>
    this.page.locator('[data-test="search-button"]');

  // переключить свитчер "скрыть нулевые остатки"
  private readonly remainSwitch = () =>
    this.page.locator('[data-test="remain-switch"]');

  async selectObject(objectName: string | string[]) {
    const objects = Array.isArray(objectName) ? objectName : [objectName];

    for (const name of objects) {
      await this.objectSelect().click();

      const input = this.page
        .locator(".ant-select-selection-search-input")
        .last();
      await input.fill(name);

      const dropdown = this.page.locator(".ant-select-dropdown").last();
      const option = dropdown
        .locator(".ant-select-item-option")
        .filter({ hasText: name })
        .first();

      await option.waitFor({ state: "visible" });
      await option.click();
    }
  }

  // отдельная кнопка на переключатель "Скрыть нулевые остатки"
  async toggleRemainSwitch() {
    await this.remainSwitch().click();
  }

  // поиск товара
  async searchProduct(productName: string) {
    await this.searchInput().click();
    await this.searchInput().fill(productName);
    await this.searchButton().click();
    await this.remainSwitch().click();
  }
}
