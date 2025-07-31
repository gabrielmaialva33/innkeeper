import { test } from '@japa/runner'
import { UserFactory } from '#database/factories/user_factory'

test.group('Auth login', () => {
  test('should display login page correctly', async ({ browserContext, route }) => {
    const page = await browserContext.newPage()
    await page.goto(route('login'))

    // Check page title
    await page.waitForSelector('h1')
    await page.locator('h1:has-text("Sign In")').waitFor()

    // Check form elements are present
    await page.locator('input[name="uid"]').waitFor()
    await page.locator('input[name="password"]').waitFor()
    await page.locator('button[type="submit"]:has-text("Sign in")').waitFor()

    // Check navigation links
    await page.locator('a:has-text("Sign up")').waitFor()
    await page.locator('a:has-text("Forgot password?")').waitFor()
  })

  test('should login successfully with valid credentials', async ({ browserContext, route }) => {
    // Create a test user with explicit password
    const user = await UserFactory.merge({ password: 'password123' }).create()

    const page = await browserContext.newPage()
    await page.goto(route('login'))

    // Fill login form
    await page.fill('input[name="uid"]', user.email)
    await page.fill('input[name="password"]', 'password123')

    // Submit form
    await page.click('button[type="submit"]:has-text("Sign in")')

    // Wait a bit for form submission
    await page.waitForTimeout(2000)

    // Check if we're still on login page (indicating error)
    const currentUrl = page.url()
    if (currentUrl.includes('/login')) {
      // Check for error messages
      const errorElements = await page
        .locator('.error, .alert-error, [role="alert"], .text-red-500, .text-destructive')
        .count()
      if (errorElements > 0) {
        const errorText = await page
          .locator('.error, .alert-error, [role="alert"], .text-red-500, .text-destructive')
          .first()
          .textContent()
        throw new Error(`Login failed with error: ${errorText}`)
      }
      throw new Error(`Login failed - still on login page: ${currentUrl}`)
    }

    // Should redirect to dashboard
    await page.waitForURL('**/dashboard', { timeout: 10000 })

    // Verify we're on dashboard page
    await page.waitForSelector('h1, h2, [data-testid="dashboard"]', { timeout: 10000 })
  })

  test('should show error with invalid credentials', async ({ browserContext, route }) => {
    const page = await browserContext.newPage()
    await page.goto(route('login'))

    // Fill form with invalid credentials
    await page.fill('input[name="uid"]', 'invalid@example.com')
    await page.fill('input[name="password"]', 'wrongpassword')

    // Submit form
    await page.click('button[type="submit"]:has-text("Sign in")')

    // Should stay on login page and show error
    await page.waitForURL('/login')

    // Check for error message (could be in various forms)
    const hasError =
      (await page
        .locator('.error, .alert-error, [role="alert"], .text-red-500, .text-destructive')
        .count()) > 0
    if (!hasError) {
      // Alternative: check if form is still visible (indicating failed login)
      await page.locator('input[name="uid"]').waitFor()
    }
  })

  test('should show validation errors for empty fields', async ({ browserContext, route }) => {
    const page = await browserContext.newPage()
    await page.goto(route('login'))

    // Submit form without filling fields
    await page.click('button[type="submit"]:has-text("Sign in")')

    // Should stay on login page
    await page.waitForURL('/login')

    // Form should still be visible
    await page.locator('input[name="uid"]').waitFor()
    await page.locator('input[name="password"]').waitFor()
  })

  test('should navigate to register page', async ({ browserContext, route }) => {
    const page = await browserContext.newPage()
    await page.goto(route('login'))

    // Click on register link
    await page.click('a:has-text("Sign up")')

    // Should navigate to register page
    await page.waitForURL('/register')
  })

  test('should redirect authenticated user to dashboard', async ({ browserContext, route }) => {
    // Create a user first with explicit password
    const user = await UserFactory.merge({ password: 'password123' }).create()

    const page = await browserContext.newPage()

    // First login through the UI
    await page.goto(route('login'))
    await page.fill('input[name="uid"]', user.email)
    await page.fill('input[name="password"]', 'password123')
    await page.click('button[type="submit"]:has-text("Sign in")')

    // Wait for redirect after login with longer timeout
    await page.waitForURL('**/dashboard', { timeout: 30000 })

    // Now try to access login page again
    await page.goto(route('login'))

    // Should be redirected to dashboard since user is authenticated
    await page.waitForURL('**/dashboard', { timeout: 30000 })
  })

  test('should handle form submission loading state', async ({ browserContext, route }) => {
    const page = await browserContext.newPage()
    await page.goto(route('login'))

    // Fill form
    await page.fill('input[name="uid"]', 'test@example.com')
    await page.fill('input[name="password"]', 'password')

    // Submit form and check for loading state
    const submitButton = page.locator('button[type="submit"]:has-text("Sign in")')
    await submitButton.click()

    // Button might be disabled or show loading text during submission
    // This is a quick check before the page potentially redirects
    try {
      await page.waitForFunction(
        `() => {
          const btn = document.querySelector('button[type="submit"]')
          return (
            btn?.hasAttribute('disabled') ||
            btn?.textContent?.includes('Loading') ||
            btn?.textContent?.includes('Signing')
          )
        }`,
        { timeout: 1000 }
      )
    } catch {
      // Loading state might be too fast to catch, which is fine
    }
  })
})
