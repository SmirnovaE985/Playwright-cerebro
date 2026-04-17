// #5352 Создание обращения клиента с сегментом Мастер
// #3232 Создание обращения с причиной "Новый заказ"
// #3242 Создание обращения с причиной "Редактирование заказа"
// #6735 Создание обращения с причиной "Справка"
// #3243 Создание обращения с причиной "Ошибки / ОС"
// #3244 Создание обращения с причиной "Консультация Материалы / Услуги
// #3245 Создание обращения с причиной "Информация по заказу"
// #3246 Создание обращения с причиной "Претензия"
// #3247 Создание обращения с причиной "Соискатели"
// #3248 Создание обращения с причиной "Прокат"
// #3249 Создание обращения с причиной "Водители/ЛТС/ЦТС"
// #5264 Создание нового клиента, который уже обращался на линию с сегментом мастер"
// #4344 Переход из одной причины обращения в другую
// #6750 Редактирование ранее созданного заказа, через историю
// #5636 Создание обращение клиента, который не зарегистрирован в ПЛ, но обращался на линию
// #4576 Создание обращения - валидация (телефон)

import { label, feature } from "allure-js-commons";
import {
  createAppeal,
  deleteAllPositions,
  createOrder,
  fillLoginForm,
} from "../helpers/commands";
import { AppealStartPage } from "../pages/appeal/AppealStartPage";
import { OrderCreatePage } from "../pages/order/OrderCreatePage";
import { test, expect } from "@playwright/test";

// https://allure.itlabs.io/project/28/test-cases/5352?treeId=58
test(
  '5352 Процесс создания обращения клиента, с сегментом "Мастер"',
  { tag: ["@regress"] },
  async ({ page }) => {
    label("tag", "regress");
    feature("Auth");
    const { page: page1 } = await createAppeal(page, {
      contactType: "Телефон",
      contactValue: "9000000022",
    });

    await expect(page1.getByText("Мастер")).toHaveCount(2);
  },
);

// https://allure.itlabs.io/project/28/test-cases/3232?treeId=58
test(
  "#3232 Создание обращения клиента с причиной Новый заказ",
  { tag: ["@regress"] },
  async ({ page }) => {
    label("tag", "regress");
    feature("Auth");
    const { page: page1 } = await createAppeal(page);

    const appealStartPage = new AppealStartPage(page1);
    const orderCreatePage = new OrderCreatePage(page1);

    await appealStartPage.openAppealSelector();
    await appealStartPage.chooseNewOrder();
  },
);

// https://allure.itlabs.io/project/28/test-cases/3242?treeId=58
test(
  "#6735 Создание обращения с причиной Редактирование заказа",
  { tag: ["@regress"] },
  async ({ page }) => {
    label("tag", "regress");
    feature("Auth");
    const { page: page1 } = await createAppeal(page);

    const appealStartPage = new AppealStartPage(page1);

    await appealStartPage.openAppealSelector();
    await appealStartPage.chooseEditOrder();
  },
);

// https://allure.itlabs.io/project/28/test-cases/6735?treeId=58
test(
  '#3242 Создание обращения с причиной "Справка\перевод"',
  { tag: ["@regress"] },
  async ({ page }) => {
    label("tag", "regress");
    feature("Auth");
    const { page: page1 } = await createAppeal(page);

    const appealStartPage = new AppealStartPage(page1);
    await appealStartPage.openAppealSelector();
    await appealStartPage.chooseReferenceTransfer();
  },
);

// https://allure.itlabs.io/project/28/test-cases/3244?treeId=58
test(
  '#3244 Создание обращения с причиной "Консультация Материалы / Услуги',
  { tag: ["@regress"] },
  async ({ page }) => {
    label("tag", "regress");
    feature("Auth");

    const { page: page1 } = await createAppeal(page);
    const appealStartPage = new AppealStartPage(page1);

    await appealStartPage.openAppealSelector();
    await appealStartPage.chooseConsultationMaterialsServices();

    await expect(
      page1.locator('[data-test="select-appeal"]', {
        hasText: "Консультация Материалы / Услуги",
      }),
    ).toBeVisible();
  },
);

// https://allure.itlabs.io/project/28/test-cases/3245?treeId=58
test(
  '#3245 Создание обращения с причиной "Информация по заказу"',
  { tag: ["@regress"] },
  async ({ page }) => {
    label("tag", "regress");
    feature("Auth");

    const { page: page1 } = await createAppeal(page);
    const appealStartPage = new AppealStartPage(page1);

    await appealStartPage.openAppealSelector();
    await appealStartPage.chooseInformation();

    await expect(
      page1.locator('[data-test="search-input-number-order"]'),
    ).toBeVisible();
  },
);

// https://allure.itlabs.io/project/28/test-cases/3243?treeId=58
test(
  '#3243 Создание обращения с причиной "Ошибки / ОС"',
  { tag: ["@regress"] },
  async ({ page }) => {
    label("tag", "regress");
    feature("Auth");

    const { page: page1 } = await createAppeal(page);
    const appealStartPage = new AppealStartPage(page1);

    await appealStartPage.openAppealSelector();
    await appealStartPage.chooseErrorsOS();
  },
);

// https://allure.itlabs.io/project/28/test-cases/3243?treeId=58
test(
  '#3246 Создание обращения с причиной "Претензия"',
  { tag: ["@regress"] },
  async ({ page }) => {
    label("tag", "regress");
    feature("Auth");
    const { page: page1 } = await createAppeal(page);
    const appealStartPage = new AppealStartPage(page1);

    await appealStartPage.openAppealSelector();
    await appealStartPage.chooseClaim();
  },
);

// https://allure.itlabs.io/project/28/test-cases/3247?treeId=58
test(
  '#3247 Создание обращения с причиной "Соискатели"',
  { tag: ["@regress"] },
  async ({ page }) => {
    label("tag", "regress");
    feature("Auth");
    const { page: page1 } = await createAppeal(page);
    const appealStartPage = new AppealStartPage(page1);

    await appealStartPage.openAppealSelector();
    await appealStartPage.chooseApplicants();
  },
);

//https://allure.itlabs.io/project/28/test-cases/3248?treeId=58
test(
  '#3248 Создание обращения с причиной "Прокат"',
  { tag: ["@regress"] },
  async ({ page }) => {
    label("tag", "regress");
    feature("Auth");
    const { page: page1 } = await createAppeal(page);
    const appealStartPage = new AppealStartPage(page1);

    await appealStartPage.openAppealSelector();
    await appealStartPage.chooseRental();
  },
);

// https://allure.itlabs.io/project/28/test-cases/3249?treeId=58
test(
  '#3249 Создание обращения с причиной "Водители/ЛТС/ЦТС"',
  { tag: ["@regress"] },
  async ({ page }) => {
    label("tag", "regress");
    feature("Auth");
    const { page: page1 } = await createAppeal(page);
    const appealStartPage = new AppealStartPage(page1);

    await appealStartPage.openAppealSelector();
    await appealStartPage.chooseDriver();
  },
);

//https://allure.itlabs.io/project/28/test-cases/5264?treeId=58
test(
  '#5264 Создание нового клиента, который уже обращался на линию с сегментом мастер"',
  { tag: ["@regress"] },
  async ({ page }) => {
    label("tag", "regress");
    feature("Auth");
    const { page: page1 } = await createAppeal(page);
    await page1.locator('[data-test="select-appeal"]').click();
    await page1;
    const statuses = page1.locator('[data-test="client-promo-status"]');
    await expect(statuses).toHaveCount(2);
    await expect(statuses).toContainText(["Эксперт", "Эксперт"]);
  },
);

// https://allure.itlabs.io/project/28/test-cases/4344?treeId=58
test(
  "#4344 Переход из одной причины обращения в другую",
  { tag: ["@regress"] },
  async ({ page }) => {
    label("tag", "regress");
    feature("Auth");

    const { page: page1, phoneNumber } = await createOrder(page, {
      makeOrder: true,
      searchText: "цемент",
      quantity: 2,
    });
    const appealStartPage = new AppealStartPage(page1);
    const orderCreatePage = new OrderCreatePage(page1);
    await orderCreatePage.closeNotification();
    await orderCreatePage.closeNotification2();

    await page1.waitForSelector('[data-test="select-appeal"]', {
      state: "attached",
    });
    await appealStartPage.openAppealSelector();
    await appealStartPage.chooseEditOrder();
    await orderCreatePage.closeOrder();

    await expect(
      page1.locator('[data-test="search-input-number-order"]'),
    ).toBeVisible();
  },
);

// https://allure.itlabs.io/project/28/test-cases/6750?treeId=58
test(
  "#6750 Редактирование ранее созданного заказа, через историю",
  { tag: ["@regress"] },
  async ({ page }) => {
    label("tag", "regress");
    feature("Auth");
    const { page: page1 } = await createAppeal(page);
    const appealStartPage = new AppealStartPage(page1);
    await page1.locator('[data-icon="form"]').first().click();
    await page1.locator('[data-test="select-appeal"]').click();
    await appealStartPage.chooseEditOrder();

    await expect(page1.locator('[data-test="save-order"]')).toBeVisible();
    await expect(
      page1.locator('[data-test="select-appeal"]', {
        hasText: "Редактирование",
      }),
    ).toBeVisible();
  },
);

//https://allure.itlabs.io/project/28/test-cases/5636?treeId=58
test(
  "#5636 Создание обращение клиента, который не зарегистрирован в ПЛ, но обращался на линию",
  { tag: ["@regress"] },
  async ({ page }) => {
    label("tag", "regress");
    feature("Auth");
    await fillLoginForm(page);
    const clients = page.getByText("Клиенты", { exact: true }).first();
    await expect(clients).toBeVisible({ timeout: 30_000 });
    await clients.hover();

    const newAppeal = page.getByRole("link", { name: "Новое обращение" });
    await expect(newAppeal).toBeVisible({ timeout: 30_000 });
    await newAppeal.click();
    const phoneInput = page.locator('input[name="phone"]');
    const submitBtn = page.locator('button[type="submit"]');
    await phoneInput.fill("9199570789");
    const popupOrNull = await Promise.all([
      page.waitForEvent("popup").catch(() => null),
      submitBtn.click(),
    ]).then(([popup]) => popup);

    const page1 = popupOrNull ?? page;
    await page1.locator('[data-test="select-appeal"]').click();
    await page1
      .locator('[data-test="select-appeal"] li')
      .filter({ hasText: "Новый заказ" })
      .click();

    await page1.waitForLoadState("domcontentloaded");
    await page1.waitForLoadState("networkidle");

    const regBtn = page1.locator("button.ant-btn", {
      hasText: "Регистрация в ПЛ",
    });

    await expect(regBtn).toBeVisible({ timeout: 10000 });
    await expect(regBtn).toBeEnabled();
    await regBtn.scrollIntoViewIfNeeded();
    await regBtn.click();
    await expect(
      page1.getByText("Регистрация клиента в программе лояльности"),
    ).toBeVisible();
  },
);

// https://allure.itlabs.io/project/28/test-cases/4576?treeId=58
test(
  "#4576 Создание обращения - валидация (email)",
  { tag: ["@regress"] },
  async ({ page }) => {
    label("tag", "regress");
    feature("Auth");
    await fillLoginForm(page);

    const clients = page.getByText("Клиенты", { exact: true }).first();
    await expect(clients).toBeVisible({ timeout: 30_000 });
    await clients.hover();

    const newAppeal = page.getByRole("link", { name: "Новое обращение" });
    await expect(newAppeal).toBeVisible({ timeout: 30_000 });
    await newAppeal.click();

    const messengerInput = page.locator('input[name="email"]');
    const submitBtn = page.locator('button[type="submit"]');

    // 1. Пустое поле
    await page.getByText("E-mail").click();
    await submitBtn.click();
    await expect(page.getByText("Это обязательное поле")).toBeVisible();

    // 2. Невалидное значение
    await messengerInput.fill("grusha@@mail.ru");
    await submitBtn.click();
    await expect(page.getByText("Укажите корректный email")).toBeVisible();
    // 2.1
    await messengerInput.fill(
      "Esmirnova72.co@yandex.ruuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu",
    );
    await submitBtn.click();
    await expect(page.getByText("Укажите корректный email")).toBeVisible();

    // 3. Валидное значение
    await messengerInput.fill("Esmirnova72.co@yandex.ru");

    const popupOrNull = await Promise.all([
      page.waitForEvent("popup").catch(() => null),
      submitBtn.click(),
    ]).then(([popup]) => popup);

    const targetPage = popupOrNull ?? page;

    await expect(targetPage).toHaveURL(/\/selectClient/);
    await expect(targetPage.getByText("Создание клиента")).toBeVisible();
  },
);

// https://allure.itlabs.io/project/28/test-cases/4576?treeId=58
test(
  "#4576 Создание обращения - валидация (Мессенджер)",
  { tag: ["@regress"] },
  async ({ page }) => {
    label("tag", "regress");
    feature("Auth");
    await fillLoginForm(page);

    const clients = page.getByText("Клиенты", { exact: true }).first();
    await expect(clients).toBeVisible({ timeout: 30_000 });
    await clients.hover();

    const newAppeal = page.getByRole("link", { name: "Новое обращение" });
    await expect(newAppeal).toBeVisible({ timeout: 30_000 });
    await newAppeal.click();

    const messengerInput = page.locator('input[name="messanger"]');
    const submitBtn = page.locator('button[type="submit"]');

    // 1. Пустое поле
    await page.getByText("Мессенджер").click();
    await submitBtn.click();
    await expect(
      page.getByText("Укажите корректный номер телефона"),
    ).toBeVisible();

    // 2. Невалидный номер
    await messengerInput.fill("919959");
    await submitBtn.click();
    await expect(
      page.getByText("Укажите корректный номер телефона"),
    ).toBeVisible();

    // 3. Валидный номер
    await messengerInput.fill("9199570789");

    const popupOrNull = await Promise.all([
      page.waitForEvent("popup").catch(() => null),
      submitBtn.click(),
    ]).then(([popup]) => popup);

    const targetPage = popupOrNull ?? page;

    await expect(targetPage).toHaveURL(/\/selectClient/);
    await expect(targetPage.getByText("Создание клиента")).toBeVisible();
  },
);

// https://allure.itlabs.io/project/28/test-cases/4576?treeId=58
test(
  "#4576 Создание обращения - валидация (Телефон)",
  { tag: ["@regress"] },
  async ({ page }) => {
    label("tag", "regress");
    feature("Auth");
    await fillLoginForm(page);
    const clients = page.getByText("Клиенты", { exact: true }).first();
    // Проверяем, что он видим, открыть меню по hover
    await expect(clients).toBeVisible({ timeout: 30_000 });
    await clients.hover();
    const newAppeal = page.getByRole("link", { name: "Новое обращение" });
    // Ждём пока элемент будет доступен
    await expect(newAppeal).toBeVisible({ timeout: 30_000 });
    await newAppeal.click();
    //
    const phoneInput = page.locator('input[name="phone"]');
    const submitBtn = page.locator('button[type="submit"]');
    // 1) Пустое поле -> "Укажите корректный номер телефона"
    await page.getByText("Телефон").click();
    await submitBtn.click();
    await expect(
      page.getByText("Укажите корректный номер телефона"),
    ).toBeVisible();
    // 2) Некорректный номер -та же ошибка
    await phoneInput.fill("919959");
    await submitBtn.click();
    await expect(
      page.getByText("Укажите корректный номер телефона"),
    ).toBeVisible();
    // 3) Валидный номер
    await phoneInput.fill("9199570789");
    const popupOrNull = await Promise.all([
      page.waitForEvent("popup").catch(() => null),
      submitBtn.click(),
    ]).then(([popup]) => popup);
    const targetPage = popupOrNull ?? page;
    await expect(targetPage).toHaveURL(/\/selectClient/);
    await expect(targetPage.getByText("Создание клиента")).toBeVisible();
  },
);
