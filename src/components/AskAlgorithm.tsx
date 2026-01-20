import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Sparkles, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";

interface AskAlgorithmProps {
    algorithmName: string;
}

export const AskAlgorithm: React.FC<AskAlgorithmProps> = ({ algorithmName }) => {
    const [question, setQuestion] = useState('');
    const [answer, setAnswer] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleAsk = async () => {
        if (!question.trim()) return;

        setIsLoading(true);
        setError(null);
        setAnswer(null);

        try {
            const response = await fetch('/.netlify/functions/chatbot', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: question,
                    algorithm: algorithmName,
                }),
            });

            const text = await response.text();
            let data;
            try {
                data = JSON.parse(text);
            } catch (e) {
                console.error("Failed to parse JSON response:", text);
                throw new Error(`Server response was not valid JSON. Status: ${response.status}`);
            }

            if (!response.ok) {
                throw new Error(data.error || `Error ${response.status}: ${text}`);
            }

            setAnswer(data.answer);
        } catch (err: any) {
            console.error("Chatbot Error:", err);
            setError(err.message || 'Something went wrong. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card className="w-full mt-6 border-primary/20 bg-primary/5">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                    <Sparkles className="h-5 w-5 text-primary" />
                    Ask about {algorithmName}
                </CardTitle>
                <CardDescription>
                    Have a question? Our AI tutor can explain concepts specifically about {algorithmName}.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <Textarea
                    placeholder={`e.g. What is the time complexity of ${algorithmName}?`}
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    className="min-h-[100px] resize-none bg-background/50"
                />

                {error && (
                    <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
                        {error}
                    </div>
                )}

                {answer && (
                    <div className="bg-background/80 p-4 rounded-md border border-border animate-in fade-in slide-in-from-bottom-2">
                        <h4 className="font-semibold mb-2 flex items-center gap-2 text-primary">
                            <MessageSquare className="h-4 w-4" />
                            Answer
                        </h4>
                        <div className="text-sm leading-relaxed whitespace-pre-wrap">
                            {answer}
                        </div>
                    </div>
                )}
            </CardContent>
            <CardFooter className="flex justify-end">
                <Button
                    onClick={handleAsk}
                    disabled={!question.trim() || isLoading}
                    className="w-full sm:w-auto"
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Thinking...
                        </>
                    ) : (
                        <>
                            Ask Tutor
                        </>
                    )}
                </Button>
            </CardFooter>
        </Card>
    );
};
