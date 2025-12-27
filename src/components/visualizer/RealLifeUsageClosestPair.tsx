import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Play, RotateCcw, MapPin } from 'lucide-react';

export function RealLifeUsageClosestPair() {
    // Scenario: Locations on a map
    // We want to find the two closest locations

    type Point = {
        id: number;
        x: number;
        y: number;
        label: string;
    };

    // Fixed set of points for consistent "random" demonstration
    const initialPoints: Point[] = [
        { id: 1, x: 20, y: 30, label: 'A' },
        { id: 2, x: 80, y: 20, label: 'B' },
        { id: 3, x: 50, y: 50, label: 'C' },
        { id: 4, x: 30, y: 70, label: 'D' },
        { id: 5, x: 60, y: 80, label: 'E' },
        { id: 6, x: 75, y: 60, label: 'F' },
        { id: 7, x: 25, y: 35, label: 'G' }, // Close to A
    ];

    const [points, setPoints] = useState<Point[]>(initialPoints);
    const [currentPair, setCurrentPair] = useState<[number, number] | null>(null); // IDs being compared
    const [closestPair, setClosestPair] = useState<[number, number] | null>(null); // IDs of best so far
    const [minDist, setMinDist] = useState<number>(Infinity);
    const [message, setMessage] = useState('عندنا أماكن كتير ع الخريطة... عايزين نعرف مين أقرب مكانين لبعض');
    const [isRunning, setIsRunning] = useState(false);
    const [isFinished, setIsFinished] = useState(false);

    const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    const getDistance = (p1: Point, p2: Point) => {
        return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
    };

    const reset = () => {
        setCurrentPair(null);
        setClosestPair(null);
        setMinDist(Infinity);
        setMessage('عندنا أماكن كتير ع الخريطة... عايزين نعرف مين أقرب مكانين لبعض');
        setIsRunning(false);
        setIsFinished(false);
    };

    const runSimulation = async () => {
        if (isRunning) return;
        setIsRunning(true);
        setIsFinished(false);

        let bestDist = Infinity;
        let bestPair: [number, number] | null = null;

        setMessage('نبدأ نقارن المسافات بين الأماكن وبعضها');
        await delay(1000);

        const comparisons = [
            [0, 1], // A-B (Far)
            [0, 6], // A-G (Very Close) -> New Best
            [1, 2], // B-C (Medium)
            [2, 5], // C-F (Medium)
            [4, 5], // E-F (Close-ish)
            [3, 0], // D-A (Far)
        ];

        for (let i = 0; i < points.length; i++) {
            for (let j = i + 1; j < points.length; j++) {
                const p1 = points[i];
                const p2 = points[j];
                const d = getDistance(p1, p2);

                setCurrentPair([p1.id, p2.id]);

                if (bestPair === null) {
                    bestDist = d;
                    bestPair = [p1.id, p2.id];
                    setClosestPair([p1.id, p2.id]);
                    setMinDist(d);
                    setMessage('دول أول مكانين قسنا بينهم... حالياً هما الأقرب');
                    await delay(800);
                } else {
                    if (d < bestDist) {
                        setMessage('لقينا اتنين أقرب لبعض! نحدّث النتيجة');
                        bestDist = d;
                        bestPair = [p1.id, p2.id];
                        setClosestPair([p1.id, p2.id]);
                        setMinDist(d);
                        await delay(1200);
                    } else {
                        if (Math.random() > 0.7) {
                            setMessage('لا، دول بعاد عن بعض... نشوف غيرهم');
                            await delay(600);
                        } else {
                            await delay(200);
                        }
                    }
                }
            }
        }

        setCurrentPair(null);
        setMessage('الخوارزمية لفّت وقارنت بين أماكن كتير\nوكل شوية تلاقي مسافة أقصر\nوفي الآخر وصلت لأقرب مكانين لبعض\nمن غير ما تلف عالفاضي 👌');
        setIsRunning(false);
        setIsFinished(true);
    };

    return (
        <div className="mt-4 p-4 border-2 border-primary/20 rounded-lg bg-background/50">
            <h4 className="text-xl font-bold mb-4 text-center text-primary">أقرب مكانين (Closest Pair)</h4>

            <div className="relative w-full h-[350px] bg-[#f0f0e6] dark:bg-slate-900 rounded-xl overflow-hidden mb-6 border-4 border-white/50 shadow-xl">
                {/* Map Styling: CSS Pattern for Streets */}
                <div className="absolute inset-0 opacity-40 pointer-events-none"
                    style={{
                        backgroundImage: `
                            linear-gradient(transparent 95%, #cbd5e1 95%),
                            linear-gradient(90deg, transparent 95%, #cbd5e1 95%)
                        `,
                        backgroundSize: '40px 40px'
                    }}
                />

                {/* City Blocks (Decorative) */}
                <div className="absolute top-[10%] left-[10%] w-[30%] h-[20%] bg-blue-200/20 rounded-lg pointer-events-none" />
                <div className="absolute bottom-[20%] right-[10%] w-[25%] h-[25%] bg-green-200/20 rounded-lg pointer-events-none" />
                <div className="absolute top-[40%] right-[40%] w-[20%] h-[15%] bg-amber-200/20 rounded-lg pointer-events-none" />

                {/* Connection Line (Current) */}
                {currentPair && (
                    <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
                        <line
                            x1={`${points.find(p => p.id === currentPair[0])?.x}%`}
                            y1={`${points.find(p => p.id === currentPair[0])?.y}%`}
                            x2={`${points.find(p => p.id === currentPair[1])?.x}%`}
                            y2={`${points.find(p => p.id === currentPair[1])?.y}%`}
                            className="stroke-slate-500 stroke-[2] stroke-dasharray-4"
                            strokeLinecap="round"
                        />
                    </svg>
                )}

                {/* Connection Line (Best) */}
                {closestPair && (
                    <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
                        <line
                            x1={`${points.find(p => p.id === closestPair[0])?.x}%`}
                            y1={`${points.find(p => p.id === closestPair[0])?.y}%`}
                            x2={`${points.find(p => p.id === closestPair[1])?.x}%`}
                            y2={`${points.find(p => p.id === closestPair[1])?.y}%`}
                            className={cn(
                                "stroke-[4] transition-colors duration-300 drop-shadow-md",
                                isFinished ? "stroke-green-600" : "stroke-amber-500"
                            )}
                            strokeLinecap="round"
                        />
                    </svg>
                )}

                {/* Points */}
                {points.map((val) => {
                    const isCurrent = currentPair?.includes(val.id);
                    const isBest = closestPair?.includes(val.id);

                    return (
                        <div
                            key={val.id}
                            className={cn(
                                "absolute w-8 h-8 -ml-4 -mt-8 transition-all duration-300 flex flex-col items-center justify-end z-20 group",
                                isBest ? "z-30 scale-125" : isCurrent ? "z-30 scale-110" : "scale-100"
                            )}
                            style={{ left: `${val.x}%`, top: `${val.y}%` }}
                        >
                            {/* Pin Icon */}
                            <div className={cn(
                                "relative flex items-center justify-center w-8 h-8 transition-colors duration-300",
                                isBest ? (isFinished ? "text-green-600 drop-shadow-lg" : "text-amber-500 drop-shadow-lg") :
                                    isCurrent ? "text-blue-500 drop-shadow-md" : "text-red-500/80 hover:text-red-600"
                            )}>
                                <MapPin className="w-full h-full fill-current" />
                                <div className="absolute w-2 h-2 bg-white rounded-full top-[9px]" />
                            </div>

                            {/* Shadow/Base */}
                            <div className="w-4 h-1 bg-black/20 rounded-full blur-[1px] mt-[-2px]" />
                        </div>
                    );
                })}
            </div>

            {/* Message Box */}
            <div className="min-h-[80px] w-full p-4 bg-muted/30 rounded-lg text-center mb-4 dir-rtl border border-border/50">
                <p className="text-base md:text-lg font-medium whitespace-pre-line dir-rtl leading-relaxed" style={{ direction: 'rtl' }}>
                    {message}
                </p>
            </div>

            {/* Controls */}
            <div className="flex justify-center gap-2">
                {!isRunning && !isFinished && (
                    <Button onClick={runSimulation} className="bg-primary hover:bg-primary/90 text-lg px-8 py-6 h-auto">
                        <Play className="w-5 h-5 mr-2" />
                        ابدأ البحث
                    </Button>
                )}
                {(isFinished || isRunning) && (
                    <Button onClick={reset} disabled={isRunning} variant="outline" className="px-6">
                        <RotateCcw className="w-4 h-4 mr-2" />
                        عيدي تاني
                    </Button>
                )}
            </div>
        </div>
    );
}
