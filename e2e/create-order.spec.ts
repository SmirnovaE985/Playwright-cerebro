
// #4609 Перевод предложения в заказ
// #5301 Создание нового заказа, после закрытия старого заказа и возврата в поиск
// #4605 Отмена позиции до и после создания заказа


import { test, expect } from '@playwright/test';
import { createAppeal } from '../helpers/commands';
import { pickFirstAvailableDate } from '../helpers/commands';
import { deleteAllPositions } from '../helpers/commands';
import { label, feature } from 'allure-js-commons';
import { label as allureLabel, feature as allureFeature } from 'allure-js-commons';


// https://allure.itlabs.io/project/28/test-cases/4609?treeId=58
test('#4609 Перевод предложения в заказ',
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
await page1.locator('[data-test="search-input"]').fill('молоток');
await page1.locator('[data-test="search-button"]').click();
await page1.locator('[data-test="shopping-card-button"]').first().click();
await page1.getByRole('button', { name: 'Добавить' }).click();
await page1.locator('[data-test="to-cart-button"]').click();
await page1.locator('[data-test="make-offer"]').click();
await page1.locator('[data-test="offer-to-order"]').click();
await expect(page1.getByText('Предложение переведено в заказ успешно!')).toBeVisible();
await deleteAllPositions(page1);
});

 // https://allure.itlabs.io/project/28/test-cases/5301?treeId=58
 test('#5301 Создание нового заказа, после закрытия старого заказа и возврата в поиск', 
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
await page1.locator('[data-test="search-input"]').fill('цемент');
await page1.locator('[data-test="search-button"]').click();
await page1.locator('[data-test="shopping-card-button"]').first().click();
await page1.getByRole('button', { name: 'Добавить' }).click();
await page1.locator('[data-test="to-cart-button"]').click();
await page1.locator('[data-test="make-order"]').click();
await expect(page1.getByText('Заказ успешно создан')).toBeVisible();
await page1.locator('[data-test="close-order-btn"]').click();
await page1.getByText('OK').click();
await page1.getByText('Перейти в поиск').click();
await page1.locator('[data-test="search-input"]').fill('кисть');
await page1.locator('[data-test="search-button"]').click();
await page1.locator('[data-test="shopping-card-button"]').first().click();
await page1.getByRole('button', { name: 'Добавить' }).click();
await page1.locator('[data-test="to-cart-button"]').click();
await page1.locator('[data-test="make-order"]').click();
await expect(page1.getByText('Заказ успешно создан')).toBeVisible();
await page1.locator('[data-test="delete-all-position"]').click();
await page1.locator('[data-test="delete-all-position-ok-button"]').click();
await page1.locator('[data-test="save-order"], [data-test="save-offer"]').click();
await expect(page1.getByText('Успешно сохранено')).toBeVisible();
 });

 //https://allure.itlabs.io/project/28/test-cases/4605?treeId=58
 test('#4605 Отмена позиции до и после создания заказа', 
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
await page1.locator('[data-test="search-input"]').fill('цемент');
await page1.locator('[data-test="search-button"]').click();
await page1.locator('[data-test="shopping-card-button"]').first().click();
await page1.getByRole('button', { name: 'Добавить' }).click();
// 
await page1.locator('[data-test="search-input"]').click();
await page1.locator('[data-test="search-input"]').fill('ведро');
await page1.locator('[data-test="search-button"]').click();
await page1.locator('[data-test="shopping-card-button"]').first().click();
await page1.getByRole('button', { name: 'Добавить' }).click();
await page1.locator('[data-test="to-cart-button"]').click();
// проверяем кол-во товаров до создания заказа
const elements = page1.locator('[data-test=cart-position]');
await expect(elements).toHaveCount(2);
await expect(elements.first()).toBeVisible();
await expect(elements.last()).toBeVisible();
await page1.locator('[data-test="delete-position"]').first().click();
await page1.locator('[data-test="make-order"]').click();
await expect(page1.getByText('Заказ успешно создан')).toBeVisible();
// и после 
const elementsAfterDelete = page1.locator('[data-test=cart-position]'); 
await expect(elementsAfterDelete).toHaveCount(1); 
await expect(elementsAfterDelete).toBeVisible();
await page1.locator('[data-test="delete-position"]').first().click();
await page1.locator('[data-test="save-order"]').click();
await expect(page1.getByText('Успешно сохранено')).toBeVisible();
 });