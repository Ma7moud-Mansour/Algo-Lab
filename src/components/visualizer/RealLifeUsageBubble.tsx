import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Play, RotateCcw } from 'lucide-react';

export function RealLifeUsageBubble() {
    // Scenario: People in a line with numbers (priorities/prices)
    // We want to sort them ascending: Smallest (Left) -> Largest (Right)
    const initialQueue = [
        { id: 1, val: 50, color: 'bg-primary/20' }, // Person A
        { id: 2, val: 30, color: 'bg-primary/20' }, // Person B
        { id: 3, val: 40, color: 'bg-primary/20' }, // Person C
        { id: 4, val: 10, color: 'bg-primary/20' }, // Person D
        { id: 5, val: 20, color: 'bg-primary/20' }, // Person E
    ];

    const [queue, setQueue] = useState(initialQueue);
    const [comparing, setComparing] = useState<number[]>([]); // [index1, index2]
    const [message, setMessage] = useState('الطابور ملخبط، محتاجين نرتب الناس دي حسب الرقم');
    const [isRunning, setIsRunning] = useState(false);
    const [isSorted, setIsSorted] = useState(false);

    const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    const reset = () => {
        setQueue(initialQueue);
        setComparing([]);
        setMessage('الطابور ملخبط، محتاجين نرتب الناس دي حسب الرقم');
        setIsRunning(false);
        setIsSorted(false);
    };

    const runSimulation = async () => {
        if (isRunning) return;
        setIsRunning(true);
        setIsSorted(false);
        setMessage('تمام، نبدأ شغل... هنقارن كل اتنين جمب بعض');

        // We need a local copy to mutate during the async process
        let currentQueue = [...initialQueue];
        setQueue(currentQueue);

        const n = currentQueue.length;
        let sorted = false;

        // Perform Bubble Sort with delays
        for (let i = 0; i < n - 1; i++) {
            let swapped = false;

            setMessage(`اللفة رقم ${i + 1}`);
            await delay(1000);

            for (let j = 0; j < n - i - 1; j++) {
                // Highlight comparison
                setComparing([j, j + 1]);
                setMessage(`نقارن الرقم ${currentQueue[j].val} مع الرقم ${currentQueue[j + 1].val}`);
                await delay(1200);

                if (currentQueue[j].val > currentQueue[j + 1].val) {
                    // Needs swap
                    setMessage('الرقم الأول أكبر، يبقى لازم نبدّلهم');

                    // Highlight RED (wrong order)
                    // We can use the 'comparing' state to style them in the render
                    // But maybe we want specific red color temporarily?
                    // Let's rely on standard comparing color first, then maybe flash red?
                    // Or just text explanation + swap animation

                    await delay(1000);

                    // Swap
                    const temp = currentQueue[j];
                    currentQueue[j] = currentQueue[j + 1];
                    currentQueue[j + 1] = temp;

                    setQueue([...currentQueue]); // Update UI
                    swapped = true;

                    setMessage('تمام، كده بدلناهم');
                    await delay(1000);
                } else {
                    // Correct order
                    setMessage('دول واقفين صح، نكمّل');
                    await delay(800);
                }
            }

            if (!swapped) {
                sorted = true;
                break;
            }
        }

        setComparing([]);
        setMessage('كده الطابور بقى مظبوط 👌\nالخوارزمية فضلت تلف وتقارن\nوأي حد مكانه غلط كانت بتبدّله\nلحد ما كله بقى واقف صح');
        setIsRunning(false);
        setIsSorted(true);
    };

    return (
        <div className="mt-4 p-4 border-2 border-primary/20 rounded-lg bg-background/50">
            <h4 className="text-lg font-bold mb-6 text-center text-primary">ترتيب الطابور (Bubble Sort)</h4>

            {/* Queue Visualization */}
            <div className="flex justify-center items-end gap-2 md:gap-4 min-h-[160px] mb-6 px-2">
                {queue.map((person, idx) => {
                    const isComparing = comparing.includes(idx);

                    // Determine Color
                    let bgClass = "bg-primary/20 border-primary/40"; // Default
                    if (isSorted) bgClass = "bg-green-500 text-white border-green-600";
                    else if (isComparing) {
                        if (queue[comparing[0]].val > queue[comparing[1]].val) {
                            // Swapping needed - Red-ish
                            bgClass = "bg-red-500 text-white border-red-600 animate-pulse";
                        } else {
                            // Correct order - Blue/Yellow or just highlight
                            bgClass = "bg-yellow-400 text-black border-yellow-600";
                        }
                    }

                    return (
                        <div
                            key={person.id}
                            className="relative flex flex-col items-center justify-end transition-all duration-500 ease-in-out"
                            style={{
                                order: idx, // Not strictly animating position without layout projection, but maintains DOM order awareness
                                transform: isComparing ? 'scale(1.1) translateY(-10px)' : 'scale(1)'
                            }}
                        >
                            {/* Head */}
                            <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-slate-300 dark:bg-slate-600 border-2 border-slate-400 dark:border-slate-500 mb-1 shadow-sm" />

                            {/* Body / Shirt */}
                            <div className={cn(
                                "w-12 h-16 md:w-16 md:h-20 rounded-t-[1.5rem] md:rounded-t-[2rem] flex items-start justify-center pt-3 md:pt-4 border-2 shadow-md transition-colors duration-300",
                                bgClass
                            )}>
                                {/* Number Badge / Bib */}
                                <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white flex items-center justify-center shadow-lg border-2 border-slate-100 z-10">
                                    <span className="text-base md:text-lg font-black text-black">
                                        {person.val}
                                    </span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Message Box */}
            <div className="min-h-[80px] w-full p-3 bg-muted/30 rounded-lg text-center mb-4 dir-rtl">
                <p className="text-sm md:text-base font-medium whitespace-pre-line dir-rtl" style={{ direction: 'rtl' }}>
                    {message}
                </p>
            </div>

            {/* Controls */}
            <div className="flex justify-center gap-2">
                {!isRunning && !isSorted && (
                    <Button onClick={runSimulation} className="bg-green-600 hover:bg-green-700">
                        <Play className="w-4 h-4 mr-2" />
                        ابدأ الترتيب
                    </Button>
                )}
                {(isSorted || isRunning) && (
                    <Button onClick={reset} disabled={isRunning} variant="outline">
                        <RotateCcw className="w-4 h-4 mr-2" />
                        عيدي تاني
                    </Button>
                )}
            </div>
        </div>
    );
}
