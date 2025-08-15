const { test, describe, expect } = require('@playwright/test') //, beforeEach

describe('Pokedex', () => {
  test('front page can be opened', async ({ page }) => {
    await page.goto('http://localhost:8081')
    await expect(page.getByText('ivysaur')).toBeVisible()
    await expect(page.getByText('Pokémon and Pokémon character names are trademarks of Nintendo.')).toBeVisible()
  })
})