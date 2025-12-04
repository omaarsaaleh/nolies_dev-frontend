import { useId, useState, useEffect } from 'react'
import { CheckIcon, ChevronDownIcon, Loader2, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Command, CommandEmpty, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { useDebouncedValue } from '@/utils/query'

export type SearchComboBoxProps<T> = {
  value: T | null
  onSelect: (item: T | null) => void
  results: T[]
  isSearching?: boolean
  onSearchTermChange: (searchTerm: string) => void
  getItemValue: (item: T) => string
  getItemLabel: (item: T) => string
  renderItem?: (item: T, isSelected: boolean) => React.ReactNode
  renderSelected?: (item: T) => React.ReactNode
  placeholder?: string
  searchPlaceholder?: string
  emptyMessage?: string
  className?: string
  minSearchLength?: number
  debounceMs?: number
  disabled?: boolean
}

export function SearchComboBox<T>({
  value,
  onSelect,
  results,
  isSearching = false,
  onSearchTermChange,
  getItemValue,
  getItemLabel,
  renderItem,
  renderSelected,
  placeholder = 'Select an item...',
  searchPlaceholder = 'Search...',
  emptyMessage = 'No results found.',
  className,
  minSearchLength = 2,
  debounceMs = 400,
  disabled = false,
}: SearchComboBoxProps<T>) {
  const id = useId()
  const [open, setOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const debouncedSearch = useDebouncedValue(searchTerm.trim(), debounceMs)

  const shouldSearch = debouncedSearch.length >= minSearchLength
  const hasResults = results.length > 0

  useEffect(() => {
    if (open && shouldSearch) {
      onSearchTermChange(debouncedSearch)
    } else if (open && !shouldSearch) {
      onSearchTermChange('')
    } else if (!open) {
      onSearchTermChange('')
    }
  }, [debouncedSearch, shouldSearch, open, onSearchTermChange])

  const handleSelect = (item: T) => {
    onSelect(item)
    setOpen(false)
    setSearchTerm('')
  }

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation()
    onSelect(null)
    setSearchTerm('')
    onSearchTermChange('')
  }

  const selectedLabel = value ? getItemLabel(value) : null;
  const selectedValue = value ? getItemValue(value) : null;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          id={id}
          variant='outline'
          role='combobox'
          aria-expanded={open}
          disabled={disabled}
          className={cn(
            'bg-background hover:bg-background border-input w-full justify-between px-3 font-normal outline-offset-0 outline-none focus-visible:outline-[3px]',
            className
          )}
        >
          {value ? (
            <span className='flex min-w-0 items-center gap-2 flex-1'>
              {renderSelected ? (
                renderSelected(value)
              ) : (
                <span className='truncate'>{selectedLabel}</span>
              )}
            </span>
          ) : (
            <span className='text-muted-foreground'>{placeholder}</span>
          )}
          <div className='flex items-center gap-1 shrink-0'>
            {value && (
              <button
                type='button'
                onClick={handleClear}
                className='rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none'
                aria-label='Clear selection'
              >
                <span className='sr-only'>Clear</span>
                <X className='text-muted-foreground/80 shrink-0' aria-hidden='true' size={16} />
              </button>
            )}
            <ChevronDownIcon size={16} className='text-muted-foreground/80 shrink-0' aria-hidden='true' />
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className='border-input w-full min-w-[var(--radix-popper-anchor-width)] p-0' 
        align='start'
      >
        <Command shouldFilter={false}>
          <CommandInput 
            placeholder={searchPlaceholder}
            value={searchTerm}
            onValueChange={setSearchTerm}
          />
          <CommandList>
            {isSearching ? (
              <div className='flex items-center gap-2 p-3 text-sm text-muted-foreground'>
                <Loader2 className='h-4 w-4 animate-spin' />
                Searching...
              </div>
            ) : shouldSearch && !hasResults && !isSearching ? (
              <CommandEmpty>{emptyMessage}</CommandEmpty>
            ) : (
              results.map((item) => {
                const itemValue = getItemValue(item)
                const itemLabel = getItemLabel(item)
                const isSelected = selectedValue === itemValue

                return (
                  <CommandItem
                    key={itemValue}
                    value={itemValue}
                    onSelect={() => handleSelect(item)}
                  >
                    {renderItem ? (
                      renderItem(item, isSelected)
                    ) : (
                      <>
                        <span className='flex-1 truncate'>{itemLabel}</span>
                        {isSelected && <CheckIcon size={16} className='ml-auto' />}
                      </>
                    )}
                  </CommandItem>
                )
              })
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}