import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import { Check, Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "@/features/theme/use-theme";
import { useLanguage } from "@/i18n/use-language";
import type { Theme } from "@/features/theme/theme-context";

export default function ThemeMenu() {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const { language } = useLanguage();
  const copy =
    language === "en"
      ? {
          open: "Choose color theme",
          system: "System",
          dark: "Dark",
          light: "Light",
        }
      : {
          open: "Scegli il tema colore",
          system: "Sistema",
          dark: "Scuro",
          light: "Chiaro",
        };

  const options: Array<{
    value: Theme;
    label: string;
    icon: typeof Sun;
  }> = [
    { value: "system", label: copy.system, icon: Monitor },
    { value: "dark", label: copy.dark, icon: Moon },
    { value: "light", label: copy.light, icon: Sun },
  ];

  return (
    <Menu as="div" className="relative">
      <Menu.Button
        className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-card text-foreground shadow-sm transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        aria-label={copy.open}
      >
        {resolvedTheme === "dark" ? (
          <Moon className="h-4.5 w-4.5" aria-hidden="true" />
        ) : (
          <Sun className="h-4.5 w-4.5" aria-hidden="true" />
        )}
      </Menu.Button>

      <Transition
        as={Fragment}
        enter="transition duration-100 ease-out"
        enterFrom="scale-95 opacity-0"
        enterTo="scale-100 opacity-100"
        leave="transition duration-75 ease-in"
        leaveFrom="scale-100 opacity-100"
        leaveTo="scale-95 opacity-0"
      >
        <Menu.Items className="absolute right-0 z-50 mt-2 w-40 origin-top-right rounded-xl border border-border bg-popover p-1.5 text-popover-foreground shadow-xl focus:outline-none">
          {options.map((option) => {
            const Icon = option.icon;

            return (
              <Menu.Item key={option.value}>
                {({ focus }) => (
                  <button
                    type="button"
                    onClick={() => setTheme(option.value)}
                    className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm ${
                      focus ? "bg-muted" : ""
                    }`}
                  >
                    <Icon className="h-4 w-4" aria-hidden="true" />
                    <span className="flex-1 text-left">{option.label}</span>
                    {theme === option.value ? (
                      <Check
                        className="h-4 w-4 text-primary"
                        aria-hidden="true"
                      />
                    ) : null}
                  </button>
                )}
              </Menu.Item>
            );
          })}
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
