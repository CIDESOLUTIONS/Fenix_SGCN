import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Settings, Globe, DollarSign, Palette } from "lucide-react";
import { useSettings } from "@/contexts/SettingsContext";

const SettingsDropdown = () => {
  const { language, currency, theme, setLanguage, setCurrency, setTheme, t } = useSettings();

  const languages = [
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'pt', name: 'Português', flag: '🇧🇷' }
  ];

  const currencies = [
    { code: 'COP', name: 'Pesos (COP)', symbol: '$' },
    { code: 'USD', name: 'Dollars (USD)', symbol: 'USD$' },
    { code: 'BRL', name: 'Reales (BRL)', symbol: 'R$' }
  ];

  const themes = [
    { code: 'light', name: t('theme.light'), icon: '☀️' },
    { code: 'dark', name: t('theme.dark'), icon: '🌙' },
    { code: 'system', name: t('theme.system'), icon: '💻' }
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <Settings className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 bg-background border border-border">
        <DropdownMenuLabel className="flex items-center gap-2">
          <Globe className="h-4 w-4" />
          {t('language')}
        </DropdownMenuLabel>
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => setLanguage(lang.code)}
            className={`flex items-center gap-2 ${language === lang.code ? 'bg-accent' : ''}`}
          >
            <span>{lang.flag}</span>
            <span>{lang.name}</span>
            {language === lang.code && <span className="ml-auto">✓</span>}
          </DropdownMenuItem>
        ))}
        
        <DropdownMenuSeparator />
        
        <DropdownMenuLabel className="flex items-center gap-2">
          <DollarSign className="h-4 w-4" />
          {t('currency')}
        </DropdownMenuLabel>
        {currencies.map((curr) => (
          <DropdownMenuItem
            key={curr.code}
            onClick={() => setCurrency(curr.code)}
            className={`flex items-center gap-2 ${currency === curr.code ? 'bg-accent' : ''}`}
          >
            <span>{curr.symbol}</span>
            <span>{curr.name}</span>
            {currency === curr.code && <span className="ml-auto">✓</span>}
          </DropdownMenuItem>
        ))}
        
        <DropdownMenuSeparator />
        
        <DropdownMenuLabel className="flex items-center gap-2">
          <Palette className="h-4 w-4" />
          {t('theme')}
        </DropdownMenuLabel>
        {themes.map((themeOption) => (
          <DropdownMenuItem
            key={themeOption.code}
            onClick={() => setTheme(themeOption.code)}
            className={`flex items-center gap-2 ${theme === themeOption.code ? 'bg-accent' : ''}`}
          >
            <span>{themeOption.icon}</span>
            <span>{themeOption.name}</span>
            {theme === themeOption.code && <span className="ml-auto">✓</span>}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default SettingsDropdown;