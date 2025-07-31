import { describe, it, expect, beforeAll, afterEach, afterAll } from 'vitest'
import { server } from '../mocks/server'
import { http, HttpResponse } from 'msw'
import { AuthService } from '~/services/auth_service'

describe('AuthService', () => {
  // Setup and teardown for MSW
  beforeAll(() => server.listen())
  afterEach(() => server.resetHandlers())
  afterAll(() => server.close())

  describe('signIn', () => {
    it('should sign in successfully with valid credentials', async () => {
      const credentials = {
        uid: 'test@example.com',
        password: 'password123',
      }

      const result = await AuthService.signIn(credentials)

      expect(result).toHaveProperty('user')
      expect(result).toHaveProperty('token')
      expect(result.user.email).toBe('test@example.com')
    })

    it('should throw an error with invalid credentials', async () => {
      const credentials = {
        uid: 'wrong@example.com',
        password: 'wrongpassword',
      }

      await expect(AuthService.signIn(credentials)).rejects.toThrow('Invalid credentials')
    })

    it('should handle server errors', async () => {
      // Override the handler for this specific test
      server.use(
        http.post('/api/v1/sessions/sign-in', () => {
          return new HttpResponse(null, { status: 500 })
        })
      )

      const credentials = {
        uid: 'test@example.com',
        password: 'password123',
      }

      await expect(AuthService.signIn(credentials)).rejects.toThrow()
    })
  })

  describe('signUp', () => {
    it('should register a new user successfully', async () => {
      const userData = {
        full_name: 'New User',
        email: 'newuser@example.com',
        password: 'password123',
        password_confirmation: 'password123',
      }

      const result = await AuthService.signUp(userData)

      expect(result).toHaveProperty('user')
      expect(result).toHaveProperty('message')
      expect(result.user.email).toBe('newuser@example.com')
      expect(result.user.full_name).toBe('New User')
    })

    it('should throw an error with missing required fields', async () => {
      const userData = {
        full_name: '',
        email: '',
        password: 'password123',
        password_confirmation: 'password123',
      }

      await expect(AuthService.signUp(userData)).rejects.toThrow()
    })
  })

  describe('signOut', () => {
    it('should sign out successfully', async () => {
      const result = await AuthService.signOut()

      expect(result).toHaveProperty('message')
      expect(result.message).toBe('Logged out successfully')
    })

    it('should handle sign out errors', async () => {
      // Override the handler for this specific test
      server.use(
        http.post('/api/v1/sessions/sign-out', () => {
          return new HttpResponse(
            JSON.stringify({
              message: 'Error signing out',
            }),
            { status: 500 }
          )
        })
      )

      await expect(AuthService.signOut()).rejects.toThrow()
    })
  })
})
