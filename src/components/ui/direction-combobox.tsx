import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { type Direction } from "@/components/dashboard/TrafficLight"

// Opzioni preconfigurate per le direzioni
const DEFAULT_DIRECTION_OPTIONS: Array<{
  value: Direction;
  label: string;
  color: string;
}> = [
  {
    value: 'default',
    label: 'Default',
    color: 'primary'
  },
  {
    value: 'caerano',
    label: 'Direzione Caerano',
    color: 'chart-1'
  },
  {
    value: 'monte',
    label: 'Direzione Monte',
    color: 'chart-2'
  },
  {
    value: 'ospedale',
    label: 'Direzione Ospedale',
    color: 'chart-3'
  },
  {
    value: 'ospedaleVecchio',
    label: 'Direzione Ospedale Vecchio',
    color: 'chart-4'
  }
]

interface DirectionComboboxProps {
  value: Direction
  onValueChange: (value: Direction) => void
  placeholder?: string
  buttonClassName?: string
  dropdownClassName?: string
  options?: Array<{
    value: Direction
    label: string
    color?: string
  }>
}

export function DirectionCombobox({ 
  value, 
  onValueChange,
  placeholder = "Seleziona direzione",
  buttonClassName,
  dropdownClassName,
  options = DEFAULT_DIRECTION_OPTIONS
}: DirectionComboboxProps) {
  const [open, setOpen] = React.useState(false)
  const selectedOption = React.useMemo(() => 
    options.find((option) => option.value === value), 
    [options, value]
  );
  
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-full justify-between z-50 transition-all duration-300 hover:scale-105 bg-background text-foreground", 
            buttonClassName,
            value !== 'default' && selectedOption?.color && 
            `hover:border-[oklch(var(--${selectedOption.color}))] 
             ${value === selectedOption.value ? 
               `border-[oklch(var(--${selectedOption.color}))] border-2` : 
               `hover:bg-[oklch(var(--${selectedOption.color})/0.1)]`
             }`
          )}
        >
          <> {/* Wrap children in a single element */}
            <div className="flex items-center">
              {selectedOption?.value !== 'default' && (
                <div 
                  className={`w-3 h-3 rounded-full mr-2 ${
                    selectedOption?.color ? `bg-[oklch(var(--${selectedOption.color}))]` : ''
                  }`}
                  style={{
                    boxShadow: value === selectedOption?.value 
                      ? `0 0 0 2px oklch(var(--${selectedOption?.color})), 0 0 0 4px oklch(var(--${selectedOption?.color})/0.3)` 
                      : `0 0 0 1px oklch(var(--${selectedOption?.color}))`
                  }}
                />
              )}
              {selectedOption?.label || placeholder}
            </div>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </> {/* End of wrapper */}
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className={cn(
          "w-full max-w-[280px] p-0 backdrop-blur-md bg-background/95 shadow-lg border-2 border-border", 
          dropdownClassName
        )}
        align="start"
      >
        <Command className="bg-transparent">
          <CommandEmpty>Nessuna direzione trovata</CommandEmpty>
          <CommandGroup className="max-h-[220px] overflow-auto p-1">{options.map((option) => (<CommandItem
                key={option.value}
                value={option.value}
                onSelect={(currentValue) => {
                  onValueChange(currentValue as Direction)
                  setOpen(false)
                }}
                className={cn(
                  "transition-all duration-150 text-foreground py-3", // Increased padding to py-3
                  option.value !== 'default' && option.color && 
                  `hover:bg-[oklch(var(--${option.color})/0.1)]
                   ${value === option.value ? 'font-medium bg-muted/50' : ''}`
                )}
              >
                <div className="flex items-center">
                  {option.value !== 'default' && (
                    <div 
                      className={`w-3 h-3 rounded-full mr-2 ${
                        option.color ? `bg-[oklch(var(--${option.color}))]` : ''
                      }`}
                      style={{
                        boxShadow: value !== option.value 
                          ? `0 0 0 1px oklch(var(--${option.color}))`
                          : `0 0 0 2px oklch(var(--${option.color})/0.5)`
                      }}
                    />
                  )}
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4 transition-opacity",
                      value === option.value ? 
                        option.color ? `text-[oklch(var(--${option.color}))] opacity-100` : "opacity-100" 
                        : "opacity-0"
                    )}
                  />
                  {option.label}
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
