import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen } from '@testing-library/react'
import { ThemeToggle } from '~/components/theme/theme_toggle'
import { render } from '~/tests/test_utils'

// Mock the useTheme hook
vi.mock('~/hooks/use_theme', () => ({
  useTheme: vi.fn(() => ({
    theme: 'light',
    setTheme: vi.fn(),
    systemTheme: 'light',
    themes: ['light', 'dark', 'system'],
    isDark: false,
    isLight: true,
    toggle: vi.fn(),
  })),
}))

// Mock the radix-ui dropdown menu
vi.mock('@radix-ui/react-dropdown-menu', () => ({
  DropdownMenu: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="dropdown-menu">{children}</div>
  ),
  DropdownMenuTrigger: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="dropdown-trigger">{children}</div>
  ),
  DropdownMenuContent: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="dropdown-content">{children}</div>
  ),
  DropdownMenuItem: ({
    children,
    onClick,
  }: {
    children: React.ReactNode
    onClick?: () => void
  }) => (
    <button data-testid="dropdown-item" onClick={onClick}>
      {children}
    </button>
  ),
}))

describe('ThemeToggle', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    vi.clearAllMocks()
  })

  it('renders the theme toggle button', () => {
    render(<ThemeToggle />)

    // Check if the button is rendered
    expect(screen.getByTestId('dropdown-trigger')).toBeInTheDocument()
    expect(screen.getByText('Toggle theme')).toBeInTheDocument()
  })

  it('renders the theme options when clicked', async () => {
    const { user } = render(<ThemeToggle />)

    // Click the theme toggle button
    await user.click(screen.getByTestId('dropdown-trigger'))

    // Check if the dropdown content is rendered with theme options
    expect(screen.getByTestId('dropdown-content')).toBeInTheDocument()
    expect(screen.getAllByTestId('dropdown-item')).toHaveLength(3)
    expect(screen.getByText('Light')).toBeInTheDocument()
    expect(screen.getByText('Dark')).toBeInTheDocument()
    expect(screen.getByText('System')).toBeInTheDocument()
  })
})
