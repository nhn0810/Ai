import { createClient } from '@/lib/supabase/server';
import CheckInButton from './CheckInButton';
import StudyActions from './StudyActions';
import { notFound } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

import MemberList from './MemberList';

async function getStudyDetails(studyId: string) {
    const supabase = await createClient();
    
    // Fetch study details with leader info
    const { data: study, error } = await supabase
        .from('studies')
        .select(`
            *,
            leader:leader_id ( nickname, avatar_url )
        `)
        .eq('id', studyId)
        .single();

    if (error || !study) {
        return null;
    }

    // Fetch members
    const { data: members } = await supabase
        .from('study_members')
        .select(`
            *,
            profile:user_id ( nickname, avatar_url, manner_score )
        `)
        .eq('study_id', studyId);

    // Fetch today's attendance logs for this study
    // Note: In a real app, you'd filter by specific meeting date window
    const { data: attendanceLogs } = await supabase
        .from('attendance_logs')
        .select('user_id')
        .eq('study_id', studyId);

    // Get current user
    const { data: { user } } = await supabase.auth.getUser();

    // Determine current user's status
    const isLeader = user?.id === study.leader_id;
    const membership = members?.find(m => m.user_id === user?.id);
    const isMember = membership?.role === 'member' || isLeader; // Leader is also a member
    const isPending = membership?.role === 'pending';


    // Mock location and time (keep existing mock logic)
    const mockStudyLocation = { latitude: 37.4979, longitude: 127.0276 }; 
    const mockMeetingTime = new Date(); 
    mockMeetingTime.setMinutes(mockMeetingTime.getMinutes() + 10);

    return { 
        ...study, 
        members: members || [], 
        attendanceLogs: attendanceLogs || [],
        isLeader, 
        isMember, 
        isPending,
        location: mockStudyLocation, 
        meetingTime: mockMeetingTime 
    };
}

export default async function StudyDetailPage({ params }: { params: { id: string } }) {
    const study = await getStudyDetails(params.id);

    if (!study) {
        return notFound();
    }

    return (
        <div className="p-4 space-y-6 pb-24">
            <header className="space-y-2">
                <div className="flex justify-between items-start">
                    <h1 className="text-2xl font-bold text-secondary">{study.title}</h1>
                    <Badge variant={study.status === 'active' ? 'default' : 'secondary'}>
                        {study.status === 'active' ? '모집중' : '종료됨'}
                    </Badge>
                </div>
                <p className="text-gray-600">{study.description}</p>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                    <span>리더: {study.leader?.nickname || 'Unknown'}</span>
                    <span>•</span>
                    <span>{study.enrollment_type === 'open' ? '공개 스터디' : '승인제'}</span>
                </div>
            </header>

            {/* Actions Area */}
            <StudyActions 
                studyId={study.id}
                enrollmentType={study.enrollment_type as 'open' | 'approval'}
                isMember={study.isMember}
                isLeader={study.isLeader}
                isPending={study.isPending}
                studyStatus={study.status as 'active' | 'ended'}
            />

            {/* Check-In Section (Only for members) */}
            {study.isMember && study.status === 'active' && (
                <div className="bg-white p-6 rounded-xl shadow-lg border border-primary/20">
                    <h2 className="font-bold text-lg text-secondary mb-4">📢 출석 체크</h2>
                    <CheckInButton
                        studyId={study.id}
                        studyLocation={study.location}
                        meetingTime={study.meetingTime}
                    />
                </div>
            )}

            {/* Members List with Leader Override */}
            <MemberList 
                studyId={study.id}
                members={study.members}
                attendanceLogs={study.attendanceLogs}
                isLeader={study.isLeader}
            />
        </div>
    );
}