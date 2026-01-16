import { createClient } from '@/lib/supabase/server';

export default async function Header() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    let profile = null;
    if (user) {
        const { data } = await supabase
            .from('profiles')
            .select('nickname, manner_score')
            .eq('id', user.id)
            .single();
        profile = data;
    }

    // The middleware should prevent unauthenticated access, but we can handle the case where the user is null.
    const displayName = profile?.nickname || 'Guest';
    const mannerScore = profile?.manner_score || 0;

    return (
        <div className="absolute top-0 z-10 w-full bg-secondary p-4 text-white">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm opacity-80">Welcome back,</p>
                    <p className="text-xl font-bold">{displayName} 님</p>
                </div>
                <div className="text-right">
                    {/* Placeholder for Rank */}
                    <p className="font-semibold text-primary">USER RANK #12</p>
                    <p className="text-xs opacity-80">Top 5%</p>
                </div>
            </div>
            <div className="mt-4">
                <p className="text-xs font-semibold uppercase text-white/70">Manner Score: {mannerScore}°</p>
                <div className="progress-bar-container mt-1">
                    <div className="progress-bar" style={{ width: `${mannerScore}%` }}></div>
                </div>
            </div>
        </div>
    );
};
