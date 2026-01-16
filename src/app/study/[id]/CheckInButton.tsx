'use client';

import { useState, useEffect } from 'react';
import useGeolocation, { calculateDistance } from '@/hooks/useGeolocation';
import { Button } from '@/components/ui/Button';
import { checkInAction } from './actions';
import { cn } from '@/lib/utils';

interface CheckInButtonProps {
    studyId: number;
    studyLocation: { latitude: number; longitude: number };
    meetingTime: Date;
}

const CHECK_IN_RADIUS_METERS = 100; // 100m
const CHECK_IN_WINDOW_MINUTES = 30; // +/- 30 minutes

export default function CheckInButton({ studyId, studyLocation, meetingTime }: CheckInButtonProps) {
    const { latitude, longitude, error: geoError, loading: geoLoading } = useGeolocation();
    const [status, setStatus] = useState<{ message: string; type: 'idle' | 'loading' | 'success' | 'error' }>({ message: '위치 정보를 기다리는 중...', type: 'loading' });
    const [isCheckInAllowed, setIsCheckInAllowed] = useState(false);

    useEffect(() => {
        if (geoLoading) return;

        if (geoError) {
            setStatus({ message: `위치 오류: ${geoError}`, type: 'error' });
            return;
        }

        if (latitude && longitude) {
            const distance = calculateDistance(latitude, longitude, studyLocation.latitude, studyLocation.longitude);
            
            const now = new Date();
            const timeDiff = Math.abs(now.getTime() - new Date(meetingTime).getTime()) / (1000 * 60); // difference in minutes

            const isWithinDistance = distance <= CHECK_IN_RADIUS_METERS;
            const isWithinTime = timeDiff <= CHECK_IN_WINDOW_MINUTES;

            if (!isWithinDistance) {
                setStatus({ message: `스터디 장소에서 ${Math.round(distance)}m 떨어져 있습니다. (100m 이내 필요)`, type: 'error' });
                setIsCheckInAllowed(false);
            } else if (!isWithinTime) {
                setStatus({ message: `체크인 시간이 아닙니다.`, type: 'error' });
                setIsCheckInAllowed(false);
            } else {
                setStatus({ message: '체크인 가능합니다!', type: 'idle' });
                setIsCheckInAllowed(true);
            }
        }

    }, [latitude, longitude, geoError, geoLoading, studyLocation, meetingTime]);
    
    const handleCheckIn = async () => {
        if (!isCheckInAllowed || !latitude || !longitude) return;
        
        setStatus({ message: '체크인 중...', type: 'loading' });
        const result = await checkInAction({ studyId, userLocation: { latitude, longitude } });
        
        if (result.success) {
            setStatus({ message: result.message, type: 'success' });
            setIsCheckInAllowed(false); // Prevent double check-in
        } else {
            setStatus({ message: result.message, type: 'error' });
        }
    };

    return (
        <div className="flex flex-col items-center gap-4">
            <Button 
                onClick={handleCheckIn}
                disabled={!isCheckInAllowed || status.type === 'loading' || status.type === 'success'}
                className="w-full"
            >
                {status.type === 'loading' ? '확인 중...' : '여기서 출석 체크하기'}
            </Button>
            <p className={cn(
                "text-sm font-semibold",
                status.type === 'error' && "text-destructive",
                status.type === 'success' && "text-primary",
                status.type === 'idle' && "text-primary",
            )}>
                {status.message}
            </p>
        </div>
    );
}
