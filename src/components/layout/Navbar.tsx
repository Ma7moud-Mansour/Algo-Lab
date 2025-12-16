import { Link, useLocation } from 'react-router-dom';
import { Menu, Github, BookOpen, Sparkles, PanelLeftClose, PanelLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface NavbarProps {
  onMenuToggle: () => void;
  showMenuButton?: boolean;
  sidebarOpen?: boolean;
}

export function Navbar({ onMenuToggle, showMenuButton = false, sidebarOpen = false }: NavbarProps) {
  const location = useLocation();

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/algorithms', label: 'Algorithms' },
    { to: '/docs', label: 'Docs' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16 glass-panel border-b border-panel-border">
      <div className="flex h-full items-center justify-between px-4 lg:px-6">
        {/* Left section */}
        <div className="flex items-center gap-4">
          {/* Mobile hamburger - always shown on mobile */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onMenuToggle}
            className="lg:hidden text-muted-foreground hover:text-foreground"
          >
            <Menu className="h-5 w-5" />
          </Button>

          {/* Desktop sidebar toggle - shown only on algorithm pages */}
          {showMenuButton && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onMenuToggle}
              className="hidden lg:flex text-muted-foreground hover:text-foreground transition-colors"
              title={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
            >
              {sidebarOpen ? (
                <PanelLeftClose className="h-5 w-5" />
              ) : (
                <PanelLeft className="h-5 w-5" />
              )}
            </Button>
          )}

          <Link to="/" className="flex items-center gap-2 group">
            <div className="relative">
              <Sparkles className="h-8 w-8 text-primary animate-pulse-glow" />
              <div className="absolute inset-0 blur-lg bg-primary/30 rounded-full" />
            </div>
            <span className="text-xl font-bold text-gradient">AlgoLab</span>
          </Link>
        </div>

        {/* Center navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={cn(
                'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                location.pathname === link.to
                  ? 'text-primary bg-primary/10 glow-border-primary'
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent'
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right section */}
        <div className="flex items-center gap-2">
          <Link to="/docs">
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
              <BookOpen className="h-5 w-5" />
            </Button>
          </Link>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
              <Github className="h-5 w-5" />
            </Button>
          </a>
        </div>
      </div>
    </header>
  );
}
