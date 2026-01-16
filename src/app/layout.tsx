import type { Metadata } from "next";
import "./globals.css";
import BottomNavBar from "@/components/layout/BottomNavBar";
import Header from "@/components/layout/Header";
import { UserProvider } from "@/hooks/useUser";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "GrowGreen",
  description: "A mobile-first web app for study recruitment with GPS verification and ranking.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="dark">
      <body className={`bg-gray-900 flex items-center justify-center min-h-screen`}>
        <UserProvider>
            <div className="relative mx-auto h-[850px] w-full max-w-[430px] overflow-hidden rounded-2xl border-8 border-gray-950 bg-background shadow-2xl">
            <main className="h-full overflow-y-auto pb-24 scrollbar-hide">
                {children}
            </main>
            <BottomNavBar />
            </div>
            <Toaster position="top-center" richColors theme="dark" />
        </UserProvider>
      </body>
    </html>
  );
}