# Next Template

Next.js + TypeScript + Tailwind CSS + shadcn/ui + Zustand + TanStack Query 기반의 프론트엔드 템플릿입니다. 도메인 기반 구조로 구성되어 있으며 App Router 환경을 사용합니다.

## Tech Stack

- Next.js (App Router)
- React
- TypeScript
- Tailwind CSS v4
- shadcn/ui + Radix UI
- TanStack Query v5 (SSR hydration 포함)
- Zustand
- Sonner
- Overlay Kit
- Day.js

## Project Structure

- `app/` : App Router 엔트리
- `app/layout.tsx` : 루트 레이아웃, 전역 Provider 구성
- `app/page.tsx` : 기본 홈 페이지
- `app/not-found.tsx` : 404 페이지
- `app/global-error.tsx` : 전역 에러 바운더리
- `app/globals.css` : Tailwind v4 + shadcn 테마

- `domains/` : 도메인 단위 모듈
- `domains/auth/` : 인증 관련 도메인
- `domains/onboarding/` : 온보딩 관련 도메인
- `domains/*/components/` : 도메인 전용 UI 컴포넌트
- `domains/*/apis/` : 도메인 전용 API 함수
- `domains/*/types/` : 도메인 전용 타입

- `shared/` : 전역 공용 모듈
- `shared/components/` : 공용 UI/레이아웃
- `shared/components/ui/` : shadcn/ui 기반 공용 UI
- `shared/components/layouts/` : 공통 레이아웃 컴포넌트
- `shared/lib/` : 공용 유틸/클라이언트
- `shared/lib/api.ts` : 공통 API 클라이언트 팩토리
- `shared/lib/api-client.ts` : 클라이언트 전용 API 유틸
- `shared/lib/api-server.ts` : 서버 전용 API 유틸
- `shared/lib/query-client.ts` : TanStack Query 기본 설정
- `shared/lib/get-query-client.ts` : SSR용 QueryClient 생성
- `shared/lib/supabase-env.ts` : Supabase 환경 변수 유틸
- `shared/lib/supabase-client.ts` : Supabase 브라우저 클라이언트
- `shared/lib/supabase-server.ts` : Supabase 서버 클라이언트
- `shared/lib/supabase-middleware.ts` : Supabase 세션 갱신 미들웨어
- `shared/hooks/` : 공용 훅
- `shared/stores/` : 전역 상태(Zustand)
- `shared/types/` : 공용 타입
- `shared/constants/` : 공용 상수

## Data Fetching (TanStack Query + SSR)

- 서버에서 `getQueryClient()`로 QueryClient를 생성 후 `dehydrate()`
- 클라이언트에서 `HydrationBoundary`로 상태 주입
- 관련 파일
  - `shared/lib/query-client.ts`
  - `shared/lib/get-query-client.ts`
  - `app/providers.tsx`
  - `app/layout.tsx`

## API Client

- 공통 팩토리: `createApiClient()`
- 클라이언트 전용: `getBrowserApi()`
- 서버 전용: `getServerApi()`

관련 파일
- `shared/lib/api.ts`
- `shared/lib/api-client.ts`
- `shared/lib/api-server.ts`

## Supabase

### Environment

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
  - 전환 기간 동안 `NEXT_PUBLIC_SUPABASE_ANON_KEY`도 허용됨 (fallback)

### Usage

- 브라우저: `getBrowserSupabase()`
- 서버: `getServerSupabase()`
- 미들웨어 세션 갱신: `middleware.ts`에서 `updateSupabaseSession()` 호출

관련 파일
- `shared/lib/supabase-env.ts`
- `shared/lib/supabase-client.ts`
- `shared/lib/supabase-server.ts`
- `shared/lib/supabase-middleware.ts`
- `middleware.ts`

## Scripts

- `pnpm dev` : 개발 서버
- `pnpm build` : 프로덕션 빌드
- `pnpm start` : 프로덕션 실행
- `pnpm lint` : ESLint

## Environment

- `.env.local`, `.env.prod` 존재
- 기본 API 베이스 URL
  - 클라이언트: `NEXT_PUBLIC_API_BASE_URL`
  - 서버: `API_BASE_URL`
- Supabase
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` (또는 `NEXT_PUBLIC_SUPABASE_ANON_KEY`)
