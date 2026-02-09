import { useState, useCallback } from 'react';

export interface GeneratedProblem {
    id: string;
    title: string;
    description: string;
    input: number[];
    optimalAlgorithm: string;
    explanation: string;
    suboptimalOptions: string[];
    incorrectOptions: string[];
}

export type TestState = 'setup' | 'loading' | 'testing' | 'result';
export type AnswerStatus = 'correct' | 'suboptimal' | 'incorrect';

export function useLearningTest() {
    const [state, setState] = useState<TestState>('setup');
    const [problem, setProblem] = useState<GeneratedProblem | null>(null);
    const [userChoice, setUserChoice] = useState<string | null>(null);
    const [result, setResult] = useState<AnswerStatus | null>(null);
    const [attempts, setAttempts] = useState<Set<string>>(new Set());
    const [currentTopic, setCurrentTopic] = useState<string>('sorting');

    const generateProblem = useCallback(async (difficulty: string, topic: string) => {
        setState('loading');
        setCurrentTopic(topic);
        try {
            const response = await fetch('/.netlify/functions/generate-problem', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ difficulty, topic })
            });
            const data = await response.json();
            setProblem(data);
            setState('testing');
            setUserChoice(null);
            setResult(null);
        } catch (error) {
            console.error("Failed to generate problem", error);
            setState('setup'); // Go back to setup on error
        }
    }, []);

    const submitAnswer = useCallback((algorithmId: string) => {
        if (!problem) return;
        setUserChoice(algorithmId);

        if (algorithmId === problem.optimalAlgorithm) {
            setResult('correct');
        } else if (problem.suboptimalOptions.includes(algorithmId)) {
            setResult('suboptimal');
        } else {
            setResult('incorrect');
        }

        setAttempts(prev => {
            const newSet = new Set(prev);
            newSet.add(problem.id);
            return newSet;
        });

        setState('result');
    }, [problem]);

    const resetTest = useCallback(() => {
        setState('setup');
        setProblem(null);
        setUserChoice(null);
        setResult(null);
    }, []);

    const nextProblem = useCallback(() => {
        // Keep current difficulty/topic? For now, reset to setup to let them choose again or we could store diff/topic
        setState('setup');
    }, []);

    return {
        state,
        problem,
        userChoice,
        result,
        generateProblem,
        submitAnswer,
        resetTest,
        nextProblem,
        currentTopic
    };
}
