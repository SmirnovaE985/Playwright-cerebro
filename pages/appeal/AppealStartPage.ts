import { expect, Page } from "@playwright/test";

export class AppealStartPage {
  constructor(private readonly page: Page) {}

  // выбрать причину обращения
  private readonly selectAppealButton = () =>
    this.page.locator('[data-test="select-appeal"]');

  private readonly appealOptions = () =>
    this.page.locator('[data-test="select-appeal"] li');

  async openAppealSelector() {
    await this.selectAppealButton().click();
  }

  // ///////
  // МЕТОДЫ
  // ///////

  // новый заказ
  async chooseNewOrder() {
    await this.appealOptions().filter({ hasText: "Новый заказ" }).click();
  }

  async selectNewOrder() {
    await this.openAppealSelector();
    await this.chooseNewOrder();
  }

  // редактирование заказа
  async chooseEditOrder() {
    await this.appealOptions()
      .filter({ hasText: "Редактирование заказа" })
      .click();
  }

  // справка / перевод
  async chooseReferenceTransfer() {
    await this.appealOptions().filter({ hasText: "Справка / Перевод" }).click();
  }

  async selectReferenceTransfer() {
    await this.openAppealSelector();
    await this.chooseReferenceTransfer();
  }

  // консультация материалы / услуги
  async chooseConsultationMaterialsServices() {
    await this.appealOptions()
      .filter({ hasText: "Консультация Материалы / Услуги" })
      .click();
  }

  // Информация по заказу
  async chooseInformation() {
    await this.appealOptions()
      .filter({ hasText: "Информация по заказу" })
      .click();
  }

  // Ошибки / ОС
  async chooseErrorsOS() {
    await this.appealOptions().filter({ hasText: "Ошибки / ОС" }).click();

    await expect(this.page.getByText("Зарегистрировать ошибку")).toBeVisible();

    await expect(
      this.page.locator('[data-test="select-appeal"]', {
        hasText: "Ошибки / ОС",
      }),
    ).toBeVisible();
  }

  // претензия
  async chooseClaim() {
    await this.appealOptions().filter({ hasText: "Претензия" }).click();

    await expect(this.page.getByText("Отправить претензию")).toBeVisible();

    await expect(
      this.page.locator('[data-test="select-appeal"]', {
        hasText: "Претензия",
      }),
    ).toBeVisible();
  }

  // соискатели
  async chooseApplicants() {
    await this.appealOptions().filter({ hasText: "Соискатели" }).click();

    await expect(
      this.page.locator('[data-test="go-appeal-history"]'),
    ).toBeVisible();

    await this.page.locator('[data-test="go-appeal-history"]').click();

    await expect(
      this.page.locator('[data-test="select-appeal"]', {
        hasText: "Соискатели",
      }),
    ).toBeVisible();
  }

  // прокат
  async chooseRental() {
    await this.appealOptions().filter({ hasText: "Прокат" }).click();

    await expect(
      this.page.locator('[data-test="select-appeal"]', {
        hasText: "Прокат",
      }),
    ).toBeVisible();
  }

  // водители
  async chooseDriver() {
    await this.appealOptions().filter({ hasText: "Водители/ЛТС/ЦТС" }).click();

    await expect(
      this.page.locator('[data-test="select-appeal"]', {
        hasText: "Водители/ЛТС/ЦТС",
      }),
    ).toBeVisible();
  }

  // выбрать сбытовую
  async selectSaleOrg(saleOrgId: string) {
    await this.page.locator('[data-test="sale-orgs"]').click();

    const option = this.page.locator(
      `.ant-select-dropdown [data-test="${saleOrgId}"]`,
    );

    await option.waitFor({ state: "visible" });
    await option.scrollIntoViewIfNeeded();
    await option.click();
  }
}
