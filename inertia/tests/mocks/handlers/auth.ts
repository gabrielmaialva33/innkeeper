import { http, HttpResponse } from 'msw'

export const authHandlers = [
  // Mock login endpoint
  http.post('/api/v1/sessions/sign-in', async ({ request }) => {
    const body = await request.json()

    // Validate credentials
    if (body.uid === 'test@example.com' && body.password === 'password123') {
      return HttpResponse.json({
        user: {
          id: 1,
          email: 'test@example.com',
          full_name: 'Test User',
          avatar_url: null,
          created_at: '2023-01-01T00:00:00.000Z',
          updated_at: '2023-01-01T00:00:00.000Z',
        },
        token: 'mock-jwt-token',
      })
    }

    // Return error for invalid credentials
    return new HttpResponse(
      JSON.stringify({
        message: 'Invalid credentials',
        errors: [
          {
            message: 'Invalid credentials',
          },
        ],
      }),
      {
        status: 401,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
  }),

  // Mock register endpoint
  http.post('/api/v1/sessions/sign-up', async ({ request }) => {
    const body = await request.json()

    // Validate required fields
    if (!body.email || !body.password || !body.full_name) {
      return new HttpResponse(
        JSON.stringify({
          message: 'Validation failed',
          errors: [
            {
              message: 'All fields are required',
            },
          ],
        }),
        {
          status: 422,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
    }

    // Return success response
    return HttpResponse.json({
      user: {
        id: 2,
        email: body.email,
        full_name: body.full_name,
        avatar_url: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      message: 'User registered successfully',
    })
  }),

  // Mock logout endpoint
  http.post('/api/v1/sessions/sign-out', () => {
    return HttpResponse.json({
      message: 'Logged out successfully',
    })
  }),
]
