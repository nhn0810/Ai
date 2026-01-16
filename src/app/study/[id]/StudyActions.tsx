'use client';

import { Button } from '@/components/ui/Button';
import { useTransition } from 'react';
import { joinStudy, requestJoin, endStudy } from './actions';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface StudyActionsProps {
    studyId: number;
    enrollmentType: 'open' | 'approval';
    isMember: boolean;
    isLeader: boolean;
    isPending: boolean;
    studyStatus: 'active' | 'ended';
}

export default function StudyActions({
    studyId,
    enrollmentType,
    isMember,
    isLeader,
    isPending,
    studyStatus
}: StudyActionsProps) {
    const [isPendingTransition, startTransition] = useTransition();
    const router = useRouter();

    const handleJoin = () => {
        startTransition(async () => {
            const res = await joinStudy(studyId);
            if (!res.success) {
                toast.error(res.message);
            } else {
                toast.success(res.message);
            }
        });
    };

    const handleRequest = () => {
        startTransition(async () => {
            const res = await requestJoin(studyId);
            if (!res.success) {
                toast.error(res.message);
            } else {
                toast.success(res.message);
            }
        });
    };

    const handleEndStudy = () => {
        if (!confirm("정말로 스터디를 종료하시겠습니까?")) return;
        startTransition(async () => {
            const res = await endStudy(studyId);
            if (!res.success) {
                toast.error(res.message);
            } else {
                toast.success(res.message);
            }
        });
    };

    if (studyStatus === 'ended') {
        return <Button disabled variant="secondary" className="w-full">종료된 스터디</Button>;
    }

    if (isLeader) {
        return (
            <div className="space-y-2">
                <Button variant="destructive" className="w-full" onClick={handleEndStudy} disabled={isPendingTransition}>
                    스터디 종료
                </Button>
            </div>
        );
    }

    if (isMember) {
        return <Button disabled variant="outline" className="w-full">이미 참여 중입니다</Button>;
    }

    if (isPending) {
        return <Button disabled variant="secondary" className="w-full">가입 승인 대기중</Button>;
    }

    if (enrollmentType === 'open') {
        return (
            <Button className="w-full" onClick={handleJoin} disabled={isPendingTransition}>
                바로 참여하기
            </Button>
        );
    }

    return (
        <Button className="w-full" onClick={handleRequest} disabled={isPendingTransition}>
            가입 요청하기
        </Button>
    );
}
