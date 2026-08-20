import { expect, Page } from "@playwright/test";

export class OrderGTR {
  constructor(private readonly page: Page) {}

  // Кнопка «Выбрать» первого поставщика
  private readonly selectSupplierButton = () =>
    this.page
      .getByRole("button", {
        name: "Выбрать",
        exact: true,
      })
      .first();

  // Кнопка перехода на следующий шаг
  private readonly nextStepButton = () =>
    this.page.getByRole("button", {
      name: "Следующий шаг",
      exact: true,
    });

  //  Добавить материалы от этого поставщика
  private readonly addMaterialButton = () =>
    this.page.getByText("Добавить материалы от этого поставщика");

  // выбрать первый товар от поставщика
  private readonly chooseButton = () =>
    this.page
      .getByText("Выбрать", {
        exact: true,
      })
      .first();

  // Первая доступная дата в календаре
  private readonly firstAvailableDate = () =>
    this.page.locator('td.ant-picker-cell:has([data-icon="check"])').first();

  // Вкладка «Доставка»
  private readonly deliveryTab = () =>
    this.page
      .getByRole("tab", {
        name: "Доставка",
        exact: true,
      })
      .last();

  // Поле ввода адреса доставки
  private readonly deliveryAddressInput = () =>
    this.page.locator('[data-test="delivery-address"]');

  // Видимый выпадающий список адресов
  private readonly addressDropdown = () =>
    this.page.locator(".ant-spin-container:visible");

  // Кнопка «Добавить транспорт»
  private readonly addTransportButton = () =>
    this.page.getByRole("button", {
      name: "Добавить транспорт",
      exact: true,
    });

  // Селект «Выберите способ доставки»
  private readonly deliveryMethodSelect = () =>
    this.page
      .locator(".ant-select")
      .filter({
        hasText: "Выберите способ доставки",
      })
      .first();

  // Открытый выпадающий список способов доставки
  private readonly deliveryMethodDropdown = () =>
    this.page.locator(".ant-select-dropdown:visible").last();

  // Вариант способа доставки
  private readonly deliveryMethodOption = (transport: string) =>
    this.deliveryMethodDropdown()
      .locator("div.ant-select-item-option")
      .filter({
        hasText: new RegExp(`^${escapeRegExp(transport)}$`),
      })
      .first();

  // Кнопка «Создать заказ»
  private readonly createOrderButton = () =>
    this.page.getByRole("button", {
      name: "Создать заказ",
      exact: true,
    });

  // Кнопка подтверждения создания заказа
  private readonly confirmButton = () =>
    this.page
      .getByRole("dialog", {
        name: "Уверен в отгрузке?",
      })
      .locator('[data-test="confirmYes"]');

  // Сообщение об успешном создании заказа
  private readonly orderCreatedMessage = () =>
    this.page.getByText("Заказ успешно создан", {
      exact: false,
    });

  // Выбрать первого доступного поставщика
  async selectChoose(): Promise<void> {
    await this.selectSupplierButton().click();
  }

  // Перейти на следующий шаг
  async goToNextStep(): Promise<void> {
    const button = this.nextStepButton();

    await expect(button).toBeVisible();
    await expect(button).toBeEnabled();

    await button.click();
  }

  // Добавить другие материалы этого поставщика
  async addMaterial(): Promise<void> {
    await this.addMaterialButton().click();
  }

  // Выбрать первый товар
  async chooseMaterial(): Promise<void> {
    await this.chooseButton().click();
  }

  // Выбрать первую доступную дату в календаре
  async selectDate(): Promise<void> {
    const availableDate = this.firstAvailableDate();

    await expect(availableDate).toBeVisible();
    await availableDate.click();
  }

  // Открыть вкладку «Доставка»
  async openDeliveryTab(): Promise<void> {
    await this.deliveryTab().click();
  }

  // Ввести адрес доставки
  async fillDeliveryAddress(address: string): Promise<void> {
    const addressInput = this.deliveryAddressInput();

    await expect(addressInput).toBeVisible();
    await expect(addressInput).toBeEditable();

    await addressInput.fill(address);
  }

  // Дождаться открытия выпадающего списка адресов
  async waitForAddressDropdown(): Promise<void> {
    await expect(this.addressDropdown()).toBeVisible();
  }

  // Выбрать адрес из выпадающего списка
  async selectAddress(addressOption: string): Promise<void> {
    const addressDropdown = this.addressDropdown();

    await expect(addressDropdown).toBeVisible();

    const addressItem = addressDropdown.getByText(addressOption, {
      exact: true,
    });

    await expect(addressItem).toBeVisible();
    await addressItem.click();
  }

  //   Нажать кнопку «Добавить транспорт»
  async addTransport(): Promise<void> {
    const button = this.addTransportButton();

    await expect(button).toBeVisible();
    await expect(button).toBeEnabled();
    await button.click();
  }

  // Открыть список способов доставки
  async openDeliveryMethodSelect(): Promise<void> {
    const deliverySelect = this.deliveryMethodSelect();

    await expect(deliverySelect).toBeVisible();
    await expect(deliverySelect).toBeEnabled();

    await deliverySelect.click();

    await expect(this.deliveryMethodDropdown()).toBeVisible();
  }

  // Выбрать способ доставки из списка
  async selectDeliveryMethod(transport: string): Promise<void> {
    const deliveryOption = this.deliveryMethodOption(transport);

    await expect(deliveryOption).toBeVisible();
    await deliveryOption.scrollIntoViewIfNeeded();
    await deliveryOption.click();
  }
  // Прокрутить страницу к кнопке «Создать заказ» и нажать ее
  async createOrder(): Promise<void> {
    const createOrderButton = this.createOrderButton();

    await expect(createOrderButton).toBeVisible();
    await createOrderButton.scrollIntoViewIfNeeded();
    await createOrderButton.click();
  }

  // Подтвердить создание заказа
  async confirmOrder(): Promise<void> {
    await this.confirmButton().click();
  }

  // Проверить, что заказ успешно создан
  async expectOrderCreated(): Promise<void> {
    await expect(this.orderCreatedMessage()).toBeVisible();
  }
}

// Экранировать специальные символы перед использованием строки в RegExp
function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
