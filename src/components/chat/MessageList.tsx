'use client';

import { useEffect, useRef, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/Avatar';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

export type Message = {
    id: number;
    content: string;
    image_url?: string | null;
    created_at: string;
    user_id: string;
    author: {
        nickname: string;
        avatar_url: string;
    };
};

interface MessageListProps {
    messages: Message[];
    currentUserId: string | undefined;
    onLoadMore: () => Promise<void>;
    hasMore: boolean;
    isLoadingMore: boolean;
}

const MessageItem = ({ message, isCurrentUser }: { message: Message; isCurrentUser: boolean }) => (
    <div className={cn("flex items-end gap-2", isCurrentUser ? "justify-end" : "justify-start")}>
        {!isCurrentUser && (
            <Avatar className="h-8 w-8">
                <AvatarImage src={message.author?.avatar_url} />
                <AvatarFallback>{message.author?.nickname?.charAt(0) || 'U'}</AvatarFallback>
            </Avatar>
        )}
        <div className={cn(
            "flex flex-col gap-1 max-w-xs lg:max-w-md",
            isCurrentUser ? "items-end" : "items-start"
        )}>
            {message.image_url && (
                <img 
                    src={message.image_url} 
                    alt="Shared image" 
                    className="rounded-lg max-w-full h-auto border border-gray-200"
                    style={{ maxHeight: '200px' }} 
                />
            )}
            {message.content && (
                <div className={cn(
                    "rounded-lg px-4 py-2",
                    isCurrentUser ? "bg-primary text-white" : "bg-white text-secondary shadow"
                )}>
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                </div>
            )}
        </div>
    </div>
);

export default function MessageList({ messages, currentUserId, onLoadMore, hasMore, isLoadingMore }: MessageListProps) {
    const messagesEndRef = useRef<HTMLDivElement | null>(null);
    const scrollContainerRef = useRef<HTMLDivElement | null>(null);
    const loadMoreRef = useRef<HTMLDivElement | null>(null);
    const [prevScrollHeight, setPrevScrollHeight] = useState(0);

    // Initial scroll to bottom
    useEffect(() => {
        if (messages.length > 0 && prevScrollHeight === 0) {
            messagesEndRef.current?.scrollIntoView();
        }
    }, [messages, prevScrollHeight]);

    // Preserve scroll position when loading more
    useEffect(() => {
        if (scrollContainerRef.current && prevScrollHeight > 0) {
            const newScrollHeight = scrollContainerRef.current.scrollHeight;
            scrollContainerRef.current.scrollTop = newScrollHeight - prevScrollHeight;
            setPrevScrollHeight(0);
        }
    }, [messages, prevScrollHeight]);

    // Intersection Observer for infinite scroll
    useEffect(() => {
        if (!hasMore || isLoadingMore) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    setPrevScrollHeight(scrollContainerRef.current?.scrollHeight || 0);
                    onLoadMore();
                }
            },
            { threshold: 0.1 }
        );

        if (loadMoreRef.current) {
            observer.observe(loadMoreRef.current);
        }

        return () => observer.disconnect();
    }, [hasMore, isLoadingMore, onLoadMore]);

    return (
        <div 
            ref={scrollContainerRef}
            className="flex-1 space-y-4 overflow-y-auto p-4 pt-20 pb-24"
        >
            {hasMore && (
                <div ref={loadMoreRef} className="flex justify-center p-2">
                    {isLoadingMore ? <Loader2 className="h-4 w-4 animate-spin text-gray-400" /> : <div className="h-4" />}
                </div>
            )}
            
            {messages.map((message) => (
                <MessageItem 
                    key={message.id} 
                    message={message} 
                    isCurrentUser={message.user_id === currentUserId} 
                />
            ))}
            <div ref={messagesEndRef} />
        </div>
    );
}
