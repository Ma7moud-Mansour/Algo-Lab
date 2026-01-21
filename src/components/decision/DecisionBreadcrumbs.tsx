import { ChevronRight, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BreadcrumbItem {
    id: string;
    label: string;
}

interface DecisionBreadcrumbsProps {
    items: BreadcrumbItem[];
    onNavigate: (index: number) => void;
    onReset: () => void;
}

export const DecisionBreadcrumbs = ({ items, onNavigate, onReset }: DecisionBreadcrumbsProps) => {
    return (
        <div className="flex flex-wrap items-center gap-2 mb-6 text-sm text-muted-foreground animate-in fade-in slide-in-from-top-2">
            <Button
                variant="ghost"
                size="sm"
                className="h-8 p-1 sm:px-2 hover:bg-transparent hover:text-primary transition-colors"
                onClick={onReset}
            >
                <Home className="w-4 h-4" />
                <span className="sr-only">Reset</span>
            </Button>

            {items.map((item, index) => (
                <div key={item.id} className="flex items-center gap-1">
                    <ChevronRight className="w-4 h-4 text-muted-foreground/50" />
                    <button
                        onClick={() => onNavigate(index)}
                        className="hover:text-primary hover:underline underline-offset-4 transition-colors font-medium"
                    >
                        {item.label}
                    </button>
                </div>
            ))}
        </div>
    );
};
