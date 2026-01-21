import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { DecisionResult as DecisionResultType } from "@/data/sortingTree";
import { CheckCircle2, Play, Trophy, BookOpen, RotateCcw } from "lucide-react";

interface DecisionResultProps {
    result: DecisionResultType;
    onReset: () => void;
}

export const DecisionResult = ({ result, onReset }: DecisionResultProps) => {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-3xl mx-auto"
        >
            <Card className="border-2 border-green-500/20 shadow-xl overflow-hidden">
                <div className="bg-green-500/10 p-6 flex flex-col items-center text-center border-b border-green-500/10">
                    <div className="w-16 h-16 bg-green-500 text-white rounded-full flex items-center justify-center mb-4 shadow-lg shadow-green-500/20">
                        <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <h2 className="text-sm font-medium text-green-600 dark:text-green-400 uppercase tracking-widest mb-2">Recommended Algorithm</h2>
                    <CardTitle className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-400 dark:to-emerald-400">
                        {result.algorithm}
                    </CardTitle>
                </div>

                <CardContent className="p-8 space-y-8">
                    <div className="space-y-4">
                        <h3 className="text-xl font-semibold flex items-center gap-2">
                            <BookOpen className="w-5 h-5 text-primary" />
                            Why this choice?
                        </h3>
                        <p className="text-lg leading-relaxed text-muted-foreground">
                            {result.why}
                        </p>
                    </div>

                    <div className="space-y-3 p-5 bg-muted/30 rounded-lg border border-border/50">
                        <h3 className="font-semibold text-muted-foreground text-sm uppercase tracking-wider">Why not others?</h3>
                        <ul className="space-y-2">
                            {result.whyNot.map((reason, idx) => (
                                <li key={idx} className="text-sm text-foreground/80 flex items-start gap-2">
                                    <span className="block w-1.5 h-1.5 rounded-full bg-red-400 mt-2 flex-shrink-0" />
                                    {reason}
                                </li>
                            ))}
                        </ul>
                    </div>
                </CardContent>

                <CardFooter className="bg-muted/10 p-6 grid sm:grid-cols-2 gap-3">
                    {result.links.visualizer && (
                        <Button asChild className="w-full gap-2 h-12 text-base shadow-md">
                            <Link to={result.links.visualizer}>
                                <Play className="w-4 h-4" />
                                Visualize {result.algorithm}
                            </Link>
                        </Button>
                    )}
                    {result.links.learning && (
                        <Button asChild variant="secondary" className="w-full gap-2 h-12 text-base">
                            <Link to={result.links.learning}>
                                <BookOpen className="w-4 h-4" />
                                Learn & Test
                            </Link>
                        </Button>
                    )}
                    {result.links.battle && (
                        <Button asChild variant="outline" className="w-full gap-2 h-12 text-base sm:col-span-2 border-primary/20 hover:bg-primary/5">
                            <Link to={result.links.battle}>
                                <Trophy className="w-4 h-4 text-amber-500" />
                                Compare in Battle Mode
                            </Link>
                        </Button>
                    )}
                    <Button variant="ghost" className="w-full sm:col-span-2 mt-2 text-muted-foreground" onClick={onReset}>
                        <RotateCcw className="w-4 h-4 mr-2" />
                        Start Over
                    </Button>
                </CardFooter>
            </Card>
        </motion.div>
    );
};
