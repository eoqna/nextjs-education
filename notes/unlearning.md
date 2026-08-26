# 언러닝 대조표

기존 습관이 App Router에서 **잘못된 예측**을 만들어내는 지점을 모은다.

이 표의 목적은 "새 방법을 아는 것"이 아니라 **"내 반사신경이 언제 나를 속이는지 아는 것"** 이다. 오른쪽 열만 외워도 소용없고, 왼쪽 열이 언제 튀어나오는지를 알아채야 한다.

---

## 계획 수정 (S6, 2026-08-26)

학습 계획 초기에는 **Pages Router 습관**을 언러닝 대상으로 잡았다. 실제로 확인해보니 `getServerSideProps` 등 Pages Router API를 모르는 상태였고, **지울 습관 자체가 없었다.**

진짜 언러닝 대상은 **CSR(클라이언트 사이드 렌더링) React 습관**이다. S1~S5의 오답이 전부 여기서 나왔다. 아래 A절이 본체이고, B절(Pages Router)은 실무에서 구버전 프로젝트를 만날 때를 위한 참고 자료로 남긴다.

---

## A. CSR React 습관 → RSC ★ 본체

모든 항목이 **자신이 실제로 틀린 예측**에서 나왔다.

| # | 반사신경 | App Router에서는 | 언제 나를 속였나 |
|---|---|---|---|
| 1 | 모든 코드는 브라우저에서 실행된다 | 기본이 **서버**다. 브라우저로 가는 건 `'use client'` 경계 아래뿐 | S1 Q2 — `next/font` 가 브라우저에서 폰트를 받을 것이라 예측. 실제로는 빌드 타임 |
| 2 | props는 그냥 전달된다 | 서버→클라이언트는 **직렬화 경계**다. 데이터는 넘어가고 동작(함수·클래스)은 못 넘어간다 | S4 — "새로 생성한 객체라 실패"로 예측. 실제 기준은 "양쪽이 아는 타입인가" |
| 3 | 컴포넌트의 성격은 파일에 적혀 있다 | 지시어 없는 파일은 **어디서 import 되느냐**로 서버/클라이언트가 갈린다 | S5 — 서버 컴포넌트를 클라이언트가 import하면 그냥 클라이언트가 된다 |
| 4 | 라우트가 바뀌면 화면 전체가 다시 그려진다 | 공유 레이아웃은 유지된다 (partial rendering). 바뀌는 세그먼트만 서버에서 렌더링 | S1 Q3 — 레이아웃이 이동마다 실행될 것이라 예측 |
| 5 | 파일 위치가 라우팅을 결정한다 | 위치가 아니라 **파일 이름**이 결정한다. `page.tsx`·`route.ts` 만 URL을 만든다 | S1 Q4 — `app/` 안이면 라우트라고 생각 |
| 6 | 로그를 보면 어디서 실행됐는지 안다 | dev 모드는 서버 로그를 브라우저 콘솔에도 전달한다. 실행 위치의 증거가 아니다 | S5 — 방식 B에서 브라우저 콘솔에도 로그가 찍혔다. 진짜 증거는 서버 전용 env 값이었다 |
| 7 | 조건부 렌더링하면 그 작업은 안 일어난다 | 서버는 클라이언트 상태를 모른다. `{open && children}` 이어도 **서버는 이미 실행해서 보냈다** | S5 Q4 — 닫아둬도 로그가 찍힘 |

### 한 문장으로

> **CSR에서는 "코드가 한 곳에서 실행되고 props는 그냥 넘어간다"가 사실이었다.**
> **RSC에서는 둘 다 아니다.**

새 코드를 볼 때 반사적으로 물을 것 — **이건 어디서 실행되고, 무엇이 경계를 넘는가.**

---

## B. Pages Router → App Router (참고용)

지금 쓰지 않지만, 실무에서 Next.js 14 이하 프로젝트를 만나면 필요하다. **당장 외울 필요 없다.**

📖 [App Router Migration](https://nextjs.org/docs/app/guides/migrating/app-router-migration)

| Pages Router | App Router |
|---|---|
| `getServerSideProps` | 서버 컴포넌트에서 직접 `await fetch(...)` |
| `getStaticProps` | 서버 컴포넌트 + `use cache` (또는 구모델의 fetch 캐시 옵션) |
| `getStaticPaths` | `generateStaticParams` |
| `_app.tsx` | 루트 `app/layout.tsx` |
| `_document.tsx` | 루트 `app/layout.tsx` 의 `<html>` / `<body>` |
| `pages/api/*` | `app/**/route.ts` (Route Handlers) |
| `next/router` 의 `useRouter` | `next/navigation` 의 `useRouter` · `usePathname` · `useSearchParams` |
| 기본이 클라이언트 컴포넌트 | **기본이 서버 컴포넌트** |

---

## C. v14 / v15 → v16 (검색 결과 대응용)

검색으로 나오는 자료 대부분이 왼쪽 열이다.

| 구버전 자료의 코드 | v16의 실제 |
|---|---|
| `params.slug` (동기) | `const { slug } = await params` |
| `cookies()` (동기) | `await cookies()` |
| `middleware.ts` | `proxy.ts` (Node.js 런타임) |
| `revalidateTag(tag)` | `revalidateTag(tag, 'max')` / `updateTag(tag)` |
| `experimental.ppr` | `cacheComponents: true` |
| `next lint` | ESLint / Biome 직접 실행 |
| fetch가 기본 캐시됨 | 기본 캐시 안 됨 |
| 라우트가 static 또는 dynamic | PPR — 한 페이지에 공존 |
