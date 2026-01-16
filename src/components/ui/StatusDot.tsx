import { cn } from "@/lib/utils";

interface StatusDotProps {
    status: 'online' | 'offline';
    className?: string;
}

export function StatusDot({ status, className }: StatusDotProps) {
    return (
        <span
            className={cn(
                "inline-block h-3 w-3 rounded-full border-2 border-white dark:border-zinc-900",
                status === 'online' ? "bg-[#22c55e]" : "bg-zinc-300 dark:bg-zinc-600",
                className
            )}
        />
    );
}
