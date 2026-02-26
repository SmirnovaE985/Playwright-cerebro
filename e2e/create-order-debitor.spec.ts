// #5000 Заказ на дебитора физ.лицо и перс.цены
// #4999 Заказ на дебитора юр.лицо и перс.цены


import { test, expect } from '@playwright/test';
import { createAppeal } from '../helpers/commands';
import { deleteAllPositions } from '../helpers/commands';
import { createOrder } from '../helpers/commands';
import { createOrderCheckPromo } from '../helpers/commands';
import { label, feature } from 'allure-js-commons';

// https://allure.itlabs.io/project/28/test-cases/5000?treeId=58
test('#5000 Заказ на дебитора физ.лицо и перс.цены', 
  { tag: ['@regress'] }, 
  async ({ page }) => {
  label('tag', 'regress');   
  feature('Auth');
const page1 = await createOrderCheckPromo(page, {
    searchText: 'песок',
    makeOrder: true,
beforeMakeOrder: async (page1) => {
    await page1.locator('[data-test=client-type-input]').click();
    await page1.locator('[data-test=client-type-input]').fill('94822');
    await page1.locator('[title="Дюкова И.Н."]').click();
  },
});
});


// https://allure.itlabs.io/project/28/test-cases/4999?treeId=58
test('#4999 Заказ на дебитора юр.лицо и перс.цены',
  { tag: ['@regress'] },
  async ({ page }) => {
  label('tag', 'regress');   
  feature('Auth');
const page1 = await createOrderCheckPromo(page, {
    searchText: 'кисть',
    makeOrder: true,
beforeMakeOrder: async (page1) => {
    await page1.locator('[data-test=client-type-input]').click();
    await page1.locator('[data-test=client-type-input]').fill('213370');
    
  },
});
});