import React, { Fragment, useMemo } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { useTheme } from './use-theme';
import { CheckIcon, ChevronDownIcon } from '@heroicons/react/20/solid';
import { Moon, Sun, Monitor, Palette } from 'lucide-react';

type Option = {
  value: 'dark' | 'light' | 'nord' | 'system';
  label: string;
  icon: React.ReactNode;
};

export default function ThemeMenu() {
  const { theme, resolvedTheme, setTheme, toggleTheme } = useTheme();

  const options: Option[] = useMemo(
    () => [
      { value: 'system', label: 'System', icon: <Monitor className="h-4 w-4" /> },
      { value: 'dark', label: 'Dark', icon: <Moon className="h-4 w-4" /> },
      { value: 'light', label: 'Light', icon: <Sun className="h-4 w-4" /> },
      { value: 'nord', label: 'Nord', icon: <Palette className="h-4 w-4" /> },
    ],
    []
  );

  // Keeping options memoized; current selection is reflected via checkmark in the menu

  return (
    <Menu as="div" className="relative inline-block text-left">
      <div className="flex items-center">
        {/* Primary button: one-click toggle (kept for convenience) */}
        <button
          type="button"
          onClick={toggleTheme}
          aria-label="Toggle theme"
          className="inline-flex items-center justify-center rounded-md border border-border text-foreground px-2 py-2 hover:bg-accent/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {resolvedTheme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
        </button>

        {/* Dropdown caret to pick explicit theme */}
        <Menu.Button
          className="ml-1 inline-flex items-center justify-center rounded-md border border-border text-foreground px-2 py-2 hover:bg-accent/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label="Open theme menu"
        >
          <ChevronDownIcon className="h-4 w-4" aria-hidden="true" />
        </Menu.Button>
      </div>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 z-10 mt-2 w-44 origin-top-right rounded-md border border-border bg-popover shadow-lg focus:outline-none">
          <div className="py-1">
            {options.map((opt) => (
              <Menu.Item key={opt.value}>
                {({ active }) => (
                  <button
                    type="button"
                    onClick={() => setTheme(opt.value)}
                    className={`$${''} ${
                      active ? 'bg-accent text-accent-foreground' : 'text-foreground'
                    } group flex w-full items-center gap-2 px-3 py-2 text-sm`}
                  >
                    <span className="shrink-0">{opt.icon}</span>
                    <span className="grow text-left">{opt.label}</span>
                    {theme === opt.value && (
                      <CheckIcon className="h-4 w-4 text-primary" aria-hidden="true" />
                    )}
                  </button>
                )}
              </Menu.Item>
            ))}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
