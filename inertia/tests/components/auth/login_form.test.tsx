import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen } from '@testing-library/react'
import { LoginForm } from '~/components/auth/LoginForm'
import { render } from '~/tests/test_utils'

// Mock the inertia useForm hook
vi.mock('@inertiajs/react', () => {
  const mockPost = vi.fn()
  return {
    useForm: vi.fn(() => ({
      data: { uid: '', password: '' },
      setData: vi.fn((field, value) => {}),
      post: mockPost,
      processing: false,
      errors: {},
    })),
    Link: ({ href, children, className }: any) => (
      <a href={href} className={className}>
        {children}
      </a>
    ),
  }
})

describe('LoginForm', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    vi.clearAllMocks()
  })

  it('renders the login form with all fields', () => {
    render(<LoginForm />)

    // Check if form elements are rendered
    expect(screen.getByLabelText(/Email or Username/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Sign in/i })).toBeInTheDocument()
    expect(screen.getByText(/Forgot password\?/i)).toBeInTheDocument()
  })

  it('allows entering credentials', async () => {
    const { user } = render(<LoginForm />)

    // Get form elements
    const emailInput = screen.getByLabelText(/Email or Username/i)
    const passwordInput = screen.getByLabelText(/Password/i)

    // Type in credentials
    await user.type(emailInput, 'test@example.com')
    await user.type(passwordInput, 'password123')

    // Check if inputs have the entered values
    expect(emailInput).toHaveValue('test@example.com')
    expect(passwordInput).toHaveValue('password123')
  })

  it('submits the form when the sign in button is clicked', async () => {
    // Get the mocked post function
    const mockPost = vi.mocked(vi.mocked(vi.importMock('@inertiajs/react')).useForm().post)

    const { user } = render(<LoginForm />)

    // Click the submit button
    await user.click(screen.getByRole('button', { name: /Sign in/i }))

    // Check if the form was submitted
    expect(mockPost).toHaveBeenCalledWith('/login')
  })

  it('shows the forgot password link', async () => {
    render(<LoginForm />)

    // Check if the forgot password link is rendered and has the correct href
    const forgotPasswordLink = screen.getByText(/Forgot password\?/i)
    expect(forgotPasswordLink).toBeInTheDocument()
    expect(forgotPasswordLink.closest('a')).toHaveAttribute('href', '/forgot-password')
  })
})
