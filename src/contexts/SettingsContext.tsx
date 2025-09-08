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
    'theme.system': 'Sistema',
    // Hero section
    'hero.title1': 'La Plataforma SaaS',
    'hero.title2': 'más Completa',
    'hero.title3': 'para',
    'hero.title4': 'SGCN',
    'hero.description': 'Implementa, opera, audita y mejora tu Sistema de Gestión de Continuidad del Negocio con total conformidad a estándares internacionales. La solución empresarial que supera a Fusion, Veoci y MetricStream.',
    'hero.start_trial': 'Comenzar Prueba Gratuita',
    'hero.demo': 'Ver Demo Interactiva',
    'hero.sla': '99.95% SLA',
    'hero.api': 'API < 200ms',
    'hero.multilang': 'Multi-idioma',
    // Dashboard
    'dashboard.ai_advisor': 'IA Advisor',
    'dashboard.ai_recommendations': 'Recomendaciones IA',
    'dashboard.predictions': 'Predicciones Tendencias',
    'dashboard.auto_alerts': 'Alertas Automáticas',
    'dashboard.performance': 'Rendimiento Optimizado',
    'dashboard.view_all': 'Ver Todo',
    'dashboard.modules': 'Módulos del Sistema',
    'dashboard.planeacion': 'Planeación',
    'dashboard.risk_analysis': 'Análisis de Riesgos',
    'dashboard.bia': 'Análisis de Impacto',
    'dashboard.strategies': 'Estrategias de Continuidad',
    'dashboard.plans': 'Planes de Continuidad',
    'dashboard.tests': 'Pruebas y Ejercicios',
    'dashboard.maintenance': 'Mantenimiento y Mejora',
    // Sidebar
    'sidebar.dashboard': 'Panel de Control',
    'sidebar.planeacion': 'Planeación',
    'sidebar.risk_analysis': 'Análisis de Riesgos',
    'sidebar.bia': 'Análisis de Impacto',
    'sidebar.strategies': 'Estrategias',
    'sidebar.criteria': 'Criterios de Estrategia',
    'sidebar.plans': 'Planes',
    'sidebar.tests': 'Pruebas',
    'sidebar.maintenance': 'Mantenimiento',
    'sidebar.settings': 'Configuración',
    // Dashboard content
    'dashboard.welcome': 'Bienvenido',
    'dashboard.welcome_description': 'Vista consolidada del estado del Sistema de Gestión de Continuidad del Negocio.',
    'dashboard.system_active': 'Sistema Activo',
    'dashboard.critical_processes': 'Procesos Críticos',
    'dashboard.identified_in_bia': 'Identificados en el BIA',
    'dashboard.high_critical_risks': 'Riesgos Altos/Críticos',
    'dashboard.before_treatment': 'Antes de tratamiento',
    'dashboard.developed_plans': 'Planes Desarrollados',
    'dashboard.pending_approval': 'Pendiente de aprobación',
    'dashboard.last_test': 'Última Prueba',
    'dashboard.next': 'Próxima',
    'dashboard.modules_title': '7 Módulos SGCN Especializados',
    'dashboard.modules_description': 'Conformes a ISO 22301, ISO 31000 y mejores prácticas internacionales'
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
    'theme.system': 'System',
    // Hero section
    'hero.title1': 'The Most Complete',
    'hero.title2': 'SaaS Platform',
    'hero.title3': 'for',
    'hero.title4': 'BCMS',
    'hero.description': 'Implement, operate, audit and improve your Business Continuity Management System with full compliance to international standards. The enterprise solution that surpasses Fusion, Veoci and MetricStream.',
    'hero.start_trial': 'Start Free Trial',
    'hero.demo': 'View Interactive Demo',
    'hero.sla': '99.95% SLA',
    'hero.api': 'API < 200ms',
    'hero.multilang': 'Multi-language',
    // Dashboard
    'dashboard.ai_advisor': 'AI Advisor',
    'dashboard.ai_recommendations': 'AI Recommendations',
    'dashboard.predictions': 'Trend Predictions',
    'dashboard.auto_alerts': 'Automatic Alerts',
    'dashboard.performance': 'Optimized Performance',
    'dashboard.view_all': 'View All',
    'dashboard.modules': 'System Modules',
    'dashboard.planeacion': 'Planning',
    'dashboard.risk_analysis': 'Risk Analysis',
    'dashboard.bia': 'Impact Analysis',
    'dashboard.strategies': 'Continuity Strategies',
    'dashboard.plans': 'Continuity Plans',
    'dashboard.tests': 'Tests & Exercises',
    'dashboard.maintenance': 'Maintenance & Improvement',
    // Sidebar
    'sidebar.dashboard': 'Dashboard',
    'sidebar.planeacion': 'Planning',
    'sidebar.risk_analysis': 'Risk Analysis',
    'sidebar.bia': 'Impact Analysis',
    'sidebar.strategies': 'Strategies',
    'sidebar.criteria': 'Strategy Criteria',
    'sidebar.plans': 'Plans',
    'sidebar.tests': 'Tests',
    'sidebar.maintenance': 'Maintenance',
    'sidebar.settings': 'Settings',
    // Dashboard content
    'dashboard.welcome': 'Welcome',
    'dashboard.welcome_description': 'Consolidated view of the Business Continuity Management System status.',
    'dashboard.system_active': 'System Active',
    'dashboard.critical_processes': 'Critical Processes',
    'dashboard.identified_in_bia': 'Identified in BIA',
    'dashboard.high_critical_risks': 'High/Critical Risks',
    'dashboard.before_treatment': 'Before treatment',
    'dashboard.developed_plans': 'Developed Plans',
    'dashboard.pending_approval': 'Pending approval',
    'dashboard.last_test': 'Last Test',
    'dashboard.next': 'Next',
    'dashboard.modules_title': '7 Specialized BCMS Modules',
    'dashboard.modules_description': 'Compliant with ISO 22301, ISO 31000 and international best practices'
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
    'theme.system': 'Sistema',
    // Hero section
    'hero.title1': 'A Plataforma SaaS',
    'hero.title2': 'mais Completa',
    'hero.title3': 'para',
    'hero.title4': 'SGCN',
    'hero.description': 'Implemente, opere, audite e melhore seu Sistema de Gestão de Continuidade de Negócios com total conformidade aos padrões internacionais. A solução empresarial que supera Fusion, Veoci e MetricStream.',
    'hero.start_trial': 'Iniciar Teste Gratuito',
    'hero.demo': 'Ver Demo Interativo',
    'hero.sla': '99.95% SLA',
    'hero.api': 'API < 200ms',
    'hero.multilang': 'Multi-idioma',
    // Dashboard
    'dashboard.ai_advisor': 'IA Advisor',
    'dashboard.ai_recommendations': 'Recomendações IA',
    'dashboard.predictions': 'Previsões de Tendências',
    'dashboard.auto_alerts': 'Alertas Automáticos',
    'dashboard.performance': 'Performance Otimizada',
    'dashboard.view_all': 'Ver Tudo',
    'dashboard.modules': 'Módulos do Sistema',
    'dashboard.planeacion': 'Planejamento',
    'dashboard.risk_analysis': 'Análise de Riscos',
    'dashboard.bia': 'Análise de Impacto',
    'dashboard.strategies': 'Estratégias de Continuidade',
    'dashboard.plans': 'Planos de Continuidade',
    'dashboard.tests': 'Testes e Exercícios',
    'dashboard.maintenance': 'Manutenção e Melhoria',
    // Sidebar
    'sidebar.dashboard': 'Painel de Controle',
    'sidebar.planeacion': 'Planejamento',
    'sidebar.risk_analysis': 'Análise de Riscos',
    'sidebar.bia': 'Análise de Impacto',
    'sidebar.strategies': 'Estratégias',
    'sidebar.criteria': 'Critérios de Estratégia',
    'sidebar.plans': 'Planos',
    'sidebar.tests': 'Testes',
    'sidebar.maintenance': 'Manutenção',
    'sidebar.settings': 'Configurações',
    // Dashboard content
    'dashboard.welcome': 'Bem-vindo',
    'dashboard.welcome_description': 'Visão consolidada do status do Sistema de Gestão de Continuidade de Negócios.',
    'dashboard.system_active': 'Sistema Ativo',
    'dashboard.critical_processes': 'Processos Críticos',
    'dashboard.identified_in_bia': 'Identificados no BIA',
    'dashboard.high_critical_risks': 'Riscos Altos/Críticos',
    'dashboard.before_treatment': 'Antes do tratamento',
    'dashboard.developed_plans': 'Planos Desenvolvidos',
    'dashboard.pending_approval': 'Pendente de aprovação',
    'dashboard.last_test': 'Último Teste',
    'dashboard.next': 'Próximo',
    'dashboard.modules_title': '7 Módulos SGCN Especializados',
    'dashboard.modules_description': 'Conformes à ISO 22301, ISO 31000 e melhores práticas internacionais'
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