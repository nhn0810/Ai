import { createClient } from '@/lib/supabase/server';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/Avatar';
import { Card, CardContent } from '@/components/ui/Card';

async function getRankings() {
  const supabase = await createClient();

  const [userRankingsRes, studyRankingsRes] = await Promise.all([
    supabase.from('user_rankings').select('*').limit(50),
    supabase.from('study_rankings').select('*').limit(50)
  ]);

  return {
    userRankings: userRankingsRes.data || [],
    studyRankings: studyRankingsRes.data || []
  };
}

async function getMyRank(userId: string | undefined) {
  if (!userId) return null;
  const supabase = await createClient();
  const { data } = await supabase.from('user_rankings').select('*').eq('id', userId).single();
  return data;
}

const RankerListItem = ({ ranker, type }: { ranker: any, type: 'user' | 'study' }) => {
  const rankIcons = ['🥇', '🥈', '🥉'];
  const rankDisplay = ranker.rank <= 3 ? rankIcons[ranker.rank - 1] : ranker.rank;
  
  return (
    <div className="flex items-center rounded-lg bg-white p-3 shadow hover:shadow-md transition-shadow">
      <span className="text-2xl font-bold w-10 text-center flex-shrink-0">{rankDisplay}</span>
      {type === 'user' ? (
        <Avatar className="mx-3 h-10 w-10 border border-gray-100">
            <AvatarImage src={ranker.avatar_url} />
            <AvatarFallback>{ranker.nickname?.charAt(0) || 'U'}</AvatarFallback>
        </Avatar>
      ) : (
        <div className="mx-3 h-10 w-10 flex items-center justify-center bg-primary/10 rounded-full text-lg">
            📚
        </div>
      )}
      <div className="flex-grow min-w-0">
        <p className="font-bold text-gray-800 truncate">{type === 'user' ? ranker.nickname : ranker.title}</p>
        <p className="text-sm text-gray-500">
           {type === 'user' ? '종합 점수' : '활동 점수'}: <span className="font-semibold text-primary">{Math.round(ranker.score)}점</span>
        </p>
      </div>
    </div>
  );
}


export default async function RankingPage() {
  const { userRankings, studyRankings } = await getRankings();
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const myRank = await getMyRank(user?.id);

  return (
    <div className="flex flex-col h-full relative">
      <div className="p-4 flex-1 overflow-y-auto pb-24">
        <h1 className="text-2xl font-bold text-secondary mb-4">🏆 랭킹</h1>
        <Tabs defaultValue="user" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="user">Top 유저</TabsTrigger>
            <TabsTrigger value="study">Top 스터디</TabsTrigger>
          </TabsList>
          
          <TabsContent value="user" className="space-y-3">
             {userRankings.length === 0 ? (
                <div className="text-center py-10 text-gray-500">아직 랭킹 데이터가 없습니다.</div>
             ) : (
                userRankings.map((ranker) => (
                  <RankerListItem key={ranker.id} ranker={ranker} type="user" />
                ))
             )}
          </TabsContent>
          
          <TabsContent value="study" className="space-y-3">
            {studyRankings.length === 0 ? (
                <div className="text-center py-10 text-gray-500">아직 랭킹 데이터가 없습니다.</div>
             ) : (
                studyRankings.map((ranker) => (
                  <RankerListItem key={ranker.id} ranker={ranker} type="study" />
                ))
             )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Sticky My Rank Footer */}
      {user && myRank && (
        <div className="fixed bottom-[64px] left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-secondary text-white p-4 shadow-lg rounded-t-xl z-20">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <span className="font-bold text-lg">내 순위</span>
                    <span className="bg-white/20 px-2 py-0.5 rounded text-sm font-bold">{myRank.rank}위</span>
                </div>
                <div className="flex items-center gap-3">
                     <span className="text-sm opacity-80">{myRank.nickname}</span>
                     <span className="font-bold text-primary-foreground">{Math.round(myRank.score)}점</span>
                </div>
            </div>
        </div>
      )}
    </div>
  );
}