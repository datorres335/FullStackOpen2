const { test, describe, expect, beforeEach } = require('@playwright/test')

describe('Blog app', () => {
  beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173')
  })

  test('front page can be opened', async ({ page }) => {
    const locator = await page.getByText('blogs')
    await expect(locator).toBeVisible()
    await expect(page.getByText('blogs')).toBeVisible()
  })

  test('login form can be opened', async ({ page }) => {
    await page.getByRole('button', { name : 'login' }).click()

    await page.getByTestId('username').fill('userFromRest2')
    await page.getByTestId('password').fill('password1234')
    await page.getByRole('button', { name: 'login' }).click()
    
    await expect(page.getByText('logged in')).toBeVisible()
  })
})