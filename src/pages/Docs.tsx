import { Link } from 'react-router-dom';
import { BookOpen, Play, Settings, ArrowRight, Code2, Layers, GitBranch, Undo2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Docs() {
  return (
    <div className="min-h-screen p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-xl bg-primary/10">
              <BookOpen className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold">
              <span className="text-gradient">Documentation</span>
            </h1>
          </div>
          <p className="text-lg text-muted-foreground">
            Learn how to use AlgoLab to visualize and understand algorithms.
          </p>
        </header>

        {/* What is AlgoLab */}
        <section className="glass-panel p-6 mb-8">
          <h2 className="text-xl font-bold mb-4 text-foreground" id="what-is-algolab">
            What is AlgoLab?
          </h2>
          <p className="text-muted-foreground mb-4">
            AlgoLab is an interactive algorithm visualization platform designed to help you understand 
            how algorithms work through step-by-step animations. Whether you're a student learning 
            data structures and algorithms, or a developer brushing up on fundamentals, AlgoLab makes 
            complex concepts intuitive and engaging.
          </p>
          <ul className="space-y-2 text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">•</span>
              Watch algorithms execute in real-time with synchronized code highlighting
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">•</span>
              Control execution speed and step through code line by line
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">•</span>
              View implementations in multiple programming languages
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">•</span>
              Configure custom inputs to test different scenarios
            </li>
          </ul>
        </section>

        {/* How to Use */}
        <section className="glass-panel p-6 mb-8">
          <h2 className="text-xl font-bold mb-4 text-foreground" id="how-to-use">
            How to Use
          </h2>
          <div className="space-y-6">
            {[
              {
                icon: Code2,
                title: '1. Choose an Algorithm',
                description: 'Use the sidebar on the left to browse algorithms by category. Click on any algorithm to open its visualization page.',
              },
              {
                icon: Settings,
                title: '2. Configure Input',
                description: 'Most algorithms allow you to customize the input data. Enter your own values or click "Randomize" to generate random input.',
              },
              {
                icon: Play,
                title: '3. Run the Visualization',
                description: 'Use the control panel to run, pause, step through, or reset the algorithm. Adjust the speed slider to control how fast the visualization runs.',
              },
              {
                icon: BookOpen,
                title: '4. Study the Code',
                description: 'Watch the code panel as lines are highlighted during execution. Switch between programming languages to see different implementations.',
              },
            ].map((step) => (
              <div key={step.title} className="flex gap-4">
                <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center flex-shrink-0">
                  <step.icon className="h-5 w-5 text-secondary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">{step.title}</h3>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Algorithm Categories */}
        <section className="glass-panel p-6 mb-8">
          <h2 className="text-xl font-bold mb-4 text-foreground" id="categories">
            Algorithm Categories
          </h2>
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                <Layers className="h-4 w-4 text-primary" />
                Sorting Algorithms
              </h3>
              <p className="text-sm text-muted-foreground mb-2">
                Sorting algorithms arrange elements in a specific order (ascending or descending). 
                They are fundamental to computer science and are used in countless applications.
              </p>
              <ul className="text-sm text-muted-foreground grid grid-cols-2 gap-1">
                <li>• Bubble Sort - O(n²)</li>
                <li>• Selection Sort - O(n²)</li>
                <li>• Insertion Sort - O(n²)</li>
                <li>• Quick Sort - O(n log n)</li>
                <li>• Merge Sort - O(n log n)</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                <Code2 className="h-4 w-4 text-secondary" />
                Searching Algorithms
              </h3>
              <p className="text-sm text-muted-foreground mb-2">
                Searching algorithms find the position of a target value within a data structure.
                Efficient searching is critical for databases, file systems, and more.
              </p>
              <ul className="text-sm text-muted-foreground grid grid-cols-2 gap-1">
                <li>• Linear Search - O(n)</li>
                <li>• Binary Search - O(log n)</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                <GitBranch className="h-4 w-4 text-info" />
                Graph Algorithms
              </h3>
              <p className="text-sm text-muted-foreground mb-2">
                Graph algorithms solve problems related to graph data structures, which model 
                relationships between objects. Used in social networks, maps, and network analysis.
              </p>
              <ul className="text-sm text-muted-foreground grid grid-cols-2 gap-1">
                <li>• Breadth-First Search (BFS)</li>
                <li>• Depth-First Search (DFS)</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                <Undo2 className="h-4 w-4 text-warning" />
                Backtracking
              </h3>
              <p className="text-sm text-muted-foreground mb-2">
                Backtracking algorithms solve constraint satisfaction problems by trying partial 
                solutions and abandoning them if they cannot lead to a valid solution.
              </p>
              <ul className="text-sm text-muted-foreground grid grid-cols-2 gap-1">
                <li>• N-Queens Problem</li>
                <li>• Sudoku Solver</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Controls Reference */}
        <section className="glass-panel p-6 mb-8">
          <h2 className="text-xl font-bold mb-4 text-foreground" id="controls">
            Controls Reference
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-panel-border">
                  <th className="text-left py-2 text-foreground">Control</th>
                  <th className="text-left py-2 text-foreground">Action</th>
                </tr>
              </thead>
              <tbody className="text-muted-foreground">
                <tr className="border-b border-panel-border/50">
                  <td className="py-2 font-medium text-foreground">▶ Run</td>
                  <td className="py-2">Start or resume automatic execution</td>
                </tr>
                <tr className="border-b border-panel-border/50">
                  <td className="py-2 font-medium text-foreground">⏸ Pause</td>
                  <td className="py-2">Pause the current execution</td>
                </tr>
                <tr className="border-b border-panel-border/50">
                  <td className="py-2 font-medium text-foreground">⏭ Step</td>
                  <td className="py-2">Execute exactly one step, then pause</td>
                </tr>
                <tr className="border-b border-panel-border/50">
                  <td className="py-2 font-medium text-foreground">↺ Reset</td>
                  <td className="py-2">Clear visualization and return to initial state</td>
                </tr>
                <tr>
                  <td className="py-2 font-medium text-foreground">Speed Slider</td>
                  <td className="py-2">Adjust animation speed (Slow / Normal / Fast)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* CTA */}
        <div className="text-center">
          <p className="text-muted-foreground mb-4">
            Ready to start learning?
          </p>
          <Link to="/algorithms/sorting/bubble-sort">
            <Button size="lg" className="gap-2 bg-primary hover:bg-primary/90">
              Try Your First Algorithm
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
