const { test, describe, expect, beforeEach } = require('@playwright/test')
const { loginWith, createBlog } = require('./helper')

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
    await request.post('http://localhost:3003/api/users', {
      data: {
        username: 'userFromRest4',
        name : 'User From Rest 4',
        password: 'password1234'
      }
    })

    await page.goto('/')
  })

  test('front page can be opened', async ({ page }) => {
    const locator = await page.getByText('blogs')
    await expect(locator).toBeVisible()
    await expect(page.getByText('blogs')).toBeVisible()
  })

  test('login form can be opened', async ({ page }) => {
    await loginWith(page, 'userFromRest3', 'password1234')
    
    await expect(page.getByText('logged in')).toBeVisible()
  })

  test('login fails with wrong password', async ({ page }) => {
    await loginWith(page, 'userFromRest3', 'wrongpassword')

    const message = page.locator('.message')
    await expect(message).toContainText('Wrong username or password')
    await expect(message).toHaveCSS('border-style', 'solid')
    await expect(message).toHaveCSS('color', 'rgb(255, 0, 0)') //Colors must be defined to Playwright as rgb codes.

    await expect(page.getByText(/logged in/)).not.toBeVisible()
  })

  describe('when logged in', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, 'userFromRest3', 'password1234')
    })

    test('a new blog can be created', async ({ page }) => {
      await createBlog(page, 'test blog', 'test author', 'https://testblog.com')

      await expect(page.getByTestId('hideWhenVisible')).toBeVisible()
    })

    describe('and several blogs exists', () => {
      beforeEach(async ({ page }) => {
        await createBlog(page, 'another blog exists', 'another test author', 'https://anothertestblog.com')
        await createBlog(page, 'yet another blog exists', 'yet another test author', 'https://yetanothertestblog.com')
        await createBlog(page, '3rd blog exists', '3rd test author', 'https://3rdtestblog.com')
      })

      test('blog can be liked', async ({ page }) => {
        //await page.pause() //Pauses the test execution and opens Playwright Inspector, allowing you to interactively debug and inspect the state of your application at that point in the test.
        const blogElement = page.locator('.blog').filter({ hasText: 'yet another blog exists' })
        await blogElement.getByRole('button', { name: 'view' }).click()
        await blogElement.getByRole('button', { name: 'like' }).click()
        await expect(blogElement.getByText('likes 1')).toBeVisible()
      })

      test('blog can be removed by user who created it', async ({ page }) => {
        const blogElement = page.locator('.blog').filter({ hasText: 'yet another blog exists' })
        await blogElement.getByRole('button', { name: 'view' }).click()

        page.on('dialog', async dialog => {
          expect(dialog.type()).toBe('confirm')
          expect(dialog.message()).toBe('Remove blog: yet another blog exists?')
          await dialog.accept()
        })

        await blogElement.getByRole('button', { name: 'remove' }).click()
        
        await expect(blogElement).not.toBeVisible()
      })

      test('other users cannot see remove button', async ({ page }) => {
        await page.getByRole('button', { name: 'logout' }).click()
        await page.getByRole('button', { name: 'login' }).click()
        await page.getByTestId('username').fill('userFromRest4')
        await page.getByTestId('password').fill('password1234')
        await page.getByRole('button', { name: 'login' }).click()

        const blogElement = page.locator('.blog').filter({ hasText: 'yet another blog exists' })
        await blogElement.getByRole('button', { name: 'view' }).click()
        await expect(blogElement.getByRole('button', { name: 'remove' })).not.toBeVisible()
      })

      test('blogs are ordered according to likes with the blog with the most likes being first', async ({ page }) => {
        const blog1 = page.locator('.blog').filter({ hasText: /^another blog exists/ }) // ^ means "starts with"
        const blog2 = page.locator('.blog').filter({ hasText: /^yet another blog exists/ })
        const blog3 = page.locator('.blog').filter({ hasText: /^3rd blog exists/ })

        await blog1.getByRole('button', { name: 'view' }).click()
        await blog2.getByRole('button', { name: 'view' }).click()
        await blog3.getByRole('button', { name: 'view' }).click()

        await blog1.getByRole('button', { name: 'like' }).click()
        await expect(blog1.getByText('likes 1')).toBeVisible() // must add an await after every click to ensure UI updates before next click
        await blog1.getByRole('button', { name: 'like' }).click()
        await expect(blog1.getByText('likes 2')).toBeVisible()

        await blog2.getByRole('button', { name: 'like' }).click()
        await expect(blog2.getByText('likes 1')).toBeVisible()
        await blog2.getByRole('button', { name: 'like' }).click()
        await expect(blog2.getByText('likes 2')).toBeVisible()
        await blog2.getByRole('button', { name: 'like' }).click()
        await expect(blog2.getByText('likes 3')).toBeVisible()

        await blog3.getByRole('button', { name: 'like' }).click()
        await expect(blog3.getByText('likes 1')).toBeVisible()

        const allBlogs = page.locator('.blog')
        await expect(allBlogs.nth(0)).toContainText('yet another blog exists')
        await expect(allBlogs.nth(1)).toContainText('another blog exists')
        await expect(allBlogs.nth(2)).toContainText('3rd blog exists')
      })
    })
  })
})