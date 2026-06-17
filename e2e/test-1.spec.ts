import { test, expect } from "@playwright/test";

test("test", async ({ page }) => {
  // Recording...
  await page3.getByRole("button", { name: "Сервисы down" }).click();
  await page3.getByText("Услуги", { exact: true }).click();
  await page3
    .getByRole("combobox", { name: "Тип услуги* Выберите услугу" })
    .click();
  await page3.getByText("Установка бордюров").nth(1).click();
  await page3.getByRole("button", { name: "OK" }).click();
});
