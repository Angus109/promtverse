'use client';

import { CampProvider } from "@campnetwork/origin/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode, useMemo } from "react";

export function Providers({ children }: { children: ReactNode }) {
  const queryClient = useMemo(() => new QueryClient(), []);
  // console.log(process.env.NEXT_PUBLIC_CAMP_CLIENT_ID)
  // console.log(window.location.origin)

  return (
    <QueryClientProvider client={queryClient}>
      <CampProvider
        clientId={process.env.NEXT_PUBLIC_CAMP_CLIENT_ID!}
        redirectUri={typeof window !== 'undefined' ? window.location.origin :"http://localhost:3000"} // safe here because it's client-side
      >
        {children}
      </CampProvider>
    </QueryClientProvider>
  );
}
