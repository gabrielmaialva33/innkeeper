import { router } from '@inertiajs/react'
import type { ApiErrorResponse } from '~/types'

export class ApiClient {
  private baseURL = import.meta.env.VITE_API_URL || '/api/v1'

  private getToken(): string | null {
    return localStorage.getItem('auth_token')
  }

  private async request<T>(path: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseURL}${path}`
    const token = this.getToken()

    const headers = new Headers({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...options.headers,
    })

    if (token) {
      headers.set('Authorization', `Bearer ${token}`)
    }

    const response = await fetch(url, {
      ...options,
      headers,
    })

    if (!response.ok) {
      if (response.status === 401) {
        localStorage.removeItem('auth_token')
        router.visit('/login')
      }
      const error = (await response.json()) as ApiErrorResponse
      throw new ApiError(error, response.status)
    }

    return response.json()
  }

  async get<T>(path: string): Promise<T> {
    return this.request<T>(path, { method: 'GET' })
  }

  async post<T>(path: string, data?: any): Promise<T> {
    return this.request<T>(path, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async put<T>(path: string, data?: any): Promise<T> {
    return this.request<T>(path, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async delete<T>(path: string): Promise<T> {
    return this.request<T>(path, { method: 'DELETE' })
  }

  async upload<T>(path: string, file: File): Promise<T> {
    const formData = new FormData()
    formData.append('file', file)
    const token = this.getToken()

    const headers = new Headers({
      Accept: 'application/json',
    })

    if (token) {
      headers.set('Authorization', `Bearer ${token}`)
    }

    const response = await fetch(`${this.baseURL}${path}`, {
      method: 'POST',
      headers,
      body: formData,
    })

    if (!response.ok) {
      if (response.status === 401) {
        localStorage.removeItem('auth_token')
        router.visit('/login')
      }
      const error = (await response.json()) as ApiErrorResponse
      throw new ApiError(error, response.status)
    }

    return response.json()
  }
}

export class ApiError extends Error {
  constructor(
    public response: ApiErrorResponse,
    public status: number
  ) {
    super(response.errors[0]?.message || 'An error occurred')
    this.name = 'ApiError'
  }

  getFieldErrors(): Record<string, string> {
    const fieldErrors: Record<string, string> = {}
    this.response.errors.forEach((error) => {
      if (error.field) {
        fieldErrors[error.field] = error.message
      }
    })
    return fieldErrors
  }
}
