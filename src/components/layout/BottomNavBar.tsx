'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Search, MessageCircle, UserRound } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
    { href: '/', icon: Home, label: '홈', notification: true },
    { href: '/study', icon: Search, label: '스터디 찾기' },
    { href: '/chat', icon: MessageCircle, label: '채팅' },
    { href: '/profile', icon: UserRound, label: '내 정보' },
];

const BottomNavBar = () => {
    const pathname = usePathname();

    // Hide nav bar on chat rooms or study creation pages
    const isHidden = pathname.includes('/chat/') || pathname === '/study/create';
    if (isHidden) {
        return null;
    }

    return (
        <div className="absolute bottom-0 w-full translate-y-0 transform border-t-2 border-primary/50 bg-white transition-transform duration-300">
            <nav className="flex h-16 items-center justify-around">
                {navItems.map((item) => {
                    const isActive = item.href === '/' ? pathname === item.href : pathname.startsWith(item.href);
                    return (
                        <Link key={item.label} href={item.href} className={cn(
                            "relative flex flex-col items-center gap-1",
                            isActive ? "text-secondary" : "text-gray-400 hover:text-secondary"
                        )}>
                            <item.icon strokeWidth={isActive ? 2.5 : 2} size={28} />
                            <span className={cn("text-xs", isActive && "font-bold")}>{item.label}</span>
                            {item.notification && isActive && (
                                <span className="absolute -top-1 right-0 block h-2 w-2 rounded-full bg-primary"></span>
                            )}
                        </Link>
                    );
                })}
            </nav>
        </div>
    );
};

export default BottomNavBar;
