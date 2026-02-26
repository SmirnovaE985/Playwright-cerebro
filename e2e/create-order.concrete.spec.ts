// #6240 создание стандартного заказа для товара, который имеет признак ГТР
// #4141Создать заказ на бетон через быстрое добавление в корзину
// #4251 Создать заказ бетона с несколькими машинами
// #4345 Создать заказ с дробным числом
// #4346 Создать заказ с комментарием к ТТН
// #4130 Создать заказ бетона с через карточку товара с ручной ценой
// #4232 Создать заказ бетона с изменением объема через листинг
// #4018 Создать заказ с бетоном через причину обращения "консультация"


import { test, expect } from '@playwright/test';
import { createAppeal } from '../helpers/commands';
import { deleteAllPositions } from '../helpers/commands';
import { label, feature } from 'allure-js-commons';
import { label as allureLabel, feature as allureFeature } from 'allure-js-commons';

  // https://allure.itlabs.io/project/28/test-cases/6240?treeId=58
test('#6240 создание стандартного заказа для товара, который имеет признак ГТР',
{ tag: ['@regress'] }, 
async ({page}) => { 
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
await page1.locator('[data-test="search-input"]').fill('14904');
await page1.locator('[data-test="search-button"]').click();
await page1.locator('[data-test="shopping-card-button"]').first().click();
await page1.getByRole('button', { name: 'Добавить' }).click();
await page1.locator('[data-test="to-cart-button"]').click();
await page1.locator('[data-test="make-order"]').click();
await expect(page1.getByText('Заказ успешно создан')).toBeVisible();
await page1.locator('[data-test=send-sms]').click();
await page1.locator('[data-test=pattern-sms]').click();
await page1.getByText('Заказ. Номер сумма, адрес самовывоза').click();
await page1.locator('[data-test=send-sms-for]').click();
await deleteAllPositions(page1);
 });

 //https://allure.itlabs.io/project/28/test-cases/4141?treeId=58
test('#4141Создать заказ на бетон через быстрое добавление в корзину',
{ tag: ['@regress'] }, 
async ({page}) => { 
label('tag', 'regress');   
feature('Auth');
const page1 = await createAppeal(page);
await page1.locator('[data-test="select-appeal"]').click();
await page1
  .locator('[data-test="select-appeal"] li')
  .filter({ hasText: 'Новый заказ' })
  .click();
await page1.locator('[data-test="search-input"]').click();
await page1.locator('[data-test="search-input"]').fill('бетон');
await page1.locator('[data-test="search-button"]').click();
await page1.locator('[data-test="shopping-card-button"]').first().click();
await page1.locator('[data-test=add-quantity-input]').click();
await page1.locator('[data-test=add-quantity-input]').fill('6');
await page1.locator('[data-test=delivery-address]').fill('Агеева');
await page1.getByText('Агеева').first().click();
await page1.locator('input[placeholder*="Выберите дату"]').click();
 //определяем текущую дату и добавляем к ней 1 день
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const year = tomorrow.getFullYear();
    const month = String(tomorrow.getMonth() + 1).padStart(2, '0');
    const day = String(tomorrow.getDate()).padStart(2, '0');

    const tomorrowFormatted = `${year}-${month}-${day}`;
    await page1.locator(`td[title="${tomorrowFormatted}"]`).click();
    // Нажимаем "Добавить машину"
await page.waitForTimeout(3000);
 await page1.getByText('Добавить машину').click();
await page1.locator('[data-test="cars-type"]').click();
await page1.getByText('Бетоновоз 6м3').click();
//выбрать время
 await page1.locator('[data-test="cars-time-0"]').click();
await page1.locator('[data-test="cars-time-0"] .ant-select-dropdown')
  .first()
  .click();
//ввести объём бетона
await page1.locator('input[placeholder*="Объём"]').fill('6');
await page1.locator('.ant-btn-primary', { hasText: 'Добавить' }).click();
// 
await page1.locator('[data-test="to-cart-button"]').click();
await page1.locator('[data-test="make-order"]').click();
await expect(page1.getByText('Заказ успешно создан')).toBeVisible();
 });

//https://allure.itlabs.io/project/28/test-cases/4251?treeId=58
test('#4251 Создать заказ бетона с несколькими машинами',
{ tag: ['@regress'] }, 
async ({page}) => { 
allureLabel('tag', 'regress');
allureFeature('Auth');      
const page1 = await createAppeal(page);
await page1.locator('[data-test="select-appeal"]').click();
await page1
  .locator('[data-test="select-appeal"] li')
  .filter({ hasText: 'Новый заказ' })
  .click();
await page1.locator('[data-test="search-input"]').click();
await page1.locator('[data-test="search-input"]').fill('бетон');
await page1.locator('[data-test="search-button"]').click();
await page1.locator('[data-test="shopping-card-button"]').first().click();
await page1.locator('[data-test=add-quantity-input]').click();
await page1.locator('[data-test=add-quantity-input]').fill('20');
await page1.locator('[data-test=delivery-address]').fill('Агеева');
await page1.getByText('Агеева').first().click();
await page1.locator('input[placeholder*="Выберите дату"]').click();
 //определяем текущую дату и добавляем к ней 1 день
  const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const year = tomorrow.getFullYear();
    const month = String(tomorrow.getMonth() + 1).padStart(2, '0');
    const day = String(tomorrow.getDate()).padStart(2, '0');
    const tomorrowFormatted = `${year}-${month}-${day}`;
    await page1.locator(`td[title="${tomorrowFormatted}"]`).click();
     //Нажать кнопку "нужен автобетононасос"
     await page1.waitForTimeout(3000);
const label = page1.locator('div', { hasText: 'Нужен автобетононасос' });
const toggle = label.locator('button[role="switch"]');
if (await toggle.getAttribute('aria-checked') === 'false') {
  await toggle.click();
}

await page1.locator('[data-test="length-of-pump"]').click();
await page1.getByText('АБН до 28м').click();
await page1.locator('[data-test="interval-of-pump"]').click();
await page1.locator('.ant-select-item-option-content', { hasText: '08:00-13:00'}).click();
// Нажимаем "Добавить машину"
 await page1.getByText('Добавить машину').click();
await page1.locator('[data-test="cars-type"]').click();
await page1.getByText('Бетоновоз 10м3').click();
//выбрать время
await page1.locator('[data-test="cars-time-0"]').click();
await page1.locator('.ant-select-item-option-content', { hasText: '09:00-10:00'}).click();
//ввести объём бетона
await page1.locator('input[placeholder*="Объём"]').fill('10');
// Нажимаем "Добавить машину 2"
 await page1.getByText('Добавить машину').click();
await page1.locator('[data-test="cars-type"]', { hasText: 'Выберите тип' }).click();
await page1.getByText('Бетоновоз 12м3').first().click();
//выбрать время
 await page1.locator('[data-test="cars-time-0"]').click();
await page1.locator('.ant-select-item-option-content', { hasText: '10:00-11:00'}).first().click();
//ввести объём бетона
await page1.locator('input[placeholder*="Объём"]').first().pressSequentially('10', { delay: 500 });
await page1.locator('.ant-btn-primary', { hasText: 'Добавить' }).click();
await page1.locator('[data-test="to-cart-button"]').click();
await page1.locator('[data-test="make-order"]').click();
await expect(page1.getByText('Заказ успешно создан')).toBeVisible();
// ошибка с бека- цены на насос и доставку-0, нельзя добавить в корзину, вернуться  к тесту как поправят
 });

  //allure.itlabs.io/project/28/test-cases/4345?treeId=58
test('#4345 Создать заказ с дробным числом', 
{ tag: ['@regress'] }, 
async ({page}) => { 
label('tag', 'regress');   
feature('Auth');
const page1 = await createAppeal(page);
await page1.locator('[data-test="select-appeal"]').click();
await page1
  .locator('[data-test="select-appeal"] li')
  .filter({ hasText: 'Новый заказ' })
  .click();
await page1.locator('[data-test="search-input"]').click();
await page1.locator('[data-test="search-input"]').fill('бетон');
await page1.locator('[data-test="search-button"]').click();
await page1.locator('[data-test="shopping-card-button"]').first().click();
await page1.locator('[data-test=add-quantity-input]').click();
await page1.locator('[data-test=add-quantity-input]').fill('10.5');
await page1.locator('[data-test=delivery-address]').fill('Агеева');
await page1.getByText('Агеева').first().click();
await page1.locator('input[placeholder*="Выберите дату"]').click();
 //определяем текущую дату и добавляем к ней 1 день
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const year = tomorrow.getFullYear();
    const month = String(tomorrow.getMonth() + 1).padStart(2, '0');
    const day = String(tomorrow.getDate()).padStart(2, '0');

    const tomorrowFormatted = `${year}-${month}-${day}`;
    await page1.locator(`td[title="${tomorrowFormatted}"]`).click();
// Нажимаем "Добавить машину"
await page.waitForTimeout(3000);
 await page1.getByText('Добавить машину').click();
await page1.locator('[data-test="cars-type"]').click();
await page1.getByText('Бетоновоз 12м3').click();
//выбрать время
 await page1.locator('[data-test="cars-time-0"]').click();
await page1.locator('[data-test="cars-time-0"] .ant-select-dropdown')
  .first()
  .click();
//ввести объём бетона
await page1.locator('input[placeholder*="Объём"]').fill('10.5');
await page1.locator('.ant-btn-primary', { hasText: 'Добавить' }).click();
await page1.locator('[data-test="to-cart-button"]').click();
await page1.locator('[data-test="make-order"]').click();
await expect(page1.getByText('Заказ успешно создан')).toBeVisible();
 });


// allure.itlabs.io/project/28/test-cases/4346?treeId=58
test('#4346 Создать заказ с комментарием к ТТН', 
 { tag: ['@regress'] }, 
async ({page}) => { 
label('tag', 'regress');   
feature('Auth');     
const page1 = await createAppeal(page);
await page1.locator('[data-test="select-appeal"]').click();
await page1
  .locator('[data-test="select-appeal"] li')
  .filter({ hasText: 'Новый заказ' })
  .click();
await page1.locator('[data-test="search-input"]').click();
await page1.locator('[data-test="search-input"]').fill('бетон');
await page1.locator('[data-test="search-button"]').click();
await page1.locator('[data-test="shopping-card-button"]').first().click();
await page1.locator('[data-test=add-quantity-input]').click();
await page1.locator('[data-test=add-quantity-input]').fill('10');
await page1.locator('[data-test=delivery-address]').fill('Агеева');
await page1.getByText('Агеева').first().click();
await page1.locator('input[placeholder*="Выберите дату"]').click();
 //определяем текущую дату и добавляем к ней 1 день
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const year = tomorrow.getFullYear();
    const month = String(tomorrow.getMonth() + 1).padStart(2, '0');
    const day = String(tomorrow.getDate()).padStart(2, '0');

    const tomorrowFormatted = `${year}-${month}-${day}`;
    await page1.locator(`td[title="${tomorrowFormatted}"]`).click();
// Нажимаем "Добавить машину"
 await page1.getByText('Добавить машину').click();
await page1.locator('[data-test="cars-type"]').click();
await page1.getByText('Бетоновоз 10м3').click();
//выбрать время
await page1.locator('[data-test="cars-time-0"]').click();
await page1.locator('.ant-select-item-option-content', { hasText: '09:00-10:00'}).click();
//ввести объём бетона
await page1.locator('input[placeholder*="Объём"]').fill('10');
await page1.locator('[data-test=comment-car]').fill('тестовый комментарий');
await page1.waitForTimeout(3000);
await page1.locator('.ant-btn-primary', { hasText: 'Добавить' }).click();
await page1.locator('[data-test="to-cart-button"]').click();
await page1.locator('[data-test="make-order"]').click();
await expect(page1.getByText('Заказ успешно создан')).toBeVisible();
await page1.locator('[data-test="cart-position"]').click();

 });


//https:allure.itlabs.io/project/28/test-cases/4130?treeId=58
test('#4130 Создать заказ бетона с через карточку товара с ручной ценой',
{ tag: ['@regress'] }, 
async ({page}) => { 
label('tag', 'regress');   
feature('Auth');     
const page1 = await createAppeal(page);
await page1.locator('[data-test="select-appeal"]').click();
await page1
  .locator('[data-test="select-appeal"] li')
  .filter({ hasText: 'Новый заказ' })
  .click();
await page1.locator('[data-test="search-input"]').click();
await page1.locator('[data-test="search-input"]').fill('бетон');
await page1.locator('[data-test="search-button"]').click();
await page1.locator('[data-test=product-link]').first().click();
await page1.locator('[data-test="add-quantity-input"]').clear();
await page1.waitForTimeout(3000);
await page1.locator('[data-test="add-quantity-input"]').fill('6');
await page1.locator('[data-test="add-position"]').click();
// вводим ручную цену
const input = page1.locator('[data-test="input-price-modal-0"]');
await input.clear();
await input.fill('8000');
// проверка, что в value будет '8000'
await expect(input).toHaveValue('8 000');
// если нет, делаем повторный ввод
try {
  await expect(input).toHaveValue('8 000', { timeout: 500 });
} catch {
  await input.clear();
  await input.fill('8 000');
  await expect(input).toHaveValue('8 000');
}
await page1.locator('[data-test=delivery-address]').fill('Агеева');
await page1.getByText('Агеева').first().click();
await page1.locator('input[placeholder*="Выберите дату"]').click();
//определяем текущую дату и добавляем к ней 2 дн
const today = new Date();
const targetDate = new Date(today);
targetDate.setDate(today.getDate() + 2);

const year = targetDate.getFullYear();
const month = String(targetDate.getMonth() + 1).padStart(2, '0');
const day = String(targetDate.getDate()).padStart(2, '0');

const targetDateFormatted = `${year}-${month}-${day}`;
await page1.locator(`td[title="${targetDateFormatted}"]`).click();
await page1.waitForTimeout(3000);
await page1.locator('[data-test="add-car-concrete"]').click();
// 
await page1.locator('[data-test="cars-type"]').click();
await page1.getByText('Бетоновоз 10м3').click();
//выбрать время
 await page1.locator('[data-test="cars-time-0"]').click();
await page1.locator('[data-test="cars-time-0"] .ant-select-dropdown')
  .first()
  .click();
//ввести объём бетона
await page1.locator('input[placeholder*="Объём"]').fill('6');
const modal = page1.locator('.ant-modal:visible'); // текущее открытое модальное окно
await modal
  .locator('.ant-btn-primary', { hasText: 'Добавить' })
  .click();
await page1.locator('[data-test="to-cart-button"]').click();
await page1.waitForSelector('[data-test="make-order"]', { state: 'visible' });
await page1.locator('[data-test="make-order"]').click();
await expect(
  page1.locator('[class*="position-price-container"] span')
).toHaveText('8 000 ₽')

 });


//https://allure.itlabs.io/project/28/test-cases/4232?treeId=58
test('#4232 Создать заказ бетона с изменением объема через листинг', async ({page}) => {     
const page1 = await createAppeal(page);
await page1.locator('[data-test="select-appeal"]').click();
await page1
  .locator('[data-test="select-appeal"] li')
  .filter({ hasText: 'Новый заказ' })
  .click();
await page1.locator('[data-test="search-input"]').click();
await page1.locator('[data-test="search-input"]').fill('бетон');
await page1.locator('[data-test="search-button"]').click();
await page1.locator('[data-test="shopping-card-button"]').first().click();
await page1.locator('[data-test=add-quantity-input]').click();
await page1.locator('[data-test=add-quantity-input]').fill('10');
await page1.locator('[data-test=delivery-address]').fill('Агеева');
await page1.getByText('Агеева').first().click();
await page1.locator('input[placeholder*="Выберите дату"]').click();
//определяем текущую дату и добавляем к ней 2 дн
const today = new Date();
const targetDate = new Date(today);
targetDate.setDate(today.getDate() + 2);

const year = targetDate.getFullYear();
const month = String(targetDate.getMonth() + 1).padStart(2, '0');
const day = String(targetDate.getDate()).padStart(2, '0');

const targetDateFormatted = `${year}-${month}-${day}`;
await page1.locator(`td[title="${targetDateFormatted}"]`).click();
 await page1.waitForTimeout(3000); 
// Нажимаем "Добавить машину"
await page1.getByText('Добавить машину').click({ trial: true });
await page1.getByText('Добавить машину').click();
await page1.locator('[data-test="cars-type"]').click();
 await page1.getByText('Бетоновоз 12м3').click();
//выбрать время
await page1.locator('[data-test="cars-time-0"]').click();
await page1.locator('.ant-select-item-option-content', { hasText: '09:00-10:00'}).click();
//ввести объём бетона
await page1.locator('input[placeholder*="Объём"]').fill('10');
await page1.locator('.ant-btn-primary', { hasText: 'Добавить' }).click();
await page1.locator('[data-test="to-cart-button"]').click();
await page1.locator('[data-test="cart-position"]').click();
//ввести объём бетона
await page1.locator('input[placeholder*="Объём"]').fill('9');
await page1.locator('[data-test="add-quantity-input"]').fill('9'); 
const saveButton = page1.locator('.ant-btn-primary', { hasText: 'Сохранить' });
// Проверяем, что кнопка видима и активна 
await expect(saveButton).toBeVisible();
await expect(saveButton).toBeEnabled();
//  после этого кликаем
await saveButton.click();
await page1.locator('[data-test="make-order"]').click();
await expect(page1.getByText('Заказ №')).toBeVisible();
await expect(page1.getByText('9 м3. х')).toBeVisible();

});

//https://allure.itlabs.io/project/28/test-cases/4018?treeId=58
test('#4018 Создать заказ с бетоном через причину обращения "консультация"', 
{ tag: ['@regress'] }, 
async ({page}) => { 
label('tag', 'regress');   
feature('Auth');
const page1 = await createAppeal(page);
await page1.locator('[data-test="select-appeal"]').click();
await page1
  .locator('[data-test="select-appeal"] li')
  .filter({ hasText: 'Консультация Материалы / Услуги' })
  .click();
await page1.locator('[data-test="search-input"]').click();
await page1.locator('[data-test="search-input"]').fill('бетон');
await page1.locator('[data-test="search-button"]').click();
await page1.locator('[data-test="shopping-card-button"]').first().click();
await page1.locator('[data-test=add-quantity-input]').click();
await page1.locator('[data-test=add-quantity-input]').fill('10');
await page1.locator('[data-test=delivery-address]').fill('Агеева');
await page1.getByText('Агеева').first().click();
await page1.locator('input[placeholder*="Выберите дату"]').click();
//определяем текущую дату и добавляем к ней 2 дн
const today = new Date();
const targetDate = new Date(today);
targetDate.setDate(today.getDate() + 2);

const year = targetDate.getFullYear();
const month = String(targetDate.getMonth() + 1).padStart(2, '0');
const day = String(targetDate.getDate()).padStart(2, '0');

const targetDateFormatted = `${year}-${month}-${day}`;
await page1.locator(`td[title="${targetDateFormatted}"]`).click();
 await page1.waitForTimeout(3000); 
// Нажимаем "Добавить машину"
await page1.getByText('Добавить машину').click({ trial: true });
await page1.getByText('Добавить машину').click();
await page1.locator('[data-test="cars-type"]').click();
 await page1.getByText('Бетоновоз 12м3').click();
//выбрать время
await page1.locator('[data-test="cars-time-0"]').click();
await page1.locator('.ant-select-item-option-content', { hasText: '09:00-10:00'}).click();
//ввести объём бетона
await page1.locator('input[placeholder*="Объём"]').fill('10');
await page1.locator('.ant-btn-primary', { hasText: 'Добавить' }).click();
await page1.locator('[data-test="to-cart-button"]').click();
await page1.locator('[data-test="make-order"]').click();
await expect(page1.getByText('Заказ №')).toBeVisible();
await expect(page1.getByText('10 м3. х')).toBeVisible();

});