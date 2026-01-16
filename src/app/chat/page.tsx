import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/Avatar';
import PageHeader from '@/components/layout/PageHeader';

interface ChatRoom {
    id: number;
    title: string;
    description: string | null;
    lastMessage: string;
    unreadCount: number;
    lastMessageAt: Date;
}

async function getChatRooms(): Promise<ChatRoom[]> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return [];

    const { data: rooms, error } = await supabase
        .from('study_members')
        .select(`
            study:studies ( id, title, description )
        `)
        .eq('user_id', user.id);

    if (error || !rooms) {
        console.error('Error fetching chat rooms:', error);
        return [];
    }

    // Filter out any null studies and map
    return rooms
        .map(room => {
            const study = room.study;
            // Handle case where join returns an array
            if (Array.isArray(study)) return study[0];
            return study;
        })
        .filter((study): study is { id: number; title: string; description: string | null } => !!study)
        .map(study => ({
            id: study.id,
            title: study.title,
            description: study.description,
            lastMessage: '채팅방에 입장하여 대화를 시작하세요!', // Placeholder
            unreadCount: 0,
            lastMessageAt: new Date(),
        }));
}


const ChatRoomItem = ({ room }: { room: ChatRoom }) => (
    <Link href={`/chat/${room.id}`}>
        <div className="flex items-center gap-4 p-4 bg-white rounded-lg shadow transition-colors hover:bg-gray-50">
            <Avatar className="h-12 w-12 bg-primary/10 text-primary">
                <AvatarFallback>{room.title.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
                <h3 className="font-bold text-secondary">{room.title}</h3>
                <p className="text-sm text-gray-500 truncate">{room.lastMessage}</p>
            </div>
            <div className="text-right">
                <p className="text-xs text-gray-400 mb-1">
                    {room.lastMessageAt.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}
                </p>
                {room.unreadCount > 0 && (
                    <span className="bg-primary text-white text-xs font-bold rounded-full px-2 py-1">
                        {room.unreadCount}
                    </span>
                )}
            </div>
        </div>
    </Link>
);

export default async function ChatPage() {
    const chatRooms = await getChatRooms();

    return (
        <>
            <PageHeader title="채팅" />
            <div className="pt-20 p-4">
                <div className="space-y-3">
                    {chatRooms.map(room => (
                        <ChatRoomItem key={room.id} room={room} />
                    ))}
                    {chatRooms.length === 0 && (
                        <div className="text-center py-10">
                            <p className="text-gray-500">참여중인 스터디 채팅방이 없습니다.</p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}