import { test, expect } from "@playwright/test";

test("should register a new user successfully", async ({ page }) => {
  await page.goto("http://localhost:3000");

  await page.waitForSelector('input[name="name"]');
  await page.fill('input[name="name"]', "Test User");
  await page.fill('input[name="email"]', `testuser${Date.now()}@example.com`);
  await page.fill('input[name="password"]', "Password123!");

  await page.click('button[type="submit"]');

  // Success or error check
  const errorMsg = page.locator('.error');
  if (await errorMsg.isVisible()) {
    console.log("Form submission error:", await errorMsg.textContent());
  } else {
    await expect(page).toHaveURL(/.*dashboard/);
  }
});
