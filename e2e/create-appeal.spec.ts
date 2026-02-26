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
// #4576 Создание обращения - валидация (телефон)///


import { test, expect } from '@playwright/test';
import { createAppeal } from '../helpers/commands';
import { text } from 'stream/consumers';
import { label, feature } from 'allure-js-commons';


// https://allure.itlabs.io/project/28/test-cases/3242?treeId=58
test('#6735 Создание обращения с причиной "Редактирование заказа"',  
   { tag: ['@regress'] }, 
   async ({ page }) => {
label('tag', 'regress');   
feature('Auth');
  const page1 = await createAppeal(page);
await page1.locator('[data-test="select-appeal"]').click();
  await page1
  .locator('[data-test="select-appeal"] li')
  .filter({ hasText: 'Редактирование заказа' })
  .click();
  await expect(page1.locator('[data-test="search-input-number-order"]')).toBeVisible();
});

// https://allure.itlabs.io/project/28/test-cases/6735?treeId=58
test('#3242 Создание обращения с причиной "Справка"',
    { tag: ['@regress'] },
    async ({ page }) => {
   label('tag', 'regress');   
   feature('Auth');
  const page1 = await createAppeal(page);
await page1.locator('[data-test="select-appeal"]').click();
  await page1
  .locator('[data-test="select-appeal"] li')
  .filter({ hasText: 'Справка' })
  .click();
//  await expect(page.locator('input[placeholder*="Поиск"]')).toBeVisible({ timeout: 5000});
});

 // https://allure.itlabs.io/project/28/test-cases/3244?treeId=58
test('#3244 Создание обращения с причиной "Консультация Материалы / Услуги',
    { tag: ['@regress'] },
    async ({ page }) => {
    label('tag', 'regress');   
   feature('Auth');
  const page1 = await createAppeal(page);
await page1.locator('[data-test="select-appeal"]').click();
  await page1
  .locator('[data-test="select-appeal"] li')
  .filter({ hasText: 'Консультация Материалы / Услуги' })
  .click();
  await expect(page1.locator('[data-test="search-input"]')).toBeVisible();
});

 // https://allure.itlabs.io/project/28/test-cases/3245?treeId=58
test('#3245 Создание обращения с причиной "Информация по заказу"',
   { tag: ['@regress'] },
  async ({ page }) => {
  label('tag', 'regress');   
   feature('Auth');
  const page1 = await createAppeal(page);
await page1.locator('[data-test="select-appeal"]').click();
  await page1
  .locator('[data-test="select-appeal"] li')
  .filter({ hasText: 'Информация по заказу' })
  .click();
await expect(page1.locator('[data-test="search-input-number-order"]')).toBeVisible();
});

 // https://allure.itlabs.io/project/28/test-cases/3243?treeId=58
test('#3243 Создание обращения с причиной "Ошибки / ОС"', 
   { tag: ['@regress'] },
  async ({ page }) => {
    label('tag', 'regress');   
   feature('Auth');
  const page1 = await createAppeal(page);
await page1.locator('[data-test="select-appeal"]').click();
  await page1
  .locator('[data-test="select-appeal"] li')
  .filter({ hasText: 'Регистрация ошибки/ос' })
  .click();
  await expect(page1.getByText('Зарегистрировать ошибку')).toBeVisible();
});

// https://allure.itlabs.io/project/28/test-cases/3243?treeId=58 ПРОВЕРИТЬ 
test('#3246 Создание обращения с причиной "Претензия"',
   { tag: ['@regress'] },
  async ({ page }) => {
    label('tag', 'regress');   
   feature('Auth');
const page1 = await createAppeal(page);
await page1.locator('[data-test="select-appeal"]').click();
  await page1
  .locator('[data-test="select-appeal"] li')
  .filter({ hasText: 'Претензия' })
  .click();
 await expect(page1.getByText('Отправить претензию')).toBeVisible();
});

// https://allure.itlabs.io/project/28/test-cases/3247?treeId=58 
test('#3247 Создание обращения с причиной "Соискатели"',
   { tag: ['@regress'] },
    async ({ page }) => {
    label('tag', 'regress');   
   feature('Auth');
  const page1 = await createAppeal(page);
  await page1.locator('[data-test="select-appeal"]').click();
  await page1.locator('[data-test="select-appeal"] li')
    .filter({ hasText: 'Соискатели' })
    .click();
await expect(page1.locator('[data-test="go-appeal-history"]')).toBeVisible();   
await page1.locator('[data-test="go-appeal-history"]').click();
});

 //https://allure.itlabs.io/project/28/test-cases/3248?treeId=58
test('#3248 Создание обращения с причиной "Прокат"', 
   { tag: ['@regress'] },
  async ({ page }) => {
  label('tag', 'regress');   
   feature('Auth');
  const page1 = await createAppeal(page);
await page1.locator('[data-test="select-appeal"]').click();
  await page1
  .locator('[data-test="select-appeal"] li')
  .filter({ hasText: 'Прокат' })
  .click();
});

// https://allure.itlabs.io/project/28/test-cases/3249?treeId=58
test('#3249 Создание обращения с причиной "Водители/ЛТС/ЦТС"', 
   { tag: ['@regress'] },
  async ({ page }) => {
    label('tag', 'regress');   
   feature('Auth');
  const page1 = await createAppeal(page);
await page1.locator('[data-test="select-appeal"]').click();
  await page1
  .locator('[data-test="select-appeal"] li')
  .filter({ hasText: 'Водители/ЛТС/ЦТС' })
  .click();
  await expect(page1.getByText('Предложение переведено в заказ успешно!')).toBeVisible();
});


//https://allure.itlabs.io/project/28/test-cases/5264?treeId=58
test('#5264 Создание нового клиента, который уже обращался на линию с сегментом мастер"',
   { tag: ['@regress'] },
    async ({ page }) => {
label('tag', 'regress');   
feature('Auth');
const page1 = await createAppeal(page);
await page1.locator('[data-test="select-appeal"]').click();
await page1
const statuses = page1.locator('[data-test="client-promo-status"]');
await expect(statuses).toHaveCount(2);
await expect(statuses).toContainText(['Эксперт', 'Эксперт']); 
});

// https://allure.itlabs.io/project/28/test-cases/4344?treeId=58
test('#4344 Переход из одной причины обращения в другую', 
   { tag: ['@regress'] },
  async ({ page }) =>{
label('tag', 'regress');   
 feature('Auth');
const page1 = await createAppeal(page);
await page1.locator('[data-test="select-appeal"]').click();
await page1
  .locator('[data-test="select-appeal"] li')
  .filter({ hasText: 'Новый заказ' })
  .click();
await page1.locator('.ant-select-selection-overflow').click();
await page1.getByText('РЦ Тмн, 50 лет Октября, 109 ко').click();
await page1.locator('[data-test="search-input"]').click();
await page1.locator('[data-test="search-input"]').fill('2777');
await page1.locator('[data-test="search-button"]').click();
await page1.locator('[data-test="shopping-card-button"]').first().click();
await page1.getByRole('button', { name: 'Добавить' }).click();
await page1.locator('[data-test="to-cart-button"]').click();
await page1.locator('[data-test="make-order"]').click();
await page1.waitForSelector('[data-test="select-appeal"]', { state: 'attached' });
await page1.locator('[data-test="select-appeal"]').click();
await page1
  .locator('[data-test="select-appeal"] li')
  .filter({ hasText: 'Редактирование' })
  .click();
await page1.waitForSelector('[data-test="close-order-btn"]', { state: 'attached' });
await page1.locator('[data-test="close-order-btn"]').click();
await page1.getByText('OK').click();
await expect(page1.locator('[data-test="search-input-number-order"]')).toBeVisible();
})

// https://allure.itlabs.io/project/28/test-cases/6750?treeId=58
test('#6750 Редактирование ранее созданного заказа, через историю', 
   { tag: ['@regress'] },
   async ({ page }) =>{
  label('tag', 'regress');   
   feature('Auth');
const page1 = await createAppeal(page);
await page1.locator('[data-test="go-appeal-history"]').click();
await page1
  .locator('[data-icon="form"]')
  .first()
  .click();
  await page1.locator('[data-test="select-appeal"]').click();
await page1
  .locator('[data-test="select-appeal"] li')
  .filter({ hasText: 'Редактирование' })
  .click();
await expect(page1.getByText('Заказ №')).toBeVisible();
})

//https://allure.itlabs.io/project/28/test-cases/5636?treeId=58 
test('#5636 Создание обращение клиента, который не зарегистрирован в ПЛ, но обращался на линию',
   { tag: ['@regress'] },
  async ({ page }) => {
    label('tag', 'regress');   
   feature('Auth');
  const appealPage = await createAppeal(page, "(919)-959-32-97");
 await expect(page.getByText('История обращений')).toBeVisible();
  await expect(appealPage).toHaveURL(/\/appeal/);
});


 // https://allure.itlabs.io/project/28/test-cases/4576?treeId=58
test("#4576 Создание обращения - валидация (телефон)", 
   { tag: ['@regress'] },
  async ({ page }) => {
    label('tag', 'regress');   
   feature('Auth');
  await page.goto("https://cerebro.dev.contact-center.itlabs.io/home");
  await page.locator('input[name="login"]').fill("mmalyutina");
  await page.locator('input[name="password"]').fill("123456789");
  await page.getByRole("button", { name: "Войти" }).click();
  // Переход: Клиенты Новое обращение
  const clientsLink = page.getByText("Клиенты").first();
  await clientsLink.waitFor({ state: "visible" });
  await clientsLink.click({ force: true });
  await page.getByRole("link", { name: "Новое обращение" }).click();

  const phoneInput = page.locator('input[name="phone"]');
  const submitBtn = page.locator('button[type="submit"]');
  // 1) Пустое поле "Укажите корректный номер телефона"
  await page.getByText("Телефон").click();
  await submitBtn.click();
  await expect(page.getByText("Укажите корректный номер телефона")).toBeVisible();
  // 2) "Неверный формат телефонного номера"
  await phoneInput.fill("1111111111");
  await submitBtn.click();
  await expect(page.getByText("Неверный формат телефонного номера")).toBeVisible();
  // 3) "Укажите корректный номер телефона"
  await phoneInput.fill("919959");
  await submitBtn.click();
  await expect(page.getByText("Укажите корректный номер телефона")).toBeVisible();
  // 4) переход на /selectClient
  await phoneInput.fill("9199593292");
  const popupOrNull = await Promise.all([
    page.waitForEvent("popup").catch(() => null),
    submitBtn.click(),
  ]).then(([popup]) => popup);

  const targetPage = popupOrNull ?? page;

  await expect(targetPage).toHaveURL(/\/selectClient/);
  await expect(targetPage.getByText("Создание клиента")).toBeVisible();
});


// https://allure.itlabs.io/project/28/test-cases/4576?treeId=58
test("#4576 Создание обращения - валидация (email)",
   { tag: ['@regress'] },
  async ({ page }) => {
    label('tag', 'regress');   
   feature('Auth');
  await page.goto("https://cerebro.dev.contact-center.itlabs.io/home");
  await page.locator('input[name="login"]').fill("mmalyutina");
  await page.locator('input[name="password"]').fill("123456789");
  await page.getByRole("button", { name: "Войти" }).click();
  // Переход: Клиенты -> Новое обращение
  const clientsLink = page.getByText("Клиенты").first();
  await clientsLink.waitFor({ state: "visible" });
  await clientsLink.click({ force: true });
  await page.getByRole("link", { name: "Новое обращение" }).click();
  const emailInput = page.locator('input[name="email"]');
  const submitBtn = page.locator('button[type="submit"]');

  // 1) Пустое поле -> "Это обязательное поле"
  await page.getByText("E-mail").click(); 
  await submitBtn.click();
  await expect(page.getByText("Это обязательное поле")).toBeVisible();

  // 2) Слишком длинный/некорректный email -> "Укажите корректный email"
  await emailInput.fill(`${"s".repeat(50)}nikaniki02@mail.ru`);
  await submitBtn.click();
  await expect(page.getByText("Укажите корректный email")).toBeVisible();

  // 3) grusha@@mail.ru -> "Укажите корректный email"
  await emailInput.fill("grusha@@mail.ru");
  await submitBtn.click();
  await expect(page.getByText("Укажите корректный email")).toBeVisible();
  // 4) Валидный email 
  await emailInput.fill("nikaniki02@mail.ru");

  const popupOrNull = await Promise.all([
    page.waitForEvent("popup").catch(() => null),
    submitBtn.click(),
  ]).then(([popup]) => popup);

  const targetPage = popupOrNull ?? page;

  await expect(targetPage).toHaveURL(/\/selectClient/);
  await expect(targetPage.getByText("Создание клиента")).toBeVisible();
});

// https://allure.itlabs.io/project/28/test-cases/4576?treeId=58
test("#4576 Создание обращения - валидация (мессенджер)",
   { tag: ['@regress'] },
  async ({ page }) => {
    label('tag', 'regress');   
   feature('Auth');
  await page.goto("https://cerebro.dev.contact-center.itlabs.io/home");
  await page.locator('input[name="login"]').fill("mmalyutina");
  await page.locator('input[name="password"]').fill("123456789");
  await page.getByRole("button", { name: "Войти" }).click();
  // Переход: Клиенты -Новое обращение
  const clientsLink = page.getByText("Клиенты").first();
  await clientsLink.waitFor({ state: "visible" });
  await clientsLink.click({ force: true });
  await page.getByRole("link", { name: "Новое обращение" }).click();

  const messengerInput = page.locator('input[name="messanger"]');
  const submitBtn = page.locator('button[type="submit"]');
  // 1) Пустое поле -> "Укажите корректный номер телефона"
  await page.getByText("Мессенджер").click();
  await submitBtn.click();
  await expect(page.getByText("Укажите корректный номер телефона")).toBeVisible();
  // 2) Некорректный номер -та же ошибка
  await messengerInput.fill("919959");
  await submitBtn.click();
  await expect(page.getByText("Укажите корректный номер телефона")).toBeVisible();
  // 3) Валидный номер 
  await messengerInput.fill("9199570789");
  const popupOrNull = await Promise.all([
    page.waitForEvent("popup").catch(() => null),
    submitBtn.click(),
  ]).then(([popup]) => popup);

  const targetPage = popupOrNull ?? page;

  await expect(targetPage).toHaveURL(/\/selectClient/);
  await expect(targetPage.getByText("Создание клиента")).toBeVisible();
});
