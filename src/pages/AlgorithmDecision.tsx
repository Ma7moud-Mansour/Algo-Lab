import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { algorithmDecisionData, DecisionStep } from "@/data/algorithmDecisionData";
import { DecisionNode } from "@/components/decision/DecisionNode";
import { DecisionResult } from "@/components/decision/DecisionResult";
import { DecisionBreadcrumbs } from "@/components/decision/DecisionBreadcrumbs";
import { GitBranch } from "lucide-react";

export default function AlgorithmDecision() {
    const [currentNodeId, setCurrentNodeId] = useState<string>('root');
    const [history, setHistory] = useState<{ id: string; label: string }[]>([]);

    const currentNode = algorithmDecisionData[currentNodeId] as DecisionStep;

    const handleSelectOption = (optionLabel: string, nextId: string) => {
        setHistory(prev => [...prev, { id: currentNodeId, label: optionLabel }]);
        setCurrentNodeId(nextId);
    };

    const handleReset = () => {
        setCurrentNodeId('root');
        setHistory([]);
    };

    const handleNavigateHistory = (index: number) => {
        // If navigating to root (empty history), handle separately or implicitly
        if (index < 0) {
            handleReset();
            return;
        }

        const newHistory = history.slice(0, index + 1);
        const targetStep = newHistory[newHistory.length - 1];
        // We need to find the node that *led* to this step? 
        // No, the history records the *answer* taken at a node.
        // If I click breadcrumb index 0, I want to go to the state *after* that decision?
        // Actually usually breadcrumbs link to the state *of* that node.
        // But my history structure is [ {id: 'root', label: 'Small'} ].
        // If I click "Small", do I want to go back to "root" to change it, or to the next step?
        // Let's standard: Breadcrumbs show the *path*. Clicking one usually takes you back to that point.
        // Simplest: Click a breadcrumb -> Go back to that *Question* to change answer.
        // So if history is [Root(Answer:Small) -> SmallSize(Answer:Sorted)],
        // Breadcrumbs are: Home > Small > Sorted
        // Click "Small" -> Go explicitly to 'root' node to re-choose? Or go to the result of "Small"?

        // Let's simplified: Breadcrumbs list the *Choices Made*.
        // Clicking a choice removes it and all subsequent choices, taking you back to that node.

        const historyItem = history[index];
        setCurrentNodeId(historyItem.id);
        setHistory(history.slice(0, index));
    };


    return (
        <div className="container mx-auto px-4 py-12 max-w-4xl min-h-[80vh] flex flex-col">
            <div className="text-center mb-10 space-y-4">
                <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-4">
                    <GitBranch className="w-8 h-8 text-primary" />
                </div>
                <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">
                    Algorithm Decision Tree
                </h1>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                    Not sure which algorithm to use? Answer a few simple questions to find the best sorting algorithm for your specific case.
                </p>
            </div>

            <DecisionBreadcrumbs
                items={history.map(h => ({ id: h.id, label: h.label }))}
                onNavigate={handleNavigateHistory}
                onReset={handleReset}
            />

            <div className="flex-1 flex items-center justify-center">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentNodeId}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="w-full"
                    >
                        {currentNode.type === 'question' ? (
                            <DecisionNode node={currentNode} onSelect={handleSelectOption} />
                        ) : (
                            <DecisionResult result={currentNode} onReset={handleReset} />
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
}
