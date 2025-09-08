import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface SettingsContextType {
  language: string;
  currency: string;
  theme: string;
  setLanguage: (lang: string) => void;
  setCurrency: (curr: string) => void;
  setTheme: (theme: string) => void;
  t: (key: string) => string;
  formatCurrency: (amount: number) => string;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

const translations = {
  es: {
    'nav.features': 'Características',
    'nav.modules': 'Módulos', 
    'nav.plans': 'Planes',
    'nav.demo': 'Demo',
    'auth.login': 'Iniciar Sesión',
    'auth.trial': 'Prueba Gratuita',
    'dashboard.title': 'Panel de Control',
    'dashboard.kpis': 'Indicadores Clave',
    'dashboard.risks': 'Riesgos Identificados',
    'dashboard.documents': 'Documentos Activos',
    'dashboard.processes': 'Procesos en Curso',
    'dashboard.compliance': 'Cumplimiento',
    'settings.title': 'Configuración',
    'settings.ldap': 'Integración LDAP',
    'settings.general': 'Configuración General',
    'risk.analysis': 'Análisis de Riesgos',
    'language': 'Idioma',
    'currency': 'Moneda',
    'theme': 'Tema',
    'theme.light': 'Claro',
    'theme.dark': 'Oscuro',
    'theme.system': 'Sistema'
  },
  en: {
    'nav.features': 'Features',
    'nav.modules': 'Modules',
    'nav.plans': 'Plans', 
    'nav.demo': 'Demo',
    'auth.login': 'Sign In',
    'auth.trial': 'Free Trial',
    'dashboard.title': 'Dashboard',
    'dashboard.kpis': 'Key Indicators',
    'dashboard.risks': 'Identified Risks',
    'dashboard.documents': 'Active Documents',
    'dashboard.processes': 'Ongoing Processes',
    'dashboard.compliance': 'Compliance',
    'settings.title': 'Settings',
    'settings.ldap': 'LDAP Integration',
    'settings.general': 'General Settings',
    'risk.analysis': 'Risk Analysis',
    'language': 'Language',
    'currency': 'Currency',
    'theme': 'Theme',
    'theme.light': 'Light',
    'theme.dark': 'Dark',
    'theme.system': 'System'
  },
  pt: {
    'nav.features': 'Características',
    'nav.modules': 'Módulos',
    'nav.plans': 'Planos',
    'nav.demo': 'Demo',
    'auth.login': 'Entrar',
    'auth.trial': 'Teste Gratuito',
    'dashboard.title': 'Painel de Controle',
    'dashboard.kpis': 'Indicadores Chave',
    'dashboard.risks': 'Riscos Identificados',
    'dashboard.documents': 'Documentos Ativos',
    'dashboard.processes': 'Processos em Andamento',
    'dashboard.compliance': 'Conformidade',
    'settings.title': 'Configurações',
    'settings.ldap': 'Integração LDAP',
    'settings.general': 'Configurações Gerais',
    'risk.analysis': 'Análise de Riscos',
    'language': 'Idioma',
    'currency': 'Moeda',
    'theme': 'Tema',
    'theme.light': 'Claro',
    'theme.dark': 'Escuro',
    'theme.system': 'Sistema'
  }
};

const currencyFormats = {
  COP: { symbol: '$', locale: 'es-CO' },
  USD: { symbol: '$', locale: 'en-US' },
  BRL: { symbol: 'R$', locale: 'pt-BR' }
};

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState('es');
  const [currency, setCurrencyState] = useState('COP');
  const [theme, setThemeState] = useState('light');

  useEffect(() => {
    // Apply theme to document
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else if (theme === 'light') {
      root.classList.remove('dark');
    } else {
      // System theme
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    }
  }, [theme]);

  const setLanguage = (lang: string) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
  };

  const setCurrency = (curr: string) => {
    setCurrencyState(curr);
    localStorage.setItem('currency', curr);
  };

  const setTheme = (newTheme: string) => {
    setThemeState(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  const t = (key: string): string => {
    return translations[language as keyof typeof translations]?.[key as keyof typeof translations.es] || key;
  };

  const formatCurrency = (amount: number): string => {
    const format = currencyFormats[currency as keyof typeof currencyFormats];
    return new Intl.NumberFormat(format.locale, {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  // Load saved preferences
  useEffect(() => {
    const savedLang = localStorage.getItem('language');
    const savedCurrency = localStorage.getItem('currency');
    const savedTheme = localStorage.getItem('theme');
    
    if (savedLang) setLanguageState(savedLang);
    if (savedCurrency) setCurrencyState(savedCurrency);
    if (savedTheme) setThemeState(savedTheme);
  }, []);

  return (
    <SettingsContext.Provider value={{
      language,
      currency,
      theme,
      setLanguage,
      setCurrency,
      setTheme,
      t,
      formatCurrency
    }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};