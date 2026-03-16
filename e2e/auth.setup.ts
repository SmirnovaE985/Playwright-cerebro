import { test as setup } from '@playwright/test';

const authFile = 'playwright/.auth/user.json';

setup('login and save auth state', async ({ page }) => {
  const login = process.env.USER_LOGIN;
  const password = process.env.USER_PASSWORD;

  if (!login || !password) {
    throw new Error('USER_LOGIN или USER_PASSWORD не заданы в .env');
  }

  await page.goto('/');
  await page.locator('input[name="login"]').fill(login);
  await page.locator('input[name="password"]').fill(password);
  await page.getByRole('button', { name: 'Войти' }).click();

  await page.context().storageState({ path: authFile });
});