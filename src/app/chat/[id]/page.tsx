import { createClient } from '@/lib/supabase/server';
import ChatRoom from './ChatRoom';

async function getInitialMessages(studyId: string) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from('messages')
        .select(`
            *,
            author:user_id ( nickname, avatar_url )
        `)
        .eq('study_id', studyId)
        .order('created_at', { ascending: false })
        .limit(50);

    if (error) {
        console.error("Error fetching messages:", error);
        return [];
    }
    // Reverse to show in chronological order (oldest at top, newest at bottom)
    return data.reverse();
}

async function getStudyDetails(studyId: string) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from('studies')
        .select('title')
        .eq('id', studyId)
        .single();

    if (error) {
        console.error("Error fetching study details:", error);
        return { title: 'Chat' };
    }
    return data;
}

export default async function ChatRoomPage({ params }: { params: { id: string } }) {
    const { id: studyId } = params;
    const initialMessages = await getInitialMessages(studyId);
    const study = await getStudyDetails(studyId);

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    return <ChatRoom initialMessages={initialMessages} study={study} studyId={studyId} user={user} />;
}