import { Link } from 'react-router-dom';
import { ArrowUpDown, Search, GitBranch, Undo2, Layers } from 'lucide-react';
import { categories, getAlgorithmsByCategory } from '@/algorithms/config';

const categoryIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  sorting: ArrowUpDown,
  searching: Search,
  graph: GitBranch,
  backtracking: Undo2,
  'dynamic-programming': Layers,
  'data-structures': Layers,
};

export default function AlgorithmsDirectory() {
  return (
    <div className="min-h-screen p-6 lg:p-8">
      <div className="max-w-5xl mx-auto">
        <header className="mb-12">
          <h1 className="text-3xl lg:text-4xl font-bold mb-4">
            <span className="text-gradient">All Algorithms</span>
          </h1>
          <p className="text-muted-foreground text-lg">
            Browse our complete collection of algorithm visualizations organized by category.
          </p>
        </header>

        <div className="space-y-12">
          {categories.map((category) => {
            const algorithms = getAlgorithmsByCategory(category.id);
            if (algorithms.length === 0) return null;

            const IconComponent = categoryIcons[category.id] || Layers;

            return (
              <section key={category.id}>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <IconComponent className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-foreground">{category.name}</h2>
                    <p className="text-sm text-muted-foreground">{category.description}</p>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {algorithms.map((algo) => (
                    <Link
                      key={algo.id}
                      to={algo.route}
                      className="glass-panel p-4 hover:glow-border-primary transition-all duration-300 group"
                    >
                      <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors mb-2">
                        {algo.name}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                        {algo.description}
                      </p>
                      <div className="flex gap-2 text-xs">
                        <span className="px-2 py-0.5 rounded bg-secondary/10 text-secondary">
                          {algo.complexity.time.average}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-info/10 text-info">
                          {algo.complexity.space}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </div>
  );
}
