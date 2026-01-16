'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { MapPin, Users, Zap } from 'lucide-react';

interface Study {
    id: number;
    title: string;
    description: string | null;
    status: string;
    enrollment_type: string;
    member_count: number;
}

interface StudyListProps {
    initialStudies: Study[];
    myStudyIds: number[];
}

export default function StudyList({ initialStudies, myStudyIds }: StudyListProps) {
    const [filter, setFilter] = useState<'all' | 'active' | 'my'>('all');

    const filteredStudies = initialStudies.filter(study => {
        if (filter === 'active') return study.status === 'active';
        if (filter === 'my') return myStudyIds.includes(study.id);
        return true;
    });

    return (
        <div className="pt-20 p-4">
            <div className="flex gap-2 mb-4">
                <Button 
                    variant={filter === 'all' ? 'default' : 'outline'} 
                    size="sm" 
                    onClick={() => setFilter('all')}
                >
                    전체
                </Button>
                <Button 
                    variant={filter === 'active' ? 'default' : 'outline'} 
                    size="sm" 
                    onClick={() => setFilter('active')}
                >
                    모집중
                </Button>
                <Button 
                    variant={filter === 'my' ? 'default' : 'ghost'} 
                    size="sm" 
                    onClick={() => setFilter('my')}
                >
                    내 스터디
                </Button>
            </div>

            <div className="space-y-4">
                {filteredStudies.length === 0 ? (
                    <div className="text-center py-10 text-gray-500">
                        {filter === 'my' ? '참여 중인 스터디가 없습니다.' : '등록된 스터디가 없습니다.'}
                    </div>
                ) : (
                    filteredStudies.map((study) => (
                        <Link href={`/study/${study.id}`} key={study.id}>
                            <Card className="hover:bg-gray-50 transition-colors">
                                <CardContent className="p-4">
                                    <div className="flex justify-between items-start">
                                        <h3 className="font-bold text-lg">{study.title}</h3>
                                        <Badge variant={study.status === 'active' ? 'default' : 'secondary'}>
                                            {study.status === 'active' ? '모집중' : '종료됨'}
                                        </Badge>
                                    </div>
                                    <p className="text-sm text-gray-600 mt-2 line-clamp-2">{study.description}</p>
                                    <div className="flex justify-between items-end mt-4">
                                        <div className="flex gap-4 text-sm text-gray-500">
                                            <div className="flex items-center gap-1">
                                                <MapPin size={14} />
                                                <span>강남역 (예시)</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Users size={14} />
                                                <span>{study.member_count}명</span>
                                            </div>
                                        </div>
                                        {study.enrollment_type === 'approval' && (
                                            <div className="flex items-center gap-1 text-amber-500">
                                                <Zap size={14} />
                                                <span className="text-xs font-semibold">승인 필요</span>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    ))
                )}
            </div>
        </div>
    );
}
