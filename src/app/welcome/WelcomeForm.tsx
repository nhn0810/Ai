'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { updateNicknameAction } from './actions';
import { useRouter } from 'next/navigation';

export default function WelcomeForm({ userId }: { userId: string }) {
    const [nickname, setNickname] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (nickname.trim().length < 2) {
            setError('닉네임은 2자 이상이어야 합니다.');
            return;
        }
        setLoading(true);
        setError(null);

        const result = await updateNicknameAction({ userId, nickname });

        if (result.success) {
            router.push('/');
        } else {
            setError(result.message);
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <Input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="예: 성장하는그린"
                className="text-center"
                maxLength={20}
            />
            <Button type="submit" className="w-full" disabled={loading}>
                {loading ? '설정 중...' : '시작하기'}
            </Button>
            {error && <p className="text-sm text-destructive">{error}</p>}
        </form>
    );
}
