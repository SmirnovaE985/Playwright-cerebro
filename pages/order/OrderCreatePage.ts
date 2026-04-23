import { expect, Page } from "@playwright/test";

// ========
// локаторы
// ========
export class OrderCreatePage {
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

  // открыть карточку товара первую из поиска (корзина)
  private readonly firstShoppingCardButton = () =>
    this.page.locator('[data-test="shopping-card-button"]').first();

  // открыть карточку товара если поиск по коду
  private readonly shoppingCardButtons = () =>
    this.page.locator('[data-test="shopping-card-button"]');

  // открыть карточку товара первую из поиска (листинг)
  private readonly ShoppingCardButtonListing = () =>
    this.page.locator('[data-test="product-link"]').first();

  // добавить в корзину из карточки листинга
  private readonly addButtonFromListing = () =>
    this.page.locator('[data-test="add-position"]');

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

  // поле "Номер заказа" при причине обращениия "Редактирование"
  private readonly searchInputEditOrder = () =>
    this.page.locator('[data-test="search-input-number-order"]');

  // кликнуть найти
  private readonly addButtonSearch = () =>
    this.page.getByRole("button", { name: " Найти " });

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

  // количество позиций в корзине (именно как сущностей)
  private readonly cartPositions = () =>
    this.page.locator('[data-test="cart-position"]');

  // отмена позиции
  private readonly deletePositionButtons = () =>
    this.page.locator('[data-test="delete-position"]');

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

  // услуги внутри корзины

  // признак колеровки у товара
  private readonly coloringButtons = () =>
    this.page.locator('[data-icon="format-painter"]');

  // ?
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

  // переключить свитчер
  private readonly remainSwitch = () =>
    this.page.locator('[data-test="remain-switch"]');

  // ==================
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

  // кнопка удаления всех позиций
  private readonly deleteAllPositionsButton = () =>
    this.page.locator('[data-test="delete-all-position"]');

  /////////////////////////////////////
  // ПРОМО АКТИВНОСТИ В КОРЗИНЕ ЗАКАЗА
  /////////////////////////////////////
  // отменить списание баллов
  private readonly cancelPoints = () =>
    this.page.getByRole("button", { name: "Отменить" });

  /////////
  // БЕТОН
  /////////
  // адрес доставки
  private readonly deliveryAddressInput = () =>
    this.page.locator('[data-test="delivery-address"]');

  // первая подсказка адреса
  private readonly firstAddressSuggestion = (addressText: string) =>
    this.page.getByText(addressText).first();

  // поле выбора даты доставки
  private readonly deliveryDateInput = () =>
    this.page.locator('input[placeholder*="Выберите дату"]');

  // выбрать конкретную дату в календаре
  private readonly deliveryDateCell = (date: string) =>
    this.page.locator(`td[title="${date}"]`);

  // комментарий для машины
  private readonly commentCarInput = () =>
    this.page.locator('[data-test="comment-car"]');

  // кнопка "Добавить" в модалке/форме машины
  private readonly addConcreteCarSubmitButton = () =>
    this.page.locator(".ant-btn-primary", { hasText: "Добавить" });

  // кнопка "Сохранить" в модалке/форме машины
  private readonly saveConcreteCarSubmitButton = () =>
    this.page.locator(".ant-btn-primary", { hasText: "Сохранить" });

  // ======
  // МЕТОДЫ
  // ======

  // ГЛАВНЫЙ ЛИСТИНГ
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

  // скрыть нулевые остатки
  async toggleRemainSwitch() {
    await this.remainSwitch().click();
  }

  // поиск товара (добавить намбер)
  async searchProduct(productName: string) {
    await this.searchInput().click();
    await this.searchInput().fill(productName);
    await this.searchButton().click();
  }

  // ОТКРЫТЬ КАРТОЧКУ (НАЖАВ НА КОРЗИНУ У ТОВАРА)

  // открыть карточку первого товара (корзина)
  async openFirstProductCard() {
    await this.firstShoppingCardButton().click();
  }

  // открыть вторую и последующие карточки (корзина)
  async openProductCardByIndex(index: number) {
    await this.shoppingCardButtons().nth(index).click();
  }

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
  async expectOrderSavedSuccess() {
    await expect(this.page.getByText("Успешно сохранено")).toBeVisible();
  }

  // отменить позицию (по индексу: await orderCreatePage.deleteCartPosition(0);)
  async deleteCartPosition(index: number) {
    await this.deletePositionButtons().nth(index).click();
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

  // ==================
  // ОТПРАВКА SMS
  // ==================

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

  /////////
  // БЕТОН
  /////////
  // заполнить количество в карточке быстрого добавления
  async fillQuickAddQuantity(value: string) {
    // await this.quantityInputs().first().click();
    await this.quantityInputs().clear();
    await this.quantityInputs().first().click();
    await this.quantityInputs().first().fill(value);
  }

  // заполнить адрес доставки и выбрать первую подсказку
  async fillDeliveryAddress(address: string) {
    await this.deliveryAddressInput().fill(address);
    await this.firstAddressSuggestion(address).click();
  }

  // выбрать дату доставки: +1 день от текущей даты
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

  // заполнить комментарий для машины
  async fillCarComment(comment: string) {
    await this.commentCarInput().fill(comment);
  }

  // проверить комментарий для машины
  async expectCarCommentToHaveValue(comment: string) {
    await expect(this.commentCarInput()).toHaveValue(comment);
  }

  // подтвердить добавление машины
  async submitAddedCar() {
    await this.addConcreteCarSubmitButton().click();
  }

  // подтвердить добавление машины
  async submitSavedCar() {
    await this.saveConcreteCarSubmitButton().click();
  }
}
