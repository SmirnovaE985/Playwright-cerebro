
// #4609 Перевод предложения в заказ
// #5301 Создание нового заказа, после закрытия старого заказа и возврата в поиск
// #4605 Отмена позиции до и после создания заказа
// #5664 Создание стандартного заказа через мессенджер, со сменой ЕИ
// #4584 Создание заказа с нескольких магазинов
// #4608 Создание заказа с отрезным материалом с БМ или МОК
// #6290 Создание заказа с отрезным материалом с РЦ
// #5929 создание заказа с колеровкой, другим товаром
// #5927 создание и изменение в заказе с несколькими колеровками

import { test, expect } from '@playwright/test';
import { fillLoginForm } from '../helpers/commands';
import { createAppeal } from '../helpers/commands';
import { pickFirstAvailableDate } from '../helpers/commands';
import { deleteAllPositions } from '../helpers/commands';
import { label, feature } from 'allure-js-commons';
import { label as allureLabel, feature as allureFeature } from 'allure-js-commons';
import { addColoring } from '../helpers/commands';




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
await page1.locator('[data-test="product-link"]').first().click();
await page1.getByRole('button', { name: 'Добавить' }).click();
await page1.locator('[data-test="to-cart-button"]').click();
await page1.locator('[data-test="make-offer"]').click();
await page1.locator('[data-test="offer-to-order"]').click();
await expect(page1.getByText('Предложение переведено в заказ успешно!')).toBeVisible();
await page1.locator('.ant-notification-notice-close').first().click();
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
await page1.locator('.ant-notification-notice-close').first().click(); 
await expect(page1.getByText('Заказ успешно создан')).toBeVisible();
await page1.locator('[data-test="close-order-btn"]').click();
await page1.getByText('OK').click();
await page1.getByText('Перейти в поиск').click();
await page1.locator('[data-test="search-input"]').fill('кисть');
await page1.locator('[data-test="search-button"]').click();
await page1.locator('[data-test="shopping-card-button"]').first().click();
await expect(page1.getByRole('button', { name: 'Добавить' })).toBeEnabled();
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


// https://allure.itlabs.io/project/28/test-cases/5664?treeId=58
 test('#5664 Создание стандартного заказа через мессенджер, со сменой ЕИ', 
 { tag: ['@regress'] }, 
async ({page}) => { 
label('tag', 'regress');   
feature('Auth');
function normalizePrice(value: string | null | undefined): string {
      return String(value ?? '').replace(/[^0-9]/g, '');
    }
 const page1 = await createAppeal(page, {
  contactType: "Мессенджер",
  contactValue: "(910)0000056",
});
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
await page1.locator('.ant-notification-notice-close').first().click();

const totalCostBeforeEdit = normalizePrice(
await page1.locator('[data-test="cart-total-cost"]').textContent());
await page1.locator('[data-test="cart-position"]').click();
await page1.locator('[data-test="modal-edit-units"]').click();
await page1.getByText('т. = 20меш.').click();
await expect(page1.locator('[data-test="modal-edit-units"]')).toContainText('т');
await page1.locator('[data-test="save-btn-in-modal-edit-position"]').click();
await expect.poll(async () => {
    return normalizePrice(
    await page1.locator('[data-test="cart-total-cost"]').textContent()
    );}).not.toBe(totalCostBeforeEdit);
const totalCostAfterEdit = normalizePrice(
await page1.locator('[data-test="cart-total-cost"]').textContent());
expect(totalCostAfterEdit).not.toBe(totalCostBeforeEdit);
await page1.locator('[data-test="make-order"]').click();
await expect(page1.getByText('Заказ успешно создан')).toBeVisible();
  
 });

// https://allure.itlabs.io/project/28/test-cases/4584
test('#4584 Создание заказа с нескольких магазинов',
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
  await page1.getByText('БМ Ожогина Садовая 3А').click();
  await page1.getByText('БМ Тмн Московский тракт 5 км').click();
await page1.locator('[data-test="search-input"]').click();
await page1.locator('[data-test="search-input"]').fill('перчатки');
await page1.locator('[data-test="search-button"]').click();
await page1.locator('[data-test="shopping-card-button"]').first().click();
page1.locator('[data-test="add-quantity-input"]').first().click();
await page1.locator('[data-test="add-quantity-input"]').first().fill('1');
await page1.locator('[data-test="add-quantity-input"]').nth(1).click();
await page1.locator('[data-test="add-quantity-input"]').nth(1).fill('1');
await page1.locator('[data-test="add-quantity-input"]').nth(2).click();
await page1.locator('[data-test="add-quantity-input"]').nth(2).fill('1');
await page1.getByRole('button', { name: 'Добавить' }).click();
await page1.locator('[data-test="to-cart-button"]').click();
await page1.locator('[data-test="make-order"]').click();
await expect(page1.getByText('Заказ успешно создан')).toBeVisible();
await expect(page1.getByText('РЦ Тмн, 50 лет Октября, 109 ко')).toBeVisible();
await expect(page1.getByText('БМ Ожогина Садовая 3А')).toBeVisible();
await expect(page1.getByText('БМ Тмн Московский тракт 5 км')).toBeVisible();
await page1.locator('.ant-notification-notice-close').first().click();
await deleteAllPositions(page1);
});


// https://allure.itlabs.io/project/28/test-cases/4584
test('#4875 При создании заказа, где товара несколько штук, корректно считается итог',
{ tag: ['@regress'] }, 
async ({page}) => { 
label('tag', 'regress');   
feature('Auth');
function normalizePrice(value: string | null | undefined): string {
  return String(value ?? '').replace(/[^0-9]/g, '');
}
const page1 = await createAppeal(page);
await page1.locator('[data-test="select-appeal"]').click();
  await page1
  .locator('[data-test="select-appeal"] li')
  .filter({ hasText: 'Новый заказ' })
  .click();
  await page1.locator('.ant-select-selection-overflow').click();
  await page1.getByText('РЦ Тмн, 50 лет Октября, 109 ко').click();
await page1.locator('[data-test="search-input"]').click();
await page1.locator('[data-test="search-input"]').fill('перчатки');
await page1.locator('[data-test="search-button"]').click();
await page1.locator('[data-test="shopping-card-button"]').first().click();
page1.locator('[data-test="add-quantity-input"]').first().click();
await page1.locator('[data-test="add-quantity-input"]').first().fill('3');
// запоминаем значение в инпуте карточки
 const productCardTotal = normalizePrice(
      await page1.locator('[data-test="modal-position-cost"]').textContent()
    );
await page1.getByRole('button', { name: 'Добавить' }).click();
await page1.locator('[data-test="to-cart-button"]').click();
await page1.locator('[data-test="make-order"]').click();
await expect(page1.getByText('Заказ успешно создан')).toBeVisible();
// сверяем его с чеком после сохранения заказа
await expect.poll(async () => {
      return normalizePrice(
        await page1.locator('[data-test="cart-total-cost"]').textContent()
      );
    }).toBe(productCardTotal);

    const cartTotalCost = normalizePrice(
      await page1.locator('[data-test="cart-total-cost"]').textContent()
    );

    expect(cartTotalCost).toBe(productCardTotal);

    await page1.locator('.ant-notification-notice-close').first().click();
    await deleteAllPositions(page1);
await page1.locator('.ant-notification-notice-close').first().click();
await deleteAllPositions(page1);
});


// https://allure.itlabs.io/project/28/test-cases/4608
test('#4608 Создание заказа с отрезным материалом с БМ или МОК',
{ tag: ['@regress'] }, 
async ({page}) => { 
label('tag', 'regress');   
feature('Auth');
function normalizePrice(value: string | null | undefined): string {
  return String(value ?? '').replace(/[^0-9]/g, '');
}
const page1 = await createAppeal(page);
await page1.locator('[data-test="select-appeal"]').click();
  await page1
  .locator('[data-test="select-appeal"] li')
  .filter({ hasText: 'Новый заказ' })
  .click();
  await page1.locator('.ant-select-selection-overflow').click();
  await page1.getByText('БМ Ожогина Садовая 3А').click();
await page1.locator('[data-test="search-input"]').click();
await page1.locator('[data-test="search-input"]').fill('87745');
await page1.locator('[data-test="search-button"]').click();
await page1.locator('[data-test="shopping-card-button"]').first().click();
// запоминаем значение в инпуте карточки
 const productCardTotal = normalizePrice(
      await page1.locator('[data-test="modal-position-cost"]').textContent()
    );
await page1.getByRole('button', { name: 'Добавить' }).click();
await page1.locator('[data-test="to-cart-button"]').click();
await page1.locator('[data-test="make-order"]').click();
await expect(page1.getByText('Заказ успешно создан')).toBeVisible();
// сверяем его с чеком после сохранения заказа
await expect.poll(async () => {
      return normalizePrice(
        await page1.locator('[data-test="cart-total-cost"]').textContent()
      );
    }).toBe(productCardTotal);

    const cartTotalCost = normalizePrice(
      await page1.locator('[data-test="cart-total-cost"]').textContent()
    );

    expect(cartTotalCost).toBe(productCardTotal);

    await page1.locator('.ant-notification-notice-close').first().click();
    await deleteAllPositions(page1);
await page1.locator('.ant-notification-notice-close').first().click();
await deleteAllPositions(page1);
});



// https://allure.itlabs.io/project/28/test-cases/6290
test('#6290 Создание заказа с отрезным материалом с РЦ',
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
await page1.locator('[data-test="search-input"]').fill('геотекстиль');
await page1.locator('[data-test="search-button"]').click();
await page1.locator('[data-test="shopping-card-button"]').first().click();
await page1.locator('[data-test="modal-edit-units"]').click();
await page1.locator('[data-test="unit-PM"]').click();
await page1.getByRole('button', { name: 'Добавить' }).click();
await page1.locator('[data-test="to-cart-button"]').click();
await page1.locator('[data-test="make-order"]').click();
await expect(page1.getByText('Произошла ошибка, заказ не сохранен')).toBeVisible();
await page1.locator('[data-test="cart-position"]').click();
await page1.locator('[data-test="modal-edit-units"]').click();
await page1.locator('[data-test="unit-ROL"]').click();
await page1.locator('[data-test="save-btn-in-modal-edit-position"]').click();
await page1.locator('[data-test="make-order"]').click();
await expect(page1.getByText('Заказ успешно создан')).toBeVisible();
await page1.locator('.ant-notification-notice-close').first().click();
await deleteAllPositions(page1);
});

// https://allure.itlabs.io/project/28/test-cases/5929 
test('#5929 создание заказа с колеровкой, другим товаром',
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
await page1.locator('[data-test="search-input"]').fill('краска');
await page1.locator('[data-test="search-button"]').click();
await page1.locator('[data-test="shopping-card-button"]').first().click();
await page1.getByRole('button', { name: 'Добавить' }).click();
await page1.locator('[data-test="to-cart-button"]').click();
await page1.locator('[data-test="make-order"]').click();
await expect(page1.getByText('Заказ успешно создан')).toBeVisible();
await page1.locator('.ant-notification-notice-close').first().click();
await page1.locator('[data-icon="format-painter"]').click();
    await addColoring(page1, 'TVT Y356');
    await expect(page1.getByText('Услуга успешно добавлена')).toBeVisible();
await page1.locator('[data-test="btn-go-in-search"]').click();
await page1.locator('[data-test="search-input"]').click();
await page1.locator('[data-test="search-input"]').fill('кисть');
await page1.locator('[data-test="search-button"]').click();
await page1.locator('[data-test="shopping-card-button"]').first().click();
await page1.getByRole('button', { name: 'Добавить' }).click();
await page1.locator('[data-test="to-cart-button"]').click();
await page1.locator('[data-test="save-order"]').click();
await expect(page1.getByText('Успешно сохранено')).toBeVisible();
await expect(page1.getByText('TVT Y356')).toBeVisible();
await deleteAllPositions(page1);
});

// https://allure.itlabs.io/project/28/test-cases/7345?treeId=58
test('#5927 создание и изменение в заказе с несколькими колеровками',
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
await page1.locator('[data-test="search-input"]').fill('краска');
await page1.locator('[data-test="search-button"]').click();
await page1.locator('[data-test="shopping-card-button"]').first().click();
await page1.getByRole('button', { name: 'Добавить' }).click();
await page1.locator('[data-test="shopping-card-button"]').nth(2).click();
await page1.getByRole('button', { name: 'Добавить' }).click();
await page1.locator('[data-test="to-cart-button"]').click();
await page1.locator('[data-test="make-order"]').click();
await page1.locator('.ant-notification-notice-close').first().click();
await expect(page1.getByText('Заказ успешно создан')).toBeVisible();
await page1.locator('.ant-notification-notice-close').first().click();

await page1.locator('[data-icon="format-painter"]').first().click();
    await addColoring(page1, 'TVT Y356');
    await expect(page1.getByText('Услуга успешно добавлена')).toBeVisible();

    await page1.locator('[data-icon="format-painter"]').nth(0).click();
    await addColoring(page1, 'BM OC-46');
   await expect(page1.getByText('TVT Y356')).toBeVisible();
await expect(page1.getByText('BM OC-46')).toBeVisible();
await expect(page1.locator('.ant-spin-spinning')).toHaveCount(0);
await page1.locator('[data-icon="format-painter"]').nth(0).click();
await page1.getByRole('textbox', { name: 'Код', exact: true }).click();
await page1.getByRole('textbox', { name: 'Код', exact: true }).fill('TVT K441');
await page1.locator('[data-test="colors-item"]').click();
await page1.getByRole('button', { name: 'Сохранить', exact: true }).click();
});