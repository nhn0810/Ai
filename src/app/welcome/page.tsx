
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import WelcomeForm from './WelcomeForm';

export default async function WelcomePage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login');
    }

    const { data: profile } = await supabase
        .from('profiles')
        .select('nickname')
        .eq('id', user.id)
        .single();

    if (profile?.nickname) {
        redirect('/');
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-full p-6">
            <div className="w-full max-w-md text-center space-y-2">
                <h1 className="text-2xl font-bold text-foreground">
                    <span className="text-primary">GrowGreen</span>에 오신 것을 환영합니다!
                </h1>
                <p className="text-muted-foreground mb-8">사용하실 닉네임을 입력해주세요.</p>
                <div className="bg-surface p-6 rounded-xl border border-white/10 shadow-lg">
                    <WelcomeForm userId={user.id} />
                </div>
            </div>
        </div>
    );
}
