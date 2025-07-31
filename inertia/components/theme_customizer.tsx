import { Paintbrush } from 'lucide-react'
import { Button } from '~/components/ui/core/button'
import { Popover, PopoverContent, PopoverTrigger } from '~/components/ui/core/popover'
import { Label } from '~/components/ui/core/label'
import { useThemeConfig, type ThemeColor, type ThemeRadius } from '~/hooks/use_theme_config'
import { cn } from '~/utils/cn'

export function ThemeCustomizer() {
  const { config, setColor, setRadius, availableColors, availableRadius } = useThemeConfig()

  const colorLabels: Record<ThemeColor, string> = {
    blue: 'Blue',
    green: 'Green',
    purple: 'Purple',
    red: 'Red',
    orange: 'Orange',
    pink: 'Pink',
    teal: 'Teal',
    indigo: 'Indigo',
  }

  const radiusLabels: Record<ThemeRadius, string> = {
    none: 'None',
    sm: 'Small',
    md: 'Medium',
    lg: 'Large',
    xl: 'Extra Large',
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon" className="fixed bottom-4 right-4 z-50 shadow-lg">
          <Paintbrush className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80">
        <div className="space-y-4">
          <div>
            <h4 className="font-medium leading-none mb-3">Customize Theme</h4>
          </div>

          {/* Color Selection */}
          <div className="space-y-2">
            <Label>Color</Label>
            <div className="grid grid-cols-4 gap-2">
              {availableColors.map((color) => (
                <button
                  key={color}
                  onClick={() => setColor(color)}
                  className={cn(
                    'h-8 w-full rounded-md border-2 transition-all',
                    config.color === color ? 'border-foreground shadow-sm' : 'border-transparent'
                  )}
                  style={{
                    backgroundColor: `hsl(${
                      color === 'blue'
                        ? '217 91% 60%'
                        : color === 'green'
                          ? '142 76% 36%'
                          : color === 'purple'
                            ? '271 91% 65%'
                            : color === 'red'
                              ? '0 84% 60%'
                              : color === 'orange'
                                ? '25 95% 53%'
                                : color === 'pink'
                                  ? '340 82% 52%'
                                  : color === 'teal'
                                    ? '174 72% 56%'
                                    : '243 75% 59%'
                    })`,
                  }}
                  title={colorLabels[color]}
                />
              ))}
            </div>
          </div>

          {/* Radius Selection */}
          <div className="space-y-2">
            <Label>Radius</Label>
            <div className="grid grid-cols-3 gap-2">
              {availableRadius.map((radius) => (
                <Button
                  key={radius}
                  variant={config.radius === radius ? 'secondary' : 'outline'}
                  size="sm"
                  onClick={() => setRadius(radius)}
                  className="h-8"
                >
                  {radiusLabels[radius]}
                </Button>
              ))}
            </div>
          </div>

          {/* Preview */}
          <div className="space-y-2 pt-4 border-t">
            <Label>Preview</Label>
            <div className="space-y-2">
              <Button className="w-full">Primary Button</Button>
              <div className="flex gap-2">
                <Button variant="secondary" size="sm">
                  Secondary
                </Button>
                <Button variant="outline" size="sm">
                  Outline
                </Button>
                <Button variant="ghost" size="sm">
                  Ghost
                </Button>
              </div>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
