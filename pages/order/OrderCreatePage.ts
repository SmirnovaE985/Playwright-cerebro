import { expect, Page } from "@playwright/test";

// ========
// локаторы
// ========
export class OrderCreatePage {
  constructor(private readonly page: Page) {}

  // выбор магазина в листинге
  private readonly objectSelect = () =>
    this.page.locator(".ant-select-selection-overflow");

  private readonly searchInput = () =>
    this.page.locator('[data-test="search-input"]');

  private readonly searchButton = () =>
    this.page.locator('[data-test="search-button"]');

  private readonly firstShoppingCardButton = () =>
    this.page.locator('[data-test="shopping-card-button"]').first();

  private readonly shoppingCardButtons = () =>
    this.page.locator('[data-test="shopping-card-button"]');

  // количество в карточке товара (поиск)
  private readonly quantityInputs = () =>
    this.page.locator('[data-test="add-quantity-input"]');

  // изменить ЕИ в модалке товара (поиск)
  private readonly editUnitsButton = () =>
    this.page.locator('[data-test="modal-edit-units"]');

  // private readonly unitPm = () => this.page.locator('[data-test="unit-PM"]');

  // добавить товар в корзину
  private readonly addButton = () =>
    this.page.getByRole("button", { name: "Добавить" });

  // перейти в корзину
  private readonly toCartButton = () =>
    this.page.locator('[data-test="to-cart-button"]');

  // ===============
  // КОРЗИНА ЗАКАЗА
  // ===============

  // сздать предложение
  private readonly makeOfferButton = () =>
    this.page.locator('[data-test="make-offer"]');

  // создать заказ
  private readonly makeOrderButton = () =>
    this.page.locator('[data-test="make-order"]');

  // сохранить заказ
  private readonly saveOrderButton = () =>
    this.page.locator('[data-test="save-order"]');

  // количество позиций в корзине (именно как сущностей)
  private readonly cartPositions = () =>
    this.page.locator('[data-test="cart-position"]');

  // отмена позиции
  private readonly deletePositionButtons = () =>
    this.page.locator('[data-test="delete-position"]');

  // закрыть заказ
  private readonly closeOrderButton = () =>
    this.page.locator('[data-test="close-order-btn"]');
  private readonly confirmOkButton = () => this.page.getByText("OK");

  // закрыть нотификашку
  private readonly notificationCloseButton = () =>
    this.page.locator(".ant-notification-notice-close").first();

  // перейти в поиск из корзины
  private readonly goInSearchButton = () =>
    this.page.locator('[data-test="btn-go-in-search"]');

  // услуги внутри корзины

  // признак колеровки у товара
  private readonly coloringButtons = () =>
    this.page.locator('[data-icon="format-painter"]');

  // ?
  private readonly spinner = () => this.page.locator(".ant-spin-spinning");

  // ?
  private readonly modalPositionCost = () =>
    this.page.locator('[data-test="modal-position-cost"]');

  // ?
  private readonly cartTotalCost = () =>
    this.page.locator('[data-test="cart-total-cost"]');

  // ?
  private normalizePrice(value: string | null | undefined): string {
    return String(value ?? "").replace(/[^0-9]/g, "");
  }

  // ============================================
  // МОДАЛКА РЕДАКТИРОВАНИЯ ТОВАРА ВНУТРИ КОРЗИНЫ
  // ============================================
  // открыть модалку редактирования товара
  private readonly cartPosition = () =>
    this.page.locator('[data-test="cart-position"]');

  // запомнить цену в модалке редактирования
  private readonly modalEditInputPrice = () =>
    this.page.locator('[data-test="modal-edit-input-price"]');

  // private readonly unitRol = () => this.page.locator('[data-test="unit-ROL"]');
  // сохранить изменения в модалке редактирования товара
  private readonly saveEditPositionButton = () =>
    this.page.locator('[data-test="save-btn-in-modal-edit-position"]');

  private readonly coloringButton = () =>
    this.page.locator('[data-test="coloring"]');

  // переключить свитчер
  private readonly remainSwitch = () =>
    this.page.locator('[data-test="remain-switch"]');

  // ======
  // методы
  // ======

  // выбираем магазин (один или несколько)
  async selectObject(objectName: string | string[]) {
    const objects = Array.isArray(objectName) ? objectName : [objectName];

    await this.objectSelect().click();

    const dropdown = this.page.locator(".ant-select-dropdown").last();

    for (const name of objects) {
      const option = dropdown
        .locator(".ant-select-item-option")
        .filter({
          hasText: name,
        })
        .first();

      await option.scrollIntoViewIfNeeded();
      await option.click();
    }
  }

  // поиск товара (добавить намбер)
  async searchProduct(productName: string) {
    await this.searchInput().click();
    await this.searchInput().fill(productName);
    await this.searchButton().click();
  }

  async openFirstProductCard() {
    await this.firstShoppingCardButton().click();
  }

  async openProductCardByIndex(index: number) {
    await this.shoppingCardButtons().nth(index).click();
  }

  async toggleRemainSwitch() {
    await this.remainSwitch().click();
  }

  // добавить количество товара к магазинам внутри карточки товара
  async fillQuantityForAllInputs(value: string) {
    await expect(this.quantityInputs().first()).toBeVisible();

    const count = await this.quantityInputs().count();

    for (let i = 0; i < count; i++) {
      await this.quantityInputs().nth(i).fill(value);
    }
  }
  // добавить в корзину из карточки
  async addButtonInCart() {
    await this.addButton().click();
  }
  //  перейти в корзину
  async addToCart() {
    await this.toCartButton().click();
  }

  // ==============
  // КОРЗИНА ЗАКАЗА
  // ==============

  // создать предложение
  async makeOffer() {
    await this.makeOfferButton().click();
    await expect(
      this.page.getByText("Предложение успешно создано"),
    ).toBeVisible();
  }

  // создать заказ
  async makeOrder() {
    await this.makeOrderButton().click();
  }

  // сохранить заказ
  async saveOrder() {
    await this.saveOrderButton().click();
  }
  // проверка "Успешно сохранено"
  async expectSaveOrderEnabled() {
    await expect(this.saveOrderButton()).toBeEnabled();
  }
  // проверка "Успешно сохранено"
  async expectOrderSavedSuccess() {
    await expect(this.page.getByText("Успешно сохранено")).toBeVisible();
  }

  // отменить позицию (по индексу: await orderCreatePage.deleteCartPosition(0);)
  async deleteCartPosition(index: number) {
    await this.deletePositionButtons().nth(index).click();
  }

  //  закрыть заказ
  async closeOrder() {
    await this.closeOrderButton().click();
    await this.confirmOkButton().click();
  }

  // Получить текущее количество позиций в корзине
  async getCartPositionsCount() {
    return await this.cartPositions().count();
  }

  // Проверить количество позиций в корзине
  async expectCartPositionsCountToBe(expected: number) {
    await expect(this.cartPositions()).toHaveCount(expected);
  }

  // ожидание ошибки создания заказа
  async expectOrderNotSavedError() {
    await expect(
      this.page.getByText("Произошла ошибка, заказ не сохранен"),
    ).toBeVisible();
  }

  //  ожидание успеха создания заказа
  async expectOrderCreatedSuccess() {
    await expect(this.page.getByText("Заказ успешно создан")).toBeVisible();
  }

  // =============================================
  //  МОДАЛКА РЕДАКТИРОВАНИЯ ТОВАРА ВНУТРИ КОРЗИНЫ
  // =============================================

  // открыть модалку редактирования товара внутри корзины
  async openCartPosition() {
    await this.cartPosition().click();
  }

  // смена ЕИ (выбор по тексту ЕИ)
  async changeUnit(unitName: string) {
    await this.editUnitsButton().click();
    await this.page.getByText(unitName).click();
  }

  // смена ЕИ (выбор по дата-атрибуту ЕИ)
  async changeUnitDataLoc(unitTestId: string) {
    await this.editUnitsButton().click();
    await this.page.locator(`[data-test="${unitTestId}"]`).click();
  }

  // дождаться, что цена в инпуте изменилась
  async waitModalEditInputPriceChanged(previousValue: string) {
    await expect
      .poll(async () => {
        return this.normalizePrice(
          await this.modalEditInputPrice().inputValue(),
        );
      })
      .not.toBe(previousValue);
  }

  // получаем нормализованную цену из модалки товара
  async getModalEditInputPriceNormalized() {
    return this.normalizePrice(await this.modalEditInputPrice().inputValue());
  }

  // итоговая стоимость в корзине стала равна ожидаемому значению
  async expectCartTotalCostToBe(expected: string) {
    await expect
      .poll(async () => {
        return this.normalizePrice(await this.cartTotalCost().textContent());
      })
      .toBe(expected);
  }

  // фиксируем цены в модалке карточки товара

  async getCartTotalCostNormalized() {
    return this.normalizePrice(await this.cartTotalCost().textContent());
  }

  // сохранить изменения в модалке корзине
  async saveEditedPosition() {
    await this.saveEditPositionButton().click();
  }
  // закрыть нотификашки в корзине
  async closeNotification() {
    await this.notificationCloseButton()
      .click()
      .catch(() => {});
  }

  // добавить одну колеровку через общую кнопку
  async addColoring(code: string) {
    await this.coloringButtons().click();

    const modal = this.page.locator(".ant-modal").last();
    const codeInput = modal.getByRole("textbox", { name: "Код", exact: true });

    await expect(modal).toBeVisible();
    await expect(codeInput).toBeVisible();
    await codeInput.click();
    await codeInput.fill(code);
    const option = modal
      .locator('[data-test="colors-item"]')
      .filter({ hasText: code });

    await expect(option).toBeVisible({ timeout: 5000 });
    await option.click();

    const saveButton = modal.getByRole("button", {
      name: "Сохранить",
      exact: true,
    });

    await expect(saveButton).toBeVisible({ timeout: 5000 });
    await saveButton.click();
  }

  // добавить колеровку по индексу иконки
  async addColoringByIndex(index: number, code: string) {
    await this.coloringButtons().nth(index).click();

    const modal = this.page.locator(".ant-modal").last();
    const codeInput = modal.getByRole("textbox", { name: "Код", exact: true });

    await expect(modal).toBeVisible();
    await expect(codeInput).toBeVisible();
    await codeInput.click();
    await codeInput.fill(code);

    const option = modal
      .locator('[data-test="colors-item"]')
      .filter({ hasText: code });

    await expect(option).toBeVisible({ timeout: 5000 });
    await option.click();

    const saveButton = modal.getByRole("button", {
      name: "Сохранить",
      exact: true,
    });

    await expect(saveButton).toBeVisible({ timeout: 5000 });
    await expect(saveButton).toBeEnabled({ timeout: 5000 });
    await saveButton.click();

    await expect(this.page.locator(".ant-modal")).toBeHidden({ timeout: 5000 });
  }

  // редактирование колеровки
  async editColoringByIndex(index: number, code: string) {
    await this.coloringButtons().nth(index).click();

    const modal = this.page.locator(".ant-modal").last();
    const codeInput = modal.getByRole("textbox", { name: "Код", exact: true });

    await expect(modal).toBeVisible();
    await expect(codeInput).toBeVisible();
    await codeInput.fill("");
    await codeInput.fill(code);

    const option = modal
      .locator('[data-test="colors-item"]')
      .filter({ hasText: code });

    await expect(option).toBeVisible({ timeout: 5000 });
    await option.click();

    const saveButton = modal.getByRole("button", {
      name: "Сохранить",
      exact: true,
    });

    await expect(saveButton).toBeVisible({ timeout: 5000 });
    await expect(saveButton).toBeEnabled({ timeout: 5000 });
    await saveButton.click();
  }

  async expectColorCodeVisible(code: string) {
    await expect(this.page.getByText(code)).toBeVisible();
  }

  //
  async openSearchFromOrder() {
    await this.goInSearchButton().click();
  }

  async waitForSpinnerHidden() {
    await expect(this.spinner()).toHaveCount(0);
  }
}
