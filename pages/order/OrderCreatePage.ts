import { expect, Page } from "@playwright/test";

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

  // // выбираем магазин (один или несколько)

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

  // скрыть нулевые остатки
  async toggleRemainSwitch() {
    await this.remainSwitch().click();
  }

  // поиск товара (добавить намбер)
  async searchProduct(productName: string) {
    await this.searchInput().click();
    await this.searchInput().fill(productName);
    await this.searchButton().click();
    await this.remainSwitch().click();
  }
}

export class OrderCreatePage {
  constructor(private readonly page: Page) {}

  // открыть карточку товара первую из поиска (корзина)
  private readonly firstShoppingCardButton = () =>
    this.page.locator('[data-test="shopping-card-button"]').first();

  // открыть карточку товара если поиск по конкретному коду
  private readonly shoppingCardButtons = () =>
    this.page.locator('[data-test="shopping-card-button"]');

  // открыть карточку товара первую из поиска (листинг)
  private readonly ShoppingCardButtonListing = () =>
    this.page.locator('[data-test="product-link"]').first();

  // добавить в корзину из карточки листинга
  private readonly addButtonFromListing = () =>
    this.page.locator('[data-test="add-position"]');

  // действия с карточками товара

  // оформить ЗАЗУ в карточке товара
  private readonly createZazaButton = () =>
    this.page.locator('a[data-test="ZAZA"]');

  // количество в карточке товара (поиск)
  private readonly quantityInputs = () =>
    this.page.locator('[data-test="add-quantity-input"]');

  // изменить ЕИ в модалке товара (поиск)
  private readonly editUnitsButton = () =>
    this.page.locator('[data-test="modal-edit-units"]');

  // добавить товар в корзину
  private readonly addButton = () =>
    this.page.getByRole("button", { name: "Добавить" });

  // перейти в корзину
  private readonly toCartButton = () =>
    this.page.locator('[data-test="to-cart-button"]');

  // ===============
  // КОРЗИНА ЗАКАЗА
  // ===============

  // создать предложение
  private readonly makeOfferButton = () =>
    this.page.locator('[data-test="make-offer"]');

  // создать заказ
  private readonly makeOrderButton = () =>
    this.page.locator('[data-test="make-order"]');

  // сохранить заказ
  private readonly saveOrderButton = () =>
    this.page.locator('[data-test="save-order"]');

  // подтвердить уверенность в отгрузке
  private readonly confirmButton = () =>
    this.page
      .locator(".ant-modal-content", {
        hasText: "Выбери один из вариантов перед сохранением",
      })
      .getByRole("button", { name: "Да", exact: true });

  // количество позиций в корзине (именно как сущностей)
  private readonly cartPositions = () =>
    this.page.locator('[data-test="cart-position"]');

  // закрыть заказ
  private readonly closeOrderButton = () =>
    this.page.locator('[data-test="close-order-btn"]');
  private readonly confirmOkButton = () =>
    this.page.getByRole("button", { name: " OK " });

  // закрыть первую нотификашку
  private readonly notificationCloseButton = () =>
    this.page.locator(".ant-notification-notice-close").first();

  // закрыть вторую нотификашку
  private readonly notificationCloseButton2 = () =>
    this.page.locator(".ant-notification-notice-close").last();

  // скопировать номер заказа
  private readonly copyButton = () => this.page.locator('[data-icon="copy"]');

  // перейти в поиск из корзины
  private readonly goInSearchButton = () =>
    this.page.locator('[data-test="btn-go-in-search"]');

  // отправить смс из корзины заказа
  private readonly sendSmsFromCart = () =>
    this.page.locator('[data-test="send-sms"]');

  // услуги внутри корзины

  // признак колеровки у товара
  private readonly coloringButtons = () =>
    this.page.locator('[data-icon="format-painter"]');

  //
  private readonly spinner = () => this.page.locator(".ant-spin-spinning");

  // цена в модалке карточки товара
  private readonly modalPositionCost = () =>
    this.page.locator('[data-test="modal-position-cost"]');

  // общая сумма за заказ в корзине
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

  // вернуть цену ИМКЦ
  private readonly IMKSprice = () =>
    this.page.locator('[data-test="price-imkc-edit-modal"]');

  // сохранить изменения в модалке редактирования товара
  private readonly saveEditPositionButton = () =>
    this.page.locator('[data-test="save-btn-in-modal-edit-position"]');

  private readonly coloringButton = () =>
    this.page.locator('[data-test="coloring"]');

  // кнопка удаления всех позиций
  private readonly deleteAllPositionsButton = () =>
    this.page.locator('[data-test="delete-all-position"]');

  /////////////////////////////////////
  // ПРОМО АКТИВНОСТИ В КОРЗИНЕ ЗАКАЗА
  /////////////////////////////////////
  // отменить списание баллов
  private readonly cancelPoints = () =>
    this.page.getByRole("button", { name: "Отменить" });

  // /////////
  // // БЕТОН
  // /////////
  // // адрес доставки
  // private readonly deliveryAddressInput = () =>
  //   this.page.locator('[data-test="delivery-address"]');

  // // первая подсказка адреса
  // private readonly firstAddressSuggestion = (addressText: string) =>
  //   this.page.getByText(addressText).first();

  // // поле выбора даты доставки
  // private readonly deliveryDateInput = () =>
  //   this.page.locator('input[placeholder*="Выберите дату"]');

  // // выбрать конкретную дату в календаре
  // private readonly deliveryDateCell = (date: string) =>
  //   this.page.locator(`td[title="${date}"]`);

  // // комментарий для машины
  // private readonly commentCarInput = () =>
  //   this.page.locator('[data-test="comment-car"]');

  // // кнопка "Добавить" в модалке/форме машины
  // private readonly addConcreteCarSubmitButton = () =>
  //   this.page.locator(".ant-btn-primary", { hasText: "Добавить" });

  // // кнопка "Сохранить" в модалке/форме машины
  // private readonly saveConcreteCarSubmitButton = () =>
  //   this.page.locator(".ant-btn-primary", { hasText: "Сохранить" });

  // ======
  // МЕТОДЫ
  // ======

  // ОТКРЫТЬ КАРТОЧКУ (НАЖАВ НА КОРЗИНУ У ТОВАРА)

  // открыть карточку первого товара (корзина)
  async openFirstProductCard() {
    await this.firstShoppingCardButton().click();
  }

  // открыть вторую и последующие карточки (корзина)
  async openProductCardByIndex(index: number) {
    await this.shoppingCardButtons().nth(index).click();
  }

  // действия в карточке товара

  // добавить количество товара к магазинам внутри карточки товара (корзина)
  async fillQuantityForAllInputs(value: string) {
    await expect(this.quantityInputs().first()).toBeVisible();

    const count = await this.quantityInputs().count();

    for (let i = 0; i < count; i++) {
      await this.quantityInputs().nth(i).fill(value);
    }
  }

  // добавить в корзину из карточки (корзина)
  async addButtonInCart() {
    await this.addButton().click();
  }
  //  перейти в корзину (листинг и корзина)
  async goToCart() {
    await this.toCartButton().click();
  }

  // ОТКРЫТЬ КАРТОЧКУ ТОВАРА ИЗ ЛИСТИНГА (НАЖАВ НА НАЗВАНИЕ ТОВАРА)

  // открыть первую карточку товара из листинга
  async openFirstProductCardFromListing() {
    await this.ShoppingCardButtonListing().waitFor({ state: "visible" });
    await this.ShoppingCardButtonListing().click();
  }

  // добавить зазу (листинг)
  async addZaza() {
    await this.createZazaButton().waitFor({ state: "visible" });
    await this.createZazaButton().click();
  }

  //добавить товар в корзину из карточки товара (листинг)
  async addToCartFromListing() {
    await this.addButtonFromListing().click();
  }

  // ==============
  // КОРЗИНА ЗАКАЗА
  // ==============

  // создать предложение
  async makeOffer() {
    await this.makeOfferButton().click();
    await this.confirmButton().click();
    await expect(
      this.page.getByText("Предложение успешно создано"),
    ).toBeVisible();
  }

  // создать заказ
  async makeOrder() {
    await this.makeOrderButton().click();
    await this.confirmButton().click();
  }

  // сохранить заказ
  async saveOrder() {
    await this.saveOrderButton().click();
  }

  // проверка "Успешно сохранено"
  async expectOrderSavedSuccess() {
    await expect(this.page.getByText("Успешно сохранено")).toBeVisible();
  }

  // закрыть заказ
  async closeOrder() {
    await this.closeOrderButton().waitFor({ state: "visible" });
    await this.closeOrderButton().scrollIntoViewIfNeeded();
    await this.closeOrderButton().click();

    await this.confirmOkButton().waitFor({ state: "visible" });
    await this.confirmOkButton().click();
  }

  //скопировать и запомнить номер заказа и сохранить его в буфер
  async getCopiedOrderNumber(): Promise<string> {
    await this.page
      .context()
      .grantPermissions(["clipboard-read", "clipboard-write"]);

    await this.copyButton().click();

    return (
      await this.page.evaluate(() => navigator.clipboard.readText())
    ).trim();
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

  // открыть поиск из корзины заказа
  async openSearchFromOrder() {
    await this.goInSearchButton().click();
  }
  // дождаться загрузки
  async waitForSpinnerHidden() {
    await expect(this.spinner()).toHaveCount(0);
  }

  /////////////////////////////
  // ПРОМО АКТИВНОСТИ В КОРЗИНЕ
  /////////////////////////////

  // отменить списанные баллы ПЛ
  async cancelPL() {
    await this.cancelPoints().click();
    await expect(
      this.page.getByText("Применение баллов отменено"),
    ).toBeVisible();
  }

  // проверка, что кнопка удаления всех позиций видима
  async expectDeleteAllPositionsVisible() {
    await expect(this.deleteAllPositionsButton()).toBeVisible();
  }

  // =============================================
  //  МОДАЛКА РЕДАКТИРОВАНИЯ ТОВАРА ВНУТРИ КОРЗИНЫ
  // =============================================

  // открыть модалку редактирования товара внутри корзины
  async openCartPosition(index: number) {
    await this.cartPosition().nth(index).click();
  }

  // вернуть цену ИМКЦ

  async saveIMKS() {
    await this.IMKSprice().click();
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
  // закрыть первую нотификашки в корзине
  async closeNotification() {
    await this.notificationCloseButton()
      .click()
      .catch(() => {});
  }

  // закрыть вторую нотификашки в корзине
  async closeNotification2() {
    await this.notificationCloseButton2()
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
      .filter({ hasText: code })
      .first();
    // await expect(option).toBeVisible({ timeout: 3000 });
    await option.click();

    const saveButton = modal.getByRole("button", {
      name: "Сохранить",
      exact: true,
    });

    await expect(saveButton).toBeVisible();
    await saveButton.click();
  }

  async expectColorCodeVisible(code: string) {
    await expect(this.page.getByText(code)).toBeVisible();
  }
}
