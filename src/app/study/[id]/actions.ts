'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

const CHECK_IN_RADIUS_METERS = 100;
const CHECK_IN_WINDOW_MINUTES = 30;

// A simple haversine distance function for server-side validation
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371e3; // metres
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // in metres
}

export async function checkInAction(payload: {
    studyId: number;
    userLocation: { latitude: number; longitude: number };
}) {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return { success: false, message: '로그인이 필요합니다.' };
    }

    // 1. Fetch study details from the database (including location and meeting time)
    // NOTE: Storing location and meeting times in the DB is required for a real app.
    // Here we use mock data for demonstration, similar to the page component.
    const { data: study } = await supabase.from('studies').select('*').eq('id', payload.studyId).single();
    if (!study) {
        return { success: false, message: '스터디를 찾을 수 없습니다.' };
    }
    const studyLocation = { latitude: 37.4979, longitude: 127.0276 }; // Mock data
    const meetingTime = new Date(); // Mock data
    meetingTime.setMinutes(meetingTime.getMinutes() + 10);


    // 2. Server-side validation
    const distance = calculateDistance(payload.userLocation.latitude, payload.userLocation.longitude, studyLocation.latitude, studyLocation.longitude);
    const timeDiff = Math.abs(new Date().getTime() - new Date(meetingTime).getTime()) / (1000 * 60);

    if (distance > CHECK_IN_RADIUS_METERS) {
        return { success: false, message: `서버 확인 실패: 장소에서 너무 멉니다. (${Math.round(distance)}m)` };
    }
    if (timeDiff > CHECK_IN_WINDOW_MINUTES) {
        return { success: false, message: '서버 확인 실패: 체크인 시간이 아닙니다.' };
    }

    // 3. Check if user already checked in
    const { data: existingLog, error: existingLogError } = await supabase
        .from('attendance_logs')
        .select('id')
        .eq('study_id', payload.studyId)
        .eq('user_id', user.id)
        // A real implementation would also check for a specific meeting date
        .maybeSingle();

    if (existingLog) {
        return { success: false, message: '이미 오늘 출석체크를 완료했습니다.' };
    }


    // 4. Insert into attendance_logs
    const { error: insertError } = await supabase
        .from('attendance_logs')
        .insert({ study_id: payload.studyId, user_id: user.id });

    if (insertError) {
        return { success: false, message: `데이터베이스 오류: ${insertError.message}` };
    }

    // 5. Insert a system message into chat
    const systemMessage = `${user.user_metadata.name || 'A user'}님이 출석체크했습니다!`;
    await supabase.from('messages').insert({
        study_id: payload.studyId,
        user_id: user.id, // Or a dedicated system user ID
        content: systemMessage,
    });

    revalidatePath(`/study/${payload.studyId}`);
    return { success: true, message: '성공적으로 출석체크 되었습니다!' };
}

export async function joinStudy(studyId: number) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { success: false, message: "로그인이 필요합니다." };

    const { error } = await supabase.from('study_members').insert({
        study_id: studyId,
        user_id: user.id,
        role: 'member'
    });

    if (error) {
        return { success: false, message: error.message };
    }

    // System Message
    await supabase.from('messages').insert({
        study_id: studyId,
        user_id: user.id, 
        content: `🎉 ${user.user_metadata.name || '새 멤버'}님이 스터디에 참여했습니다!`,
    });

    revalidatePath(`/study/${studyId}`);
    return { success: true, message: "스터디에 가입되었습니다." };
}

export async function requestJoin(studyId: number) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { success: false, message: "로그인이 필요합니다." };

    const { error } = await supabase.from('study_members').insert({
        study_id: studyId,
        user_id: user.id,
        role: 'pending' 
    });

    if (error) {
        return { success: false, message: error.message };
    }

    // Optional: Notify leader (could be a system message visible only to leader, or just a generic one)
    // For now, we won't spam the chat with requests, only confirmed joins.

    revalidatePath(`/study/${studyId}`);
    return { success: true, message: "가입 요청을 보냈습니다." };
}

export async function manualCheckIn(studyId: number, userId: string) {
    const supabase = await createClient();
    const { data: { user: currentUser } } = await supabase.auth.getUser();

    if (!currentUser) return { success: false, message: "로그인이 필요합니다." };

    // Verify leader
    const { data: study } = await supabase.from('studies').select('leader_id').eq('id', studyId).single();
    if (!study || study.leader_id !== currentUser.id) {
        return { success: false, message: "권한이 없습니다." };
    }

    // Check if already checked in
    const { data: existingLog } = await supabase
        .from('attendance_logs')
        .select('id')
        .eq('study_id', studyId)
        .eq('user_id', userId)
        .maybeSingle();

    if (existingLog) {
        return { success: false, message: "이미 출석 처리되었습니다." };
    }

    const { error } = await supabase.from('attendance_logs').insert({
        study_id: studyId,
        user_id: userId,
        is_manual_override: true
    });

    if (error) {
        return { success: false, message: error.message };
    }

    // System Message
    await supabase.from('messages').insert({
        study_id: studyId,
        user_id: currentUser.id, 
        content: `✅ 리더가 멤버의 출석을 수동으로 확인했습니다.`,
    });

    revalidatePath(`/study/${studyId}`);
    return { success: true, message: "수동 출석 처리가 완료되었습니다." };
}

export async function endStudy(studyId: number) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { success: false, message: "로그인이 필요합니다." };

    // Verify leader
    const { data: study } = await supabase.from('studies').select('leader_id').eq('id', studyId).single();
    if (!study || study.leader_id !== user.id) {
        return { success: false, message: "권한이 없습니다." };
    }

    const { error } = await supabase.from('studies').update({ status: 'ended' }).eq('id', studyId);

    if (error) {
        return { success: false, message: error.message };
    }

    revalidatePath(`/study/${studyId}`);
    return { success: true, message: "스터디가 종료되었습니다." };
}
