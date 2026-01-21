import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DecisionNode as DecisionNodeType } from "@/data/sortingTree";
import { GitBranch } from "lucide-react";

interface DecisionNodeProps {
    node: DecisionNodeType;
    onSelect: (optionLabel: string, nextId: string) => void;
}

export const DecisionNode = ({ node, onSelect }: DecisionNodeProps) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-2xl mx-auto"
        >
            <Card className="border-2 border-primary/10 shadow-lg">
                <CardHeader className="text-center pb-2">
                    <div className="mx-auto bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mb-4 text-primary">
                        <GitBranch className="w-6 h-6" />
                    </div>
                    <CardTitle className="text-2xl font-bold">{node.question}</CardTitle>
                    <CardDescription>Choose the option that best fits your requirements</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4 mt-6">
                    {node.options.map((option, idx) => (
                        <Button
                            key={idx}
                            variant="outline"
                            className="w-full h-auto py-4 px-6 text-lg justify-start gap-4 hover:border-primary/50 hover:bg-primary/5 transition-all text-left group"
                            onClick={() => onSelect(option.label, option.nextId)}
                        >
                            <div className="w-6 h-6 rounded-full border border-primary/30 flex items-center justify-center text-xs text-primary/0 group-hover:text-primary transition-colors">
                                {String.fromCharCode(65 + idx)}
                            </div>
                            {option.label}
                        </Button>
                    ))}
                </CardContent>
            </Card>
        </motion.div>
    );
};
