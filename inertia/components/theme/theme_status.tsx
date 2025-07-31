import { Monitor, Moon, Sun } from 'lucide-react'
import { useTheme } from '~/hooks/use_theme'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '~/components/ui/core/card'
import { Badge } from '~/components/ui/core/badge'

export function ThemeStatus() {
  const { theme, systemTheme, resolvedTheme, isSystem, mounted } = useTheme()

  if (!mounted) {
    return null // Prevents incorrect content flash
  }

  const getThemeIcon = (themeName: string | undefined) => {
    switch (themeName) {
      case 'light':
        return <Sun className="h-4 w-4" />
      case 'dark':
        return <Moon className="h-4 w-4" />
      default:
        return <Monitor className="h-4 w-4" />
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Theme Status
          {getThemeIcon(resolvedTheme)}
        </CardTitle>
        <CardDescription>Current theme configuration and system preferences</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Selected Theme:</p>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="secondary" className="capitalize">
                {theme}
              </Badge>
              {isSystem && <span className="text-xs text-muted-foreground">(auto)</span>}
            </div>
          </div>

          <div>
            <p className="text-muted-foreground">Active Theme:</p>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="default" className="capitalize">
                {resolvedTheme}
              </Badge>
            </div>
          </div>

          <div>
            <p className="text-muted-foreground">System Preference:</p>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="outline" className="capitalize">
                {systemTheme || 'unknown'}
              </Badge>
            </div>
          </div>

          <div>
            <p className="text-muted-foreground">Detection Mode:</p>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant={isSystem ? 'default' : 'secondary'}>
                {isSystem ? 'Automatic' : 'Manual'}
              </Badge>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t">
          <p className="text-xs text-muted-foreground">
            {isSystem
              ? 'Theme automatically adjusts based on your system preferences. The app will switch between light and dark modes when your operating system theme changes.'
              : `Theme is manually set to ${theme} mode. It will not change with system preferences.`}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
