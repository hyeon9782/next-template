"use client";

import { HydrationBoundary, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState } from "react";

import { createQueryClient } from "@/shared/lib/query-client";
import { DehydratedState } from "@tanstack/react-query";
import { OverlayProvider } from "overlay-kit";

export default function Providers({
  children,
  dehydratedState,
}: Readonly<{
  children: React.ReactNode;
  dehydratedState?: unknown;
}>) {
  const [queryClient] = useState(() => createQueryClient());

  return (
    <OverlayProvider>
      <QueryClientProvider client={queryClient}>
        <HydrationBoundary state={dehydratedState as DehydratedState}>
          {children}
        </HydrationBoundary>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </OverlayProvider>
  );
}
