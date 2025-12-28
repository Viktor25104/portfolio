import { test, expect } from '@playwright/test';

test('locale switching updates html lang and canonical', async ({ page }) => {
  await page.goto('/en');
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');

  const canonicalEn = page.locator('link[rel="canonical"]');
  await expect(canonicalEn).toHaveAttribute('href', /\/en$/);

  await page.goto('/ru');
  await expect(page.locator('html')).toHaveAttribute('lang', 'ru');

  const canonicalRu = page.locator('link[rel="canonical"]');
  await expect(canonicalRu).toHaveAttribute('href', /\/ru$/);
});
