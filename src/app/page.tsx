import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/Avatar';
import Header from '@/components/layout/Header';

async function getStudies() {
  const supabase = await createClient();
  const { data: studies, error } = await supabase
    .from('studies')
    .select(`
      *,
      leader:leader_id ( nickname, avatar_url )
    `)
    .eq('status', 'active')
    .order('created_at', { ascending: false })
    .limit(10);

  if (error) {
    console.error('Error fetching studies:', error);
    return [];
  }
  return studies;
}

async function getTopRankers() {
    const supabase = await createClient();
    const { data: rankers } = await supabase
        .from('user_rankings')
        .select('*')
        .limit(3);
    
    return rankers || [];
}

const StudyCard = ({ study }: { study: any }) => (
  <Link href={`/study/${study.id}`} className="block mb-4 transform rounded-xl bg-white p-4 shadow-lg transition-transform hover:-translate-y-1">
    <div className="relative">
        {/* We can use a helper to determine is_new, for now omitting or based on date */}
        <h3 className="text-lg font-bold text-secondary">{study.title}</h3>
        <p className="mt-1 text-gray-600 truncate">{study.description}</p>
        <div className="mt-3 flex items-center justify-between">
        <div className="flex items-center">
            <Avatar className="h-8 w-8 border-2 border-primary">
                <AvatarImage src={study.leader?.avatar_url} />
                <AvatarFallback>{study.leader?.nickname?.charAt(0) || 'L'}</AvatarFallback>
            </Avatar>
            <span className="ml-2 font-semibold text-gray-700">{study.leader?.nickname}</span>
        </div>
        <div className={study.enrollment_type === 'open' ? 
            "rounded-full bg-secondary px-4 py-2 text-sm font-bold text-white" : 
            "rounded-full bg-gray-200 px-4 py-2 text-sm font-bold text-gray-700"
        }>
            {study.enrollment_type === 'open' ? 'Join Now' : 'Request'}
        </div>
        </div>
    </div>
  </Link>
);


export default async function Page() {
  const studies = await getStudies();
  const rankers = await getTopRankers();

  return (
    <div className="pt-36">
      <Header />
      <div className="p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-secondary">🔥 Hot Studies</h2>
          <Link href="/study" className="font-semibold text-primary">View All</Link>
        </div>

        <div className="mt-4">
          {studies.length === 0 ? (
             <p className="text-gray-500 py-4 text-center">진행 중인 스터디가 없습니다.</p>
          ) : (
             studies.map((study) => (
                <StudyCard key={study.id} study={study} />
             ))
          )}
        </div>

        <div className="mt-8">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-secondary">🏆 Top Rankers</h2>
            <Link href="/ranking" className="font-semibold text-primary">View All</Link>
          </div>
          
          <div className="mt-3 space-y-2">
            {rankers.length === 0 ? (
                <p className="text-gray-500 py-4 text-center">랭킹 데이터가 없습니다.</p>
            ) : (
                rankers.map((ranker) => {
                    const rankIcons = ['🥇', '🥈', '🥉'];
                    const rankDisplay = ranker.rank <= 3 ? rankIcons[ranker.rank - 1] : ranker.rank;
                    return (
                        <div key={ranker.id} className="flex items-center rounded-lg bg-white p-2 shadow">
                        <span className="text-2xl font-bold w-10 text-center">{rankDisplay}</span>
                        <Avatar className="mx-3 h-10 w-10">
                            <AvatarImage src={ranker.avatar_url} />
                            <AvatarFallback>{ranker.nickname?.charAt(0) || 'U'}</AvatarFallback>
                        </Avatar>
                        <div className="flex-grow">
                            <p className="font-bold text-gray-800">{ranker.nickname}</p>
                            <p className="text-sm text-gray-500">점수: <span className="font-semibold text-primary">{Math.round(ranker.score)}점</span></p>
                        </div>
                        </div>
                    );
                })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
