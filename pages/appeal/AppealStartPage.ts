import { Page } from "@playwright/test";

export class AppealStartPage {
  constructor(private readonly page: Page) {}

  private readonly selectAppealButton = () =>
    this.page.locator('[data-test="select-appeal"]');

  private readonly appealOptions = () =>
    this.page.locator('[data-test="select-appeal"] li');

  async openAppealSelector() {
    await this.selectAppealButton().click();
  }

  async chooseNewOrder() {
    await this.appealOptions().filter({ hasText: "Новый заказ" }).click();
  }

  async selectNewOrder() {
    await this.openAppealSelector();
    await this.chooseNewOrder();
  }

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
