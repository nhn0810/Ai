'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { type User } from '@supabase/supabase-js';
import MessageList, { Message } from '@/components/chat/MessageList';
import ChatInput from '@/components/chat/ChatInput';

type ChatRoomProps = {
    initialMessages: Message[];
    study: { title: string };
    studyId: string;
    user: User | null;
};

export default function ChatRoom({ initialMessages, study, studyId, user }: ChatRoomProps) {
    const [messages, setMessages] = useState<Message[]>(initialMessages);
    const [hasMore, setHasMore] = useState(initialMessages.length === 50);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const supabase = createClient();

    const fetchMoreMessages = async () => {
        if (messages.length === 0 || isLoadingMore || !hasMore) return;

        setIsLoadingMore(true);
        const oldestMessage = messages[0];

        const { data, error } = await supabase
            .from('messages')
            .select('*, author:user_id ( nickname, avatar_url )')
            .eq('study_id', studyId)
            .lt('created_at', oldestMessage.created_at)
            .order('created_at', { ascending: false })
            .limit(50);

        if (error) {
            console.error("Error fetching more messages:", error);
        } else if (data) {
            if (data.length < 50) setHasMore(false);
            const olderMessages = data.reverse() as Message[];
            setMessages((prev) => [...olderMessages, ...prev]);
        }
        setIsLoadingMore(false);
    };

    useEffect(() => {
        const channel = supabase
            .channel(`chat:${studyId}`)
            .on(
                'postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'messages', filter: `study_id=eq.${studyId}` },
                async (payload) => {
                    // Fetch the full message with author info
                    const { data: newMessage, error } = await supabase
                        .from('messages')
                        .select('*, author:user_id ( nickname, avatar_url )')
                        .eq('id', payload.new.id)
                        .single();
                    
                    if (newMessage && !error) {
                        setMessages((prevMessages) => {
                            // Deduplicate based on ID just in case
                            if (prevMessages.some(m => m.id === newMessage.id)) return prevMessages;
                            return [...prevMessages, newMessage as Message];
                        });
                    }
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [supabase, studyId]);

    return (
        <div className="flex h-full flex-col">
            <header className="fixed top-0 left-1/2 -translate-x-1/2 max-w-[430px] w-full bg-white/80 backdrop-blur-sm z-10 p-4 border-b">
                <h1 className="text-xl font-bold text-center text-secondary">{study.title}</h1>
            </header>
            
            <MessageList 
                messages={messages} 
                currentUserId={user?.id} 
                onLoadMore={fetchMoreMessages}
                hasMore={hasMore}
                isLoadingMore={isLoadingMore}
            />

            {user && (
                <ChatInput studyId={studyId} userId={user.id} />
            )}
        </div>
    );
}
