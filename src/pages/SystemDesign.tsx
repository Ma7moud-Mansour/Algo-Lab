import { motion } from "framer-motion";
import {
    Shield,
    Cpu,
    Layers,
    Zap,
    Database,
    MessageSquare,
    ArrowRight,
    GitBranch,
    Server,
    Code2,
    Lock
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const SystemDesign = () => {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 },
    };

    return (
        <div className="container mx-auto px-4 py-12 max-w-6xl min-h-[80vh]">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-16 space-y-4"
            >
                <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-4">
                    <Layers className="w-8 h-8 text-primary" />
                </div>
                <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">
                    System Design & Architecture
                </h1>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                    A deep dive into the software engineering principles, architectural patterns, and engineering decisions that power the AlgoLab platform.
                </p>
            </motion.div>

            {/* Design Philosophy */}
            <motion.section
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="mb-20"
            >
                <div className="flex items-center gap-3 mb-8">
                    <Shield className="w-6 h-6 text-primary" />
                    <h2 className="text-3xl font-semibold">Design Philosophy</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                        {
                            title: "Clarity Over Complexity",
                            description: "Educational tools must be intuitive. We prioritize clear visual mappings of abstract concepts over complex, multi-layered abstractions that obscure the underlying logic."
                        },
                        {
                            title: "Deterministic Correctness",
                            description: "Algorithm education requires 100% accuracy. Decision logic and grading systems are built on rigid, rule-based engines rather than probabilistic AI models."
                        },
                        {
                            title: "Architecture for Growth",
                            description: "Every component is designed as a standalone module. This allows the platform to scale from sorting algorithms to complex graph theories without core refactoring."
                        }
                    ].map((item, i) => (
                        <Card key={i} className="glass-panel border-panel-border hover:glow-border-primary transition-all duration-300">
                            <CardHeader>
                                <CardTitle className="text-lg">{item.title}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground leading-relaxed">{item.description}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </motion.section>

            {/* Layered Architecture Diagram */}
            <motion.section
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="mb-20"
            >
                <div className="flex items-center gap-3 mb-8">
                    <GitBranch className="w-6 h-6 text-primary" />
                    <h2 className="text-3xl font-semibold">Layered Architecture</h2>
                </div>

                <div className="relative p-8 rounded-2xl bg-black/20 border border-panel-border overflow-hidden">
                    <div className="grid gap-6 relative z-10">
                        {/* Presentation Layer */}
                        <div className="p-6 rounded-xl bg-primary/5 border border-primary/20 flex flex-col md:flex-row items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-primary/10 rounded-lg"><Cpu className="w-6 h-6 text-primary" /></div>
                                <div>
                                    <h3 className="font-bold text-lg">Presentation Layer</h3>
                                    <p className="text-sm text-muted-foreground italic">React · Tailwind CSS · Framer Motion</p>
                                </div>
                            </div>
                            <p className="text-sm max-w-md text-right md:block hidden">State management and reactive UI updates for algorithm visualizations.</p>
                        </div>

                        <div className="flex justify-center"><ArrowRight className="w-6 h-6 text-muted-foreground rotate-90" /></div>

                        {/* Logic Layer */}
                        <div className="p-6 rounded-xl bg-purple-500/5 border border-purple-500/20 flex flex-col md:flex-row items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-purple-500/10 rounded-lg"><Code2 className="w-6 h-6 text-purple-500" /></div>
                                <div>
                                    <h3 className="font-bold text-lg">Logic Layer</h3>
                                    <p className="text-sm text-muted-foreground italic">Simulation Engine · Rule Engines · Validation Logic</p>
                                </div>
                            </div>
                            <p className="text-sm max-w-md text-right md:block hidden">Deterministic algorithm execution and automated grading logic.</p>
                        </div>

                        <div className="flex justify-center"><ArrowRight className="w-6 h-6 text-muted-foreground rotate-90" /></div>

                        {/* Infrastructure Layer */}
                        <div className="p-6 rounded-xl bg-orange-500/5 border border-orange-500/20 flex flex-col md:flex-row items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-orange-500/10 rounded-lg"><Server className="w-6 h-6 text-orange-500" /></div>
                                <div>
                                    <h3 className="font-bold text-lg">Infrastructure Layer</h3>
                                    <p className="text-sm text-muted-foreground italic">Netlify Serverless · OpenRouter (LLM) · Static CDN</p>
                                </div>
                            </div>
                            <p className="text-sm max-w-md text-right md:block hidden">Elastic serverless compute and intelligent knowledge retrieval.</p>
                        </div>
                    </div>
                </div>
            </motion.section>

            {/* Engineering Decisions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
                <motion.section
                    initial={{ x: -20, opacity: 0 }}
                    whileInView={{ x: 0, opacity: 1 }}
                    viewport={{ once: true }}
                >
                    <div className="flex items-center gap-3 mb-8">
                        <Zap className="w-6 h-6 text-primary" />
                        <h2 className="text-3xl font-semibold">Engineering Decisions</h2>
                    </div>
                    <div className="space-y-6">
                        <div className="p-4 rounded-lg border border-panel-border bg-accent/50">
                            <h4 className="font-bold mb-2">Why Serverless Architecture?</h4>
                            <p className="text-sm text-muted-foreground">
                                By utilizing Netlify Functions, we achieve zero-cost cold starts, automatic scaling for traffic spikes, and a significantly reduced attack surface by eliminating the need for managed server instances.
                            </p>
                        </div>
                        <div className="p-4 rounded-lg border border-panel-border bg-accent/50">
                            <h4 className="font-bold mb-2">Why Rule-Based vs AI Decisions?</h4>
                            <p className="text-sm text-muted-foreground">
                                Algorithmic correctness is binary. We use deterministic tree-based logic for pathfinding and grading to ensure users are never misled by "hallucinating" AI models in core learning paths.
                            </p>
                        </div>
                        <div className="p-4 rounded-lg border border-panel-border bg-accent/50">
                            <h4 className="font-bold mb-2">Why Client-Side Simulations?</h4>
                            <p className="text-sm text-muted-foreground">
                                Visualization logic runs strictly in the browser. This ensures sub-millisecond feedback loops during step-by-step execution, reduces server costs, and enables offline learning capabilities.
                            </p>
                        </div>
                    </div>
                </motion.section>

                <motion.section
                    initial={{ x: 20, opacity: 0 }}
                    whileInView={{ x: 0, opacity: 1 }}
                    viewport={{ once: true }}
                >
                    <div className="flex items-center gap-3 mb-8">
                        <MessageSquare className="w-6 h-6 text-primary" />
                        <h2 className="text-3xl font-semibold">Controlled AI Usage</h2>
                    </div>
                    <div className="p-8 rounded-2xl border-2 border-dashed border-primary/30 bg-primary/5 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <Lock className="w-24 h-24" />
                        </div>
                        <p className="text-lg font-medium mb-6">We maintain a strict boundary for Artificial Intelligence to ensure educational integrity:</p>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3">
                                <div className="p-1 rounded bg-green-500/20 text-green-500 mt-1"><Zap className="w-4 h-4" /></div>
                                <div>
                                    <span className="font-bold">Authorized Use:</span>
                                    <p className="text-sm text-muted-foreground">Generating dynamic practice problems and providing natural language context for algorithmic theories.</p>
                                </div>
                            </li>
                            <li className="flex items-start gap-3">
                                <div className="p-1 rounded bg-red-500/20 text-red-500 mt-1"><Shield className="w-4 h-4" /></div>
                                <div>
                                    <span className="font-bold">Strictly Prohibited:</span>
                                    <p className="text-sm text-muted-foreground">AI is never used to determine the "correctness" of a solution or to execute student-submitted logic.</p>
                                </div>
                            </li>
                        </ul>
                    </div>
                </motion.section>
            </div>

            {/* Separation of Concerns & Extensibility */}
            <motion.section
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                className="mb-20 p-8 rounded-2xl bg-accent/20 border border-panel-border"
            >
                <div className="flex items-center gap-3 mb-8">
                    <Database className="w-6 h-6 text-primary" />
                    <h2 className="text-3xl font-semibold">Separation of Concerns</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div className="space-y-4">
                        <p className="text-muted-foreground">
                            The platform is architected with a strict decoupling of state and visualization:
                        </p>
                        <ul className="space-y-2">
                            <li className="flex items-center gap-2 text-sm font-medium">
                                <div className="w-2 h-2 rounded-full bg-primary" />
                                Visualization Engine: Purely handles DOM updates & animations.
                            </li>
                            <li className="flex items-center gap-2 text-sm font-medium">
                                <div className="w-2 h-2 rounded-full bg-primary" />
                                Algorithm Runners: Isolated logic modules that yield execution states.
                            </li>
                            <li className="flex items-center gap-2 text-sm font-medium">
                                <div className="w-2 h-2 rounded-full bg-primary" />
                                AI Gateway: Stateless proxy to external knowledge endpoints.
                            </li>
                        </ul>
                    </div>
                    <div className="p-6 rounded-xl bg-white/5 border border-white/10">
                        <h4 className="font-bold mb-3 flex items-center gap-2">
                            <Zap className="w-4 h-4 text-yellow-500" /> Future Extensibility
                        </h4>
                        <p className="text-sm text-muted-foreground">
                            The current interface-driven design allows for the injection of new Algorithm Categories (Dynamic Programming, Backtracking) and Storage Providers (Supabase/PostgreSQL) without refactoring the core simulation or UI orchestration layers.
                        </p>
                    </div>
                </div>
            </motion.section>
        </div>
    );
};

export default SystemDesign;
