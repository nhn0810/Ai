'use client'
import { createClient } from '@/lib/supabase/client'
import { LogOut } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function LogoutButton() {
  const router = useRouter()

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <button onClick={handleLogout} className="w-full text-left">
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <LogOut className="text-destructive" />
          <span className="font-semibold text-destructive">로그아웃</span>
        </div>
      </div>
    </button>
  )
}
