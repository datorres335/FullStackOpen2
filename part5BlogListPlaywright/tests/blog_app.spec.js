const { test, describe, expect, beforeEach } = require('@playwright/test')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:3003/api/testing/reset')
    await request.post('http://localhost:3003/api/users', {
      data: {
        username: 'userFromRest3',
        name : 'User From Rest 3',
        password: 'password1234'
      }
    })

    await page.goto('http://localhost:5173')
  })

  test('front page can be opened', async ({ page }) => {
    const locator = await page.getByText('blogs')
    await expect(locator).toBeVisible()
    await expect(page.getByText('blogs')).toBeVisible()
  })

  test('login form can be opened', async ({ page }) => {
    await page.getByRole('button', { name : 'login' }).click()

    await page.getByTestId('username').fill('userFromRest3')
    await page.getByTestId('password').fill('password1234')
    await page.getByRole('button', { name: 'login' }).click()
    
    await expect(page.getByText('logged in')).toBeVisible()
  })

  describe('when logged in', () => {
    beforeEach(async ({ page }) => {
      await page.getByRole('button', { name: 'login' }).click()
      await page.getByTestId('username').fill('userFromRest3')
      await page.getByTestId('password').fill('password1234')
      await page.getByRole('button', { name: 'login' }).click()
    })

    test('a new blog can be created', async ({ page }) => {
      await page.getByRole('button', { name: 'new blog' }).click()
      await page.getByTestId('title').fill("test blog")
      await page.getByTestId('author').fill('test author')
      await page.getByTestId('url').fill('https://testblog.com')
      await page.getByRole('button', { name: 'create' }).click()

      await expect(page.getByTestId('hideWhenVisible')).toBeVisible()
    })

    describe('and a blog exists', () => {
      beforeEach(async ({ page }) => {
        await page.getByRole('button', { name: 'new blog' }).click()
        await page.getByTestId('title').fill('another blg exists')
        await page.getByTestId('author').fill('another author')
        await page.getByTestId('url').fill('https://anotherblog.com')
        await page.getByRole('button', { name: 'create' }).click()
      })

      test('blog can be liked', async ({ page }) => {
        await page.getByRole('button', { name: 'view' }).click()
        await page.getByRole('button', { name: 'like' }).click()
        await expect(page.getByText('likes 1')).toBeVisible()
      })
    })
  })
})