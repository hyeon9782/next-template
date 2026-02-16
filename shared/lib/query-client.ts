import { QueryClient } from "@tanstack/react-query";

export const queryClientOptions = {
  defaultOptions: {
    queries: {
      // 모든 query의 기본 설정
      staleTime: 1000 * 60 * 5, // 5분 (데이터가 신선한 시간)
      gcTime: 1000 * 60 * 60, // 1시간 (가비지 컬렉션 시간)
      retry: 1, // 실패 시 1번만 재시도
      refetchOnWindowFocus: false, // 윈도우 포커스 시 refetch 비활성화
      refetchOnReconnect: true, // 네트워크 재연결 시 refetch
    },
    mutations: {
      // 모든 mutation의 기본 설정
      retry: 0, // mutation은 재시도 안 함
      onError: (error: unknown) => {
        // 전역 에러 핸들링
        console.error("Mutation error:", error);
      },
    },
  },
} as const;

export function createQueryClient() {
  return new QueryClient(queryClientOptions);
}

// Client-side singleton (optional convenience)
export const queryClient = createQueryClient();
