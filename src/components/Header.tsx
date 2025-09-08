import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import cideLogo from "@/assets/cide-logo.png";
import phoenixLogo from "@/assets/phoenix-logo.png";
import SettingsDropdown from "@/components/SettingsDropdown";
import { useSettings } from "@/contexts/SettingsContext";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { t } = useSettings();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <img src={phoenixLogo} alt="Fenix" className="h-8 w-8" />
            <div className="flex flex-col">
              <span className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                Fenix-SGCN
              </span>
              <span className="text-xs text-muted-foreground">by CIDE SAS</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-foreground hover:text-primary transition-smooth">
              {t('nav.features')}
            </a>
            <a href="#modules" className="text-foreground hover:text-primary transition-smooth">
              {t('nav.modules')}
            </a>
            <a href="#plans" className="text-foreground hover:text-primary transition-smooth">
              {t('nav.plans')}
            </a>
            <a href="#demo" className="text-foreground hover:text-primary transition-smooth">
              {t('nav.demo')}
            </a>
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center space-x-4">
            <SettingsDropdown />
            <Button variant="outline" size="sm" asChild>
              <a href="/auth">{t('auth.login')}</a>
            </Button>
            <Button variant="hero" size="sm" asChild>
              <a href="/auth">{t('auth.trial')}</a>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-foreground hover:text-primary transition-smooth"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-border">
            <nav className="flex flex-col space-y-4 p-6">
              <a href="#features" className="text-foreground hover:text-primary transition-smooth">
                {t('nav.features')}
              </a>
              <a href="#modules" className="text-foreground hover:text-primary transition-smooth">
                {t('nav.modules')}
              </a>
              <a href="#plans" className="text-foreground hover:text-primary transition-smooth">
                {t('nav.plans')}
              </a>
              <a href="#demo" className="text-foreground hover:text-primary transition-smooth">
                {t('nav.demo')}
              </a>
              <div className="flex flex-col space-y-3 pt-4 border-t border-border">
                <SettingsDropdown />
                <Button variant="outline" size="sm" asChild>
                  <a href="/auth">{t('auth.login')}</a>
                </Button>
                <Button variant="hero" size="sm" asChild>
                  <a href="/auth">{t('auth.trial')}</a>
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;