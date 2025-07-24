import { Button } from "@/components/ui/button";
import { Sparkles, Globe } from "lucide-react";
import { useTranslation } from "@/components/hooks/useTranslation"; // Adjusted path to match context location

const Header = () => {
  const { t, currentLanguage, setLanguage, languages } = useTranslation();

  return (
    <header className="bg-background border-b border-border px-6 lg:px-10 py-4">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl font-bold text-foreground">Ted2mn</h1>
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <a
            href="#"
            className="text-sm font-medium text-foreground hover:text-primary transition-colors"
          >
            {t("nav.home")}
          </a>
        </nav>

        {/* Right side actions */}
        <div className="flex items-center gap-4">
          {/* Language Selector */}
          <select
            value={currentLanguage}
            onChange={(e) => setLanguage(e.target.value)}
            className="text-sm bg-background border border-border rounded-lg px-3 py-2 text-foreground"
          >
            {languages.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.flag} {lang.name}
              </option>
            ))}
          </select>

          <Button variant="hero" size="default">
            {t("header.newVideo")}
          </Button>

          {/* User Avatar */}
          <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center">
            <Globe className="w-5 h-5 text-white" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;