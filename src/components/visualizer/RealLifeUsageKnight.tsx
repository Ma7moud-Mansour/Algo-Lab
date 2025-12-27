import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Play, RotateCcw, Building2, Car, Navigation, MapPin } from 'lucide-react';

export function RealLifeUsageKnight() {
    // Scenario: Delivery driver visiting every building
    const size = 5;
    const totalCells = size * size;

    const [grid, setGrid] = useState<number[][]>(Array(size).fill(0).map(() => Array(size).fill(0)));
    const [currentPos, setCurrentPos] = useState<{ r: number; c: number } | null>(null);
    const [pathHistory, setPathHistory] = useState<{ from: { r: number, c: number }, to: { r: number, c: number } }[]>([]);
    const [message, setMessage] = useState('عامل التوصيل عايز يوصل طلبات لكل العمارات دي');
    const [isRunning, setIsRunning] = useState(false);
    const [isFinished, setIsFinished] = useState(false);

    // Moves (Knight's L-shape)
    const moves = [
        { r: -2, c: 1 }, { r: -1, c: 2 }, { r: 1, c: 2 }, { r: 2, c: 1 },
        { r: 2, c: -1 }, { r: 1, c: -2 }, { r: -1, c: -2 }, { r: -2, c: -1 }
    ];

    const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    const reset = () => {
        setGrid(Array(size).fill(0).map(() => Array(size).fill(0)));
        setCurrentPos(null);
        setPathHistory([]);
        setMessage('عامل التوصيل عايز يوصل طلبات لكل العمارات دي');
        setIsRunning(false);
        setIsFinished(false);
    };

    const isSafe = (r: number, c: number, board: number[][]) => {
        return r >= 0 && c >= 0 && r < size && c < size && board[r][c] === 0;
    };

    const runSimulation = async () => {
        if (isRunning) return;
        setIsRunning(true);
        setIsFinished(false);
        setMessage('بدأنا التوصيل...');

        const board = Array(size).fill(0).map(() => Array(size).fill(0));
        await solve(0, 0, 1, board, []);

        setIsRunning(false);
        setIsFinished(true);
    };

    const solve = async (r: number, c: number, count: number, board: number[][], currentPath: any[]): Promise<boolean> => {
        board[r][c] = count;
        setGrid([...board.map(row => [...row])]);
        setCurrentPos({ r, c });

        if (currentPath.length > 0) {
            const last = currentPath[currentPath.length - 1];
            setPathHistory(prev => [...prev, { from: last, to: { r, c } }]);
        }

        if (count === totalCells) {
            setMessage('عامل التوصيل لفّ على كل العمارات\nودخل كل واحدة مرة واحدة بس\nومن غير ما يكرر\nوده بالظبط اللي الخوارزمية بتعمله 👌');
            return true;
        }

        setMessage(`وصلنا العمارة رقم ${count} - جاري التسليم 📦`);
        await delay(500);

        // Warnsdorff's heuristic
        const possibleMoves = [];
        for (let i = 0; i < 8; i++) {
            const nextR = r + moves[i].r;
            const nextC = c + moves[i].c;
            if (isSafe(nextR, nextC, board)) {
                let degree = 0;
                for (let j = 0; j < 8; j++) {
                    if (isSafe(nextR + moves[j].r, nextC + moves[j].c, board)) degree++;
                }
                possibleMoves.push({ r: nextR, c: nextC, degree });
            }
        }

        possibleMoves.sort((a, b) => a.degree - b.degree);

        for (const move of possibleMoves) {
            if (await solve(move.r, move.c, count + 1, board, [...currentPath, { r, c }])) {
                return true;
            }
        }

        setMessage('الطريق ده مقفول... نرجع نشوف سكة تانية ↩️');
        await delay(800);

        board[r][c] = 0;
        setGrid([...board.map(row => [...row])]);
        setPathHistory(prev => {
            const newHist = [...prev];
            return newHist.filter(p => !(p.to.r === r && p.to.c === c));
        });

        if (currentPath.length > 0) {
            const prevPos = currentPath[currentPath.length - 1];
            setCurrentPos(prevPos);
        } else {
            setCurrentPos(null);
        }

        return false;
    };

    return (
        <div className="mt-4 p-4 border-2 border-primary/20 rounded-lg bg-background/50">
            <h4 className="text-xl font-bold mb-4 text-center text-primary">توصيل الطلبات (City Map Layout)</h4>

            {/* MAP CONTAINER */}
            <div className="relative w-full aspect-square md:aspect-[16/9] max-h-[500px] bg-[#f4f1ea] dark:bg-slate-900 rounded-xl overflow-hidden mb-6 border-4 border-white shadow-xl">

                {/* 1. Map Background Textures */}
                <div className="absolute inset-0 opacity-100 pointer-events-none">
                    {/* Water / Park Areas (Organic shapes) */}
                    <div className="absolute top-0 right-0 w-[40%] h-[30%] bg-[#cbd5e1]/30 rounded-bl-[100px]" />
                    <div className="absolute bottom-[10%] left-[-10%] w-[30%] h-[40%] bg-[#bbf7d0]/20 rounded-tr-[80px]" />

                    {/* Major Roads (Decor) */}
                    <div className="absolute top-[30%] left-0 w-full h-2 bg-white/70" />
                    <div className="absolute top-0 left-[60%] w-2 h-full bg-white/70" />
                </div>

                {/* 2. Path History (L-Shaped Routes) */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none z-10 opacity-60">
                    <defs>
                        <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="5" refY="3.5" orient="auto">
                            <polygon points="0 0, 10 3.5, 0 7" fill="#64748b" />
                        </marker>
                    </defs>
                    {pathHistory.map((path, idx) => {
                        const x1 = (path.from.c * 20) + 10;
                        const y1 = (path.from.r * 20) + 10;
                        const x2 = (path.to.c * 20) + 10;
                        const y2 = (path.to.r * 20) + 10;

                        // Create L-shape path: Move Horizontally then Vertically? Or split half-half?
                        // Knight move is 2 squares one way, 1 square other.
                        // Let's just draw direct dashed line for simplicity and clarity on map
                        // OR a bezier curve

                        return (
                            <path
                                key={idx}
                                d={`M ${x1}% ${y1}% Q ${(x1 + x2) / 2}% ${y1}% ${x2}% ${y2}%`} // Simple quadratic curve for "route" feel
                                fill="none"
                                className="stroke-slate-500 stroke-[3] md:stroke-[4]"
                                strokeLinecap="round"
                                strokeDasharray="6,4"
                                markerEnd="url(#arrowhead)"
                            />
                        );
                    })}
                </svg>

                {/* 3. Buildings & Worker */}
                {grid.map((row, r) => (
                    row.map((val, c) => {
                        const isCurrent = currentPos?.r === r && currentPos?.c === c;
                        const isVisited = val > 0;
                        const order = val;

                        const top = (r * 20) + 10;
                        const left = (c * 20) + 10;

                        return (
                            <div
                                key={`${r}-${c}`}
                                className="absolute transform -translate-x-1/2 -translate-y-1/2 z-20"
                                style={{ top: `${top}%`, left: `${left}%` }}
                            >
                                {/* Building Spot */}
                                <div className={cn(
                                    "relative transition-all duration-500 flex flex-col items-center",
                                    isCurrent ? "scale-110 z-30" : "scale-100 z-20"
                                )}>

                                    {/* Building Icon */}
                                    <div className={cn(
                                        "w-8 h-8 md:w-10 md:h-10 rounded-sm flex items-center justify-center transition-colors duration-500 shadow-sm border",
                                        isCurrent ? "bg-blue-100 border-blue-500 shadow-md" :
                                            isVisited ? "bg-[#dcfce7] border-green-500" : // Green-ish
                                                "bg-white border-slate-200" // Default Building
                                    )}>
                                        <Building2 className={cn(
                                            "w-5 h-5 md:w-6 md:h-6",
                                            isCurrent ? "text-blue-600" :
                                                isVisited ? "text-green-600" : "text-slate-400"
                                        )} />
                                    </div>

                                    {/* Label (Order) */}
                                    {isVisited && (
                                        <span className="absolute -bottom-5 text-[10px] mobile:text-xs font-bold text-slate-600 bg-white/80 px-1 rounded shadow-sm border border-slate-100">
                                            #{order}
                                        </span>
                                    )}

                                    {/* WORKER / CAR PIN */}
                                    {isCurrent && (
                                        <div className="absolute -top-8 animate-bounce z-40 drop-shadow-xl">
                                            <div className="bg-blue-600 text-white p-1.5 rounded-full border-2 border-white shadow-lg flex items-center justify-center">
                                                <Car className="w-5 h-5 fill-white text-white" />
                                            </div>
                                            {/* Pin Tip */}
                                            <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-white mx-auto mt-[-2px]" />
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })
                ))}
            </div>

            {/* Messages */}
            <div className="min-h-[80px] w-full p-4 bg-muted/30 rounded-lg text-center mb-4 dir-rtl border border-border/50">
                <p className="text-base md:text-lg font-medium whitespace-pre-line dir-rtl leading-relaxed" style={{ direction: 'rtl' }}>
                    {message}
                </p>
            </div>

            {/* Controls */}
            <div className="flex justify-center gap-2">
                {!isRunning && !isFinished && (
                    <Button onClick={runSimulation} className="bg-primary hover:bg-primary/90 text-lg px-8 py-6 h-auto shadow-lg hover:shadow-xl transition-all">
                        <Play className="w-5 h-5 mr-2" />
                        ابدأ التوصيل
                    </Button>
                )}
                {(isFinished || isRunning) && (
                    <Button onClick={reset} disabled={isRunning} variant="outline" className="px-6 border-2 hover:bg-slate-100">
                        <RotateCcw className="w-4 h-4 mr-2" />
                        عيدي تاني
                    </Button>
                )}
            </div>
        </div>
    );
}
