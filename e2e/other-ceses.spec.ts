// #4587 Привязка клиента к менеджеру через вкладку "мои клиенты" [ok]
// #4592 Создание претензии [ok]
// #4964 Регистрация Ошибки/ОС [ok]
// #4594 Регистрация соискателя [ok]
// #3350 Шаблоны СМС из хэдра/корзины [ok]

import { test, expect } from '@playwright/test';
import { createAppeal } from '../helpers/commands';
import { deleteAllPositions } from '../helpers/commands';
import { createOrder } from '../helpers/commands';
import { createOrderCheckPromo } from '../helpers/commands';
import { randomInt } from 'crypto';
import { label, feature } from 'allure-js-commons';
import { label as allureLabel, feature as allureFeature } from 'allure-js-commons';

// https://allure.itlabs.io/project/28/test-cases/4587?treeId=58
test('#4587 Привязка клиента к менеджеру через вкладку "мои клиенты"',
  { tag: ['@regress'] },
 async ({
  page,
  browser,
}) => {
  label('tag', 'regress');   
  feature('Auth');
  await page.goto("https://cerebro.dev.contact-center.itlabs.io");
  await page.locator('input[name="login"]').fill("mmalyutina");
  await page.locator('input[name="password"]').fill("123456789");
  await page.getByRole("button", { name: "Войти" }).click();
  await page.getByText("Клиенты").hover({ force: true });
  await page.getByText("Мои клиенты").click();
  // Добавить нового клиента
  await page.getByText('Добавить нового клиента').click();
  const rnd = () => Math.floor(Math.random() * 10);
  const name = `Иван${rnd()}${rnd()}${rnd()}`;
  const phone = `9123321${rnd()}${rnd()}${rnd()}`;
  await page.getByPlaceholder("Укажите имя").fill(name);
  const ssNumber = `СС${randomInt(9_000_000_000, 10_000_000_000)}`;
  await page.locator('input[name="phone"]').fill(ssNumber);
  await page.getByText("Создать нового клиента").click({ force: true });
await page.getByText('Клиент создан успешно').waitFor({ state: 'visible' });
await page.locator('.ant-notification-notice-close').click();
await page.getByText('Клиенты', { exact: true }).click();
await page.getByRole('link', { name: 'Новое обращение' }).click();
await page.locator('input[placeholder="Телефон"]').fill(ssNumber);
// ловим новую вкладку
const page1Promise = page.waitForEvent('popup');
  await page.getByRole('button', { name: 'Создать новое обращение' }).click();
  const page1 = await page1Promise;
await page1.getByRole('combobox', { name: '* Тип клиента :' }).click();
  await page1.getByText('Физическое лицо').click();
  await page1.getByRole('textbox', { name: '* Имя/Название :' }).click();
  await page1.getByRole('textbox', { name: '* Имя/Название :' }).fill('Иван Васильевич');
  await page1.getByRole('button', { name: 'Создать' }).click();
 await expect(page1.getByText('Мой клиент')).toBeVisible();

});


// https://allure.itlabs.io/project/28/test-cases/4592?treeId=58
test('#4592 Создание претензии', 
{ tag: ['@regress'] }, 
async ({page}) => { 
label('tag', 'regress');   
feature('Auth');
const page1 = await createOrder(page);
await page1.locator('.ant-notification-notice-close').first().click(); 
// дать доступ к буферу
await page1.context().grantPermissions(['clipboard-read', 'clipboard-write']);
await page1.locator('[data-icon="copy"]').click();
// блок с претензией 
await page1.locator('[data-test="select-appeal"]').click();
  await page1
  .locator('[data-test="select-appeal"] li')
  .filter({ hasText: 'Претензия' })
  .click();
// забираем номер заказа из буфера и запоминаем
const orderNumber = (await page1.evaluate(() => navigator.clipboard.readText())).trim();
// вставляем в поле
const orderInput = page1.locator('input[name="orderNumber"]');
await orderInput.click();
await orderInput.press('Control+A');
await page1.keyboard.type(orderNumber);
await expect(page1.locator('input[placeholder="Номер телефона"]')).toHaveValue('+79000000066');
// 
const placeholder = page1.locator(
  'span.ant-select-selection-placeholder',
  { hasText: 'Выбрать источник претензии' }
);
// поднимаемся к контейнеру селекта и кликаем по кликабельной части
const select = placeholder.locator('xpath=ancestor::div[contains(@class,"ant-select")]').first();
await select.locator('.ant-select-selector').click();
// дождаться открытия
await expect(select.getByRole('combobox')).toHaveAttribute('aria-expanded', 'true');
await page1.locator('.ant-select-dropdown:visible').click();
const type = page1.locator(
  'span.ant-select-selection-placeholder',
  { hasText: 'Выбрать инцидент' }
);
const selectType = type.locator('xpath=ancestor::div[contains(@class,"ant-select")]').first();
await selectType.locator('.ant-select-selector').click();
await page1.getByText('Доставка клиенту').click();
const place = page1.locator(
  'span.ant-select-selection-placeholder',
  { hasText: 'Выбрать город' }
);
const selectPlace = place.locator('xpath=ancestor::div[contains(@class,"ant-select")]').first();
await selectPlace.locator('.ant-select-selection-search').click();
await page1.getByText('СД Тюмень').last().click();
const chanel = page1.locator(
  'span.ant-select-selection-placeholder',
  { hasText: 'Выбрать канал сбыта' }
);
const selectChanel = chanel.locator('xpath=ancestor::div[contains(@class,"ant-select")]').first();
await selectChanel.locator('.ant-select-selection-search').click();
await page1.getByText('Розница').click();
const shop = page1.locator(
  'span.ant-select-selection-placeholder',
  { hasText: 'Выбрать подразделение' }
);
const selectShop = shop.locator('xpath=ancestor::div[contains(@class,"ant-select")]').first();
await selectShop.locator('.ant-select-selection-search').click();
await page1.getByText('БМ Тмн Панфиловцев').click();
await page1.getByPlaceholder('Опишите претензию').fill('нахамили и водой облили');
await page1.getByRole('button', { name: 'Отправить претензию' }).click();
await expect(page1.getByText('Претензия успешно создана')).toBeVisible();
});


// https://allure.itlabs.io/project/28/test-cases/4964?treeId=58
test('#4964 Регистрация Ошибки/ОС ', 
{ tag: ['@regress'] }, 
async ({page}) => { 
label('tag', 'regress');   
feature('Auth');
const page1 = await createOrder(page);
await page1.locator('.ant-notification-notice-close').first().click(); 
// дать доступ к буферу
await page1.context().grantPermissions(['clipboard-read', 'clipboard-write']);
await page1.locator('[data-icon="copy"]').click();
// меняем причину обращения
await page1.locator('[data-test="select-appeal"]').click();
  await page1
  .locator('[data-test="select-appeal"] li')
  .filter({ hasText: 'Ошибки / ОС' })
  .click();
  // забираем номер заказа из буфера и запоминаем
const orderNumber = (await page1.evaluate(() => navigator.clipboard.readText())).trim();
// вставляем в поле
const orderInput = page1.locator('input[name="orderNumber"]');
await orderInput.click();
await orderInput.press('Control+A');
await page1.keyboard.type(orderNumber);
await page1.locator('.ant-select-selection-overflow').click();
await page1.getByText('РЦ Тимберленд 50летОктября').nth(1).click();
await page1.getByRole('button', { name: 'Зарегистрировать ошибку' }).click();
await page1.locator('.ant-select.ant-select-in-form-item > .ant-select-selector').click(); 
await page1.getByText('Брак/Пересорт').click();
await page1.getByPlaceholder('Укажите комментарий').fill('jhgbv94jh bhnjhbv');
await page1.getByRole('button', { name: 'Зарегистрировать ошибку' }).click(); 
await expect(page1.getByText('Инцидент создан успешно')).toBeVisible();
});


// https://allure.itlabs.io/project/28/test-cases/4594?treeId=58
test('#4594 Регистрация соискатели', 
{ tag: ['@regress'] }, 
async ({page}) => { 
label('tag', 'regress');   
feature('Auth');
const page1 = await createAppeal(page);
await page1.locator('[data-test="select-appeal"]').click();
await page1
  .locator('[data-test="select-appeal"] li')
  .filter({ hasText: ' Соискатели ' })
  .click();
await page.waitForTimeout(5000);
const shop = page1.locator(
  'span.ant-select-selection-placeholder',
  { hasText: 'Укажите населенный пункт' }
);
const selectShop = shop.locator('xpath=ancestor::div[contains(@class,"ant-select")]').first();
await selectShop.locator('.ant-select-selection-search').click();
await page1.getByText('Боровский').first().click();

});


// https://allure.itlabs.io/project/28/test-cases/3350?treeId=58
test('#3350 Шаблоны СМС из хэдра/корзины',
{ tag: ['@regress'] }, 
async ({page}) => { 
label('tag', 'regress');   
feature('Auth');
const page1 = await createAppeal(page);
await page1.locator('[data-test=select-appeal]').click();
await page1
  .locator('[data-test="select-appeal"] li')
  .filter({ hasText: ' Новый заказ ' })
  .click();
// закрываем анимацию 
await page1.locator('.ant-notification-notice-close').click();
const btn = page1.getByRole('button', { name: 'Отправить СМС' });
await btn.waitFor({ state: 'visible' });
await btn.click();
await page1.waitForTimeout(3000);
await expect(page1.locator('input[placeholder*="Телефон"]')).toBeEnabled
await page1.locator('input[placeholder*="Телефон"]').fill('9000000033');

await page1.locator('[data-test=empty-form]').fill('sdfghjkl; lkkkkd9');
await page1.locator('[data-test=send-sms-for]').click();
await expect(page1.getByText('Сообщение успешно отправлено')).toBeVisible();
// 
await page1.getByText('Отправить СМС').first().click();
await page1.waitForTimeout(3000);
await page1.locator('[data-test=pattern-sms]').click();
await page1.getByText('Заказ. Номер, сумма, доставка в течение дня').click();
await page1.locator('[data-test=send-sms-for]').click();
await expect(page1.getByText('Сообщение успешно отправлено')).toBeVisible();
// 
await page1.getByText('Отправить СМС').first().click();
await page1.locator('[data-test=pattern-sms]').click();
// Ждём, пока появится dropdown
const option = page1.locator(
  '.ant-select-dropdown [data-test="Контакт. Для физических лиц"]'
);
await option.waitFor({ state: 'visible' });
//Скроллим к нужному элементу
await option.scrollIntoViewIfNeeded();
await option.click();
await page1.locator('[data-test=send-sms-for]').click();
await expect(page1.getByText('Сообщение успешно отправлено')).toBeHidden();
// 
await page1.getByText('Отправить СМС').first().click();
await page1.waitForTimeout(3000);
await page1.locator('[data-test=pattern-sms]').click();
// Ждём, пока появится dropdown
const option1 = page1.locator(
  '.ant-select-dropdown [data-test="Интернет заказ. Доставка."]'
);
await option1.waitFor({ state: 'visible' });
//Скроллим к нужному элементу
await option1.scrollIntoViewIfNeeded();
await option1.click();
await page1.locator('[data-icon=close-circle]').click();
const select = page1.locator('[data-test="pattern-sms"]');
await expect(select).toContainText('Выберите шаблон');

});