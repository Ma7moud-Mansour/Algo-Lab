import { useState, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, ChevronRight, ArrowUpDown, Search as SearchIcon, GitBranch, Database, Undo2, Layers, X, TrendingUp, Sparkles } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { categories, getAlgorithmsByCategory } from '@/algorithms/config';
import { AlgorithmCategory } from '@/types/algorithm';

interface AlgorithmSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const categoryIcons: Record<AlgorithmCategory, React.ComponentType<{ className?: string }>> = {
  sorting: ArrowUpDown,
  searching: SearchIcon,
  graph: GitBranch,
  'data-structures': Database,
  backtracking: Undo2,
  'dynamic-programming': Layers,
  greedy: TrendingUp,
  other: Sparkles,
};

export function AlgorithmSidebar({ isOpen, onClose }: AlgorithmSidebarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(['sorting', 'searching'])
  );
  const location = useLocation();

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(categoryId)) {
        next.delete(categoryId);
      } else {
        next.add(categoryId);
      }
      return next;
    });
  };

  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return categories;

    return categories.filter((category) => {
      const algorithms = getAlgorithmsByCategory(category.id);
      const matchingAlgorithms = algorithms.filter((algo) =>
        algo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        algo.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      return matchingAlgorithms.length > 0;
    });
  }, [searchQuery]);

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed top-16 left-0 z-40 h-[calc(100vh-4rem)] w-72 glass-panel border-r border-panel-border transition-transform duration-300 ease-in-out',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-4 border-b border-panel-border">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-foreground">Algorithms</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="lg:hidden h-8 w-8 text-muted-foreground"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search algorithms..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-9 bg-muted/50 border-panel-border focus:border-primary/50 focus:ring-primary/20"
              />
            </div>
          </div>

          {/* Algorithm list */}
          <ScrollArea className="flex-1 scrollbar-thin">
            <div className="p-2">
              {filteredCategories.map((category) => {
                const algorithms = getAlgorithmsByCategory(category.id);
                const filteredAlgorithms = searchQuery.trim()
                  ? algorithms.filter((algo) =>
                      algo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      algo.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
                    )
                  : algorithms;

                if (filteredAlgorithms.length === 0) return null;

                const isExpanded = expandedCategories.has(category.id) || searchQuery.trim();
                const IconComponent = categoryIcons[category.id] || Layers;

                return (
                  <div key={category.id} className="mb-1">
                    <button
                      onClick={() => toggleCategory(category.id)}
                      className={cn(
                        'w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                        'text-muted-foreground hover:text-foreground hover:bg-accent'
                      )}
                    >
                      <ChevronRight
                        className={cn(
                          'h-4 w-4 transition-transform duration-200',
                          isExpanded && 'rotate-90'
                        )}
                      />
                      <IconComponent className="h-4 w-4 text-primary" />
                      <span>{category.name}</span>
                      <span className="ml-auto text-xs text-muted-foreground">
                        {filteredAlgorithms.length}
                      </span>
                    </button>

                    {isExpanded && (
                      <div className="ml-4 pl-4 border-l border-panel-border animate-fade-in-up">
                        {filteredAlgorithms.map((algo) => {
                          const isActive = location.pathname === algo.route;
                          return (
                            <Link
                              key={algo.id}
                              to={algo.route}
                              onClick={onClose}
                              className={cn(
                                'block px-3 py-2 rounded-lg text-sm transition-all duration-200',
                                isActive
                                  ? 'text-primary bg-primary/10 glow-border-primary font-medium'
                                  : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                              )}
                            >
                              {algo.name}
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        </div>
      </aside>
    </>
  );
}
