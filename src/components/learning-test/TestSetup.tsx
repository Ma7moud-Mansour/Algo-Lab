import React from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { BrainCircuit, BookOpen } from "lucide-react";

interface TestSetupProps {
    onGenerate: (difficulty: string, topic: string) => void;
    isLoading: boolean;
}

export function TestSetup({ onGenerate, isLoading }: TestSetupProps) {
    const [difficulty, setDifficulty] = React.useState("medium");
    const [topic, setTopic] = React.useState("sorting");

    // React import might be implicit or needed depending on env, cleaner to import
    // But for this snippet I'll rely on global React or modify to import if needed.
    // Actually, let's add the import to be safe.

    return (
        <div className="max-w-md mx-auto pt-10">
            <Card className="border-2 border-primary/20">
                <CardHeader>
                    <CardTitle className="text-2xl flex items-center gap-2">
                        <BrainCircuit className="text-primary h-8 w-8" />
                        Learning Lab
                    </CardTitle>
                    <CardDescription>
                        Test your algorithmic intuition. We'll generate a unique problem, you choose the best solution.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Label>Difficulty Level</Label>
                        <div className="grid grid-cols-3 gap-2">
                            {['easy', 'medium', 'hard'].map((d) => (
                                <Button
                                    key={d}
                                    variant={difficulty === d ? 'default' : 'outline'}
                                    onClick={() => setDifficulty(d)}
                                    className="capitalize"
                                >
                                    {d}
                                </Button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Topic</Label>
                        <Select value={topic} onValueChange={setTopic}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="sorting">Sorting Algorithms</SelectItem>
                                <SelectItem value="searching">Searching Algorithms</SelectItem>
                                <SelectItem value="graph">Graph Algorithms</SelectItem>
                                <SelectItem value="backtracking">Backtracking</SelectItem>
                                <SelectItem value="dynamic-programming">Dynamic Programming</SelectItem>
                                <SelectItem value="greedy">Greedy Algorithms</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
                <CardFooter>
                    <Button
                        className="w-full text-lg h-12"
                        onClick={() => onGenerate(difficulty, topic)}
                        disabled={isLoading}
                    >
                        {isLoading ? "Generating Problem..." : "Start Challenge"}
                    </Button>
                </CardFooter>
            </Card>

            <div className="mt-8 grid grid-cols-2 gap-4 text-center text-muted-foreground text-sm">
                <div className="p-4 bg-muted/30 rounded-lg">
                    <BookOpen className="mx-auto mb-2 h-5 w-5 opacity-70" />
                    <p>Learn why one algorithm is better than another in specific contexts.</p>
                </div>
                <div className="p-4 bg-muted/30 rounded-lg">
                    <BrainCircuit className="mx-auto mb-2 h-5 w-5 opacity-70" />
                    <p>Practice recognizing patterns like "nearly sorted" or "small dataset".</p>
                </div>
            </div>
        </div>
    );
}
