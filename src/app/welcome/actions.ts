'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function updateNicknameAction(payload: {
    userId: string;
    nickname: string;
}) {
    const supabase = await createClient();
    const { userId, nickname } = payload;

    // Basic validation
    if (!nickname || nickname.trim().length < 2) {
        return { success: false, message: '닉네임은 2자 이상이어야 합니다.' };
    }

    // Check if nickname is already taken
    const { data: existingProfile, error: existingError } = await supabase
        .from('profiles')
        .select('id')
        .eq('nickname', nickname)
        .single();

    if (existingProfile) {
        return { success: false, message: '이미 사용중인 닉네임입니다.' };
    }

    const { error } = await supabase
        .from('profiles')
        .update({ nickname: nickname.trim() })
        .eq('id', userId);

    if (error) {
        return { success: false, message: `업데이트 실패: ${error.message}` };
    }

    revalidatePath('/', 'layout');
    return { success: true, message: '닉네임이 설정되었습니다.' };
}
