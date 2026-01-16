'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { manualCheckIn } from './actions';
import { useTransition } from 'react';
import { Check } from 'lucide-react';
import { toast } from 'sonner';

interface MemberListProps {
    studyId: number;
    members: any[];
    attendanceLogs: any[];
    isLeader: boolean;
}

export default function MemberList({ studyId, members, attendanceLogs, isLeader }: MemberListProps) {
    const [isPending, startTransition] = useTransition();

    const handleManualCheckIn = (userId: string) => {
        if (!confirm("이 멤버를 출석 처리하시겠습니까?")) return;
        startTransition(async () => {
            const res = await manualCheckIn(studyId, userId);
            if (!res.success) {
                toast.error(res.message);
            } else {
                toast.success(res.message);
            }
        });
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-lg">참여 멤버 ({members.length})</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {members.map((member: any) => {
                    const isAttended = attendanceLogs.some(log => log.user_id === member.user_id);
                    
                    return (
                        <div key={member.user_id} className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Avatar>
                                    <AvatarImage src={member.profile?.avatar_url} />
                                    <AvatarFallback>{member.profile?.nickname?.[0] || '?'}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-medium text-sm">
                                        {member.profile?.nickname || 'Unknown User'}
                                        {member.role === 'leader' && <span className="ml-1 text-xs text-primary font-bold">(Leader)</span>}
                                    </p>
                                    <p className="text-xs text-gray-500">매너온도 {member.profile?.manner_score}°</p>
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-2">
                                {member.role === 'pending' && <Badge variant="outline">승인 대기</Badge>}
                                
                                {member.role !== 'pending' && (
                                    isAttended ? (
                                        <Badge variant="secondary" className="bg-green-100 text-green-800 hover:bg-green-100">
                                            <Check size={12} className="mr-1" /> 출석완료
                                        </Badge>
                                    ) : (
                                        isLeader && (
                                            <Button 
                                                variant="outline" 
                                                size="sm" 
                                                className="h-7 text-xs"
                                                onClick={() => handleManualCheckIn(member.user_id)}
                                                disabled={isPending}
                                            >
                                                수동 출석
                                            </Button>
                                        )
                                    )
                                )}
                            </div>
                        </div>
                    );
                })}
                {members.length === 0 && (
                    <p className="text-center text-gray-500 py-4">아직 참여한 멤버가 없습니다.</p>
                )}
            </CardContent>
        </Card>
    );
}
