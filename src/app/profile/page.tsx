import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import LogoutButton from '@/components/auth/logout-button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/Avatar'
import { Card, CardContent } from '@/components/ui/Card'
import { ChevronRight, UserCog } from 'lucide-react'

export default async function ProfilePage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return redirect('/login')
  }

  // In a real app, you'd fetch the profile from the database
  const userProfile = {
    name: user.user_metadata.name,
    email: user.email,
    avatarUrl: user.user_metadata.avatar_url,
    mannerScore: 36.5,
    participationScore: 85,
  }

  return (
    <>
      <div className="p-4 space-y-6">
        {/* Profile Header */}
        <div className="flex flex-col items-center space-y-4 pt-12">
          <Avatar className="h-24 w-24">
            <AvatarImage src={userProfile.avatarUrl} />
            <AvatarFallback>{userProfile.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-secondary">{userProfile.name}</h1>
            <p className="text-gray-600">{userProfile.email}</p>
          </div>
        </div>

        {/* Scores Card */}
        <Card>
          <CardContent className="p-4 flex justify-around">
            <div className="text-center">
              <p className="text-sm text-gray-500">매너 점수</p>
              <p className="text-2xl font-bold text-primary">{userProfile.mannerScore}°</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-500">참여 점수</p>
              <p className="text-2xl font-bold text-secondary">{userProfile.participationScore}점</p>
            </div>
          </CardContent>
        </Card>

        {/* Menu List */}
        <div className="space-y-2">
          <button className="w-full text-left">
            <Card>
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <UserCog className="text-gray-600" />
                  <span className="font-semibold text-secondary">프로필 수정</span>
                </div>
                <ChevronRight className="text-gray-600" />
              </CardContent>
            </Card>
          </button>
          <Card>
            <LogoutButton />
          </Card>
        </div>
      </div>
    </>
  )
}