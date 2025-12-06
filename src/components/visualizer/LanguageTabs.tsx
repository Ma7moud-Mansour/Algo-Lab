import { cn } from '@/lib/utils';

interface LanguageTabsProps {
  languages: string[];
  activeLanguage: string;
  onLanguageChange: (language: string) => void;
  className?: string;
}

const languageLabels: Record<string, string> = {
  javascript: 'JavaScript',
  python: 'Python',
  cpp: 'C++',
  pseudocode: 'Pseudocode',
};

export function LanguageTabs({
  languages,
  activeLanguage,
  onLanguageChange,
  className,
}: LanguageTabsProps) {
  return (
    <div className={cn('flex gap-1 p-1 bg-muted/30 rounded-lg', className)}>
      {languages.map((lang) => (
        <button
          key={lang}
          onClick={() => onLanguageChange(lang)}
          className={cn(
            'px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-200',
            activeLanguage === lang
              ? 'bg-primary text-primary-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground hover:bg-accent'
          )}
        >
          {languageLabels[lang] || lang}
        </button>
      ))}
    </div>
  );
}
