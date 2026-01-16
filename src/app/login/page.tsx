'use client'

import LoginForm from '@/components/auth/LoginForm'
import SignupForm from '@/components/auth/SignupForm'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs'
import { Card, CardContent } from '@/components/ui/Card'
import { Leaf } from 'lucide-react'

const LoginPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-full p-6 bg-gradient-to-b from-background to-secondary/20">
       
       {/* Hero Section */}
       <div className="text-center mb-10 space-y-4">
          <div className="inline-flex p-4 rounded-full bg-primary/10 mb-4 animate-bounce-slow">
            <Leaf className="w-12 h-12 text-primary" />
          </div>
          <h1 className="text-4xl font-extrabold text-foreground tracking-tight">
            Grow<span className="text-primary">Green</span>
          </h1>
          <p className="text-muted-foreground text-sm max-w-[280px] mx-auto">
            함께 성장하는 즐거움,<br/>
            위치 기반 스터디 모집 플랫폼
          </p>
       </div>

       {/* Auth Card */}
       <Card className="w-full max-w-sm border-white/10 bg-surface/50 backdrop-blur-md shadow-xl">
        <CardContent className="pt-6">
            <Tabs defaultValue="login" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6 bg-black/20">
                    <TabsTrigger value="login" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">로그인</TabsTrigger>
                    <TabsTrigger value="signup" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">회원가입</TabsTrigger>
                </TabsList>
                <TabsContent value="login">
                    <LoginForm />
                </TabsContent>
                <TabsContent value="signup">
                    <SignupForm />
                </TabsContent>
            </Tabs>
        </CardContent>
       </Card>

       {/* Footer */}
       <p className="mt-8 text-xs text-center text-muted-foreground opacity-50">
          © 2026 GrowGreen. All rights reserved.
       </p>
    </div>
  )
}

export default LoginPage