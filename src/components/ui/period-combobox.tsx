import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { type FilterPeriod } from "@/pages/DashboardPage"

interface PeriodComboboxProps {
  options: {
    value: FilterPeriod
    label: string
  }[]
  value: FilterPeriod
  onValueChange: (value: FilterPeriod) => void
  placeholder?: string
  buttonClassName?: string
  dropdownClassName?: string
}

export function PeriodCombobox({ 
  options, 
  value, 
  onValueChange,
  placeholder = "Seleziona periodo",
  buttonClassName,
  dropdownClassName
}: PeriodComboboxProps) {
  const [open, setOpen] = React.useState(false)

  const selectedOption = React.useMemo(() => 
    options.find((option) => option.value === value), 
    [options, value]
  )

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-[180px] justify-between z-50", buttonClassName)}
        >
          {selectedOption?.label || placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className={cn("w-[180px] p-0", dropdownClassName)}>
        <Command>
          <CommandInput placeholder="Cerca periodo..." />
          <CommandEmpty>Nessun periodo trovato</CommandEmpty>
          <CommandGroup>
            {options.map((option) => (
              <CommandItem
                key={option.value}
                value={option.value}
                onSelect={(currentValue) => {
                  onValueChange(currentValue as FilterPeriod)
                  setOpen(false)
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === option.value ? "opacity-100" : "opacity-0"
                  )}
                />
                {option.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
