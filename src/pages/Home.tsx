import { Link } from 'react-router-dom';
import { ArrowRight, Play, Code2, Layers, Zap, Github, ArrowUpDown, Search, GitBranch, Undo2, LayoutDashboard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { categories } from '@/algorithms/config';

const categoryIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  sorting: ArrowUpDown,
  searching: Search,
  graph: GitBranch,
  'data-structures': LayoutDashboard,
  backtracking: Undo2,
  'dynamic-programming': Layers,
};

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-24 lg:py-32 px-6 overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 bg-gradient-radial pointer-events-none" />
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-1/4 w-72 h-72 bg-secondary/5 rounded-full blur-3xl" />

        <div className="max-w-5xl mx-auto text-center relative">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8 animate-fade-in-up">
            <Zap className="h-4 w-4 text-primary" />
            <span className="text-sm text-primary font-medium">Interactive Algorithm Learning</span>
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <span className="text-foreground">Visualize Algorithms</span>
            <br />
            <span className="text-gradient">From Code</span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            Understand algorithms through interactive, step-by-step visualizations.
            See exactly how sorting, searching, and graph algorithms work.
          </p>

          <div className="flex flex-wrap gap-4 justify-center animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <Link to="/algorithms/sorting/bubble-sort">
              <Button size="lg" className="gap-2 h-12 px-8 bg-primary hover:bg-primary/90 glow-primary text-lg">
                <Play className="h-5 w-5" />
                Explore Algorithms
              </Button>
            </Link>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer">
              <Button size="lg" variant="outline" className="gap-2 h-12 px-8 border-panel-border hover:bg-accent text-lg">
                <Github className="h-5 w-5" />
                View on GitHub
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Learn Algorithms <span className="text-gradient">Visually</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our interactive platform makes understanding complex algorithms intuitive and engaging.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: Code2,
                title: 'Visualize from Code',
                description: 'See your code come to life with real-time visualizations. Watch each line execute step by step.',
              },
              {
                icon: Play,
                title: 'Step-by-Step Execution',
                description: 'Control the pace of execution. Pause, step forward, or speed through to understand the flow.',
              },
              {
                icon: Layers,
                title: 'Multiple Categories',
                description: 'From sorting to graphs, from dynamic programming to backtracking. Explore them all.',
              },
            ].map((feature, index) => (
              <div
                key={feature.title}
                className="glass-panel p-6 group hover:glow-border-primary transition-all duration-300 animate-fade-in-up"
                style={{ animationDelay: `${0.1 * index}s` }}
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-foreground">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 px-6 bg-gradient-to-b from-transparent via-muted/20 to-transparent">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Explore <span className="text-gradient">Categories</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Choose from a wide variety of algorithm categories to master.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((category, index) => {
              const IconComponent = categoryIcons[category.id] || Layers;
              return (
                <Link
                  key={category.id}
                  to={`/algorithms/${category.id}`}
                  className="glass-panel p-5 group hover:glow-border-primary transition-all duration-300 animate-fade-in-up flex items-start gap-4"
                  style={{ animationDelay: `${0.05 * index}s` }}
                >
                  <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-secondary/20 transition-colors">
                    <IconComponent className="h-5 w-5 text-secondary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">{category.description}</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Getting Started Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Getting <span className="text-gradient">Started</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Start learning algorithms in just a few simple steps.
            </p>
          </div>

          <div className="space-y-6">
            {[
              { step: 1, title: 'Choose an Algorithm', description: 'Browse the sidebar to find the algorithm you want to learn.' },
              { step: 2, title: 'Configure Input', description: 'Set up your test data or use randomized input.' },
              { step: 3, title: 'Run the Visualization', description: 'Click run to watch the algorithm execute step by step.' },
              { step: 4, title: 'Study the Code', description: 'Follow along with the highlighted code lines as the algorithm runs.' },
            ].map((item, index) => (
              <div
                key={item.step}
                className="flex items-start gap-6 animate-fade-in-up"
                style={{ animationDelay: `${0.1 * index}s` }}
              >
                <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center flex-shrink-0">
                  <span className="text-lg font-bold text-primary">{item.step}</span>
                </div>
                <div className="glass-panel p-4 flex-1">
                  <h3 className="font-semibold text-foreground mb-1">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/algorithms/sorting/bubble-sort">
              <Button size="lg" className="gap-2 bg-primary hover:bg-primary/90">
                Start Learning
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-panel-border">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-sm text-muted-foreground">
            Built with React, TypeScript, and Tailwind CSS. 
            <span className="text-gradient font-medium ml-1">AlgoLab</span> — Learn algorithms visually.
          </p>
        </div>
      </footer>
    </div>
  );
}
