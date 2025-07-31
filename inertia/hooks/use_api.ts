import { useCallback, useState } from 'react'
import { ApiClient, ApiError } from '~/utils/api'

// Create a single, shared instance of the API client.
const apiClient = new ApiClient()

export function useApi() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<ApiError | null>(null)

  const request = useCallback(async <T>(requestFn: () => Promise<T>): Promise<T | null> => {
    setLoading(true)
    setError(null)

    try {
      const result = await requestFn()
      return result
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err)
      } else {
        setError(new ApiError({ errors: [{ message: 'An unexpected error occurred' }] }, 500))
      }
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    client: apiClient,
    loading,
    error,
    request,
    clearError: () => setError(null),
  }
}
