// app/ClientProviders.tsx
'use client'

import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from '@/lib/AuthContext';
import { QueryClient, QueryClientProvider } from 'react-query'
import { useState } from 'react'

export default function ClientProviders({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [queryClient] = useState(() => new QueryClient())

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        {/* <div className="h-[80px] fixed inset-x-0 top-0 z-10 pt-5 px-5">
          <Header />
        </div> */}
        <div>
          {children}
        </div>
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  )
}