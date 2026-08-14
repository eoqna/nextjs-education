# 언러닝 대조표

Pages Router 계열 경험과 구버전 자료가 만들어내는 **잘못된 예측**을 모은다.

이 표의 목적은 "새 방법을 아는 것"이 아니라 **"내 반사신경이 언제 나를 속이는지 아는 것"** 이다. 오른쪽 열만 외워도 소용없고, 왼쪽 열이 언제 튀어나오는지를 알아채야 한다.

작성 시점: S11(v16 변경점), S12(Pages Router 대조). 이후 `#언러닝` 태그가 붙은 오답이 나올 때마다 추가한다.

---

## A. Pages Router → App Router

> S12에서 작성한다. 문서를 읽기 **전에** 예측을 먼저 적고, 대조한 뒤 채운다.
> 📖 [App Router Migration](https://nextjs.org/docs/app/guides/migrating/app-router-migration)

| 내가 알던 것 | App Router에서는 | 언제 나를 속이는가 |
|---|---|---|
| `getServerSideProps` | | |
| `getStaticProps` | | |
| `getStaticPaths` | | |
| `_app.tsx` | | |
| `_document.tsx` | | |
| `pages/api/*` | | |
| `next/router`의 `useRouter` | | |
| 기본이 클라이언트 컴포넌트 | | |

---

## B. v14 / v15 → v16

> S11에서 작성한다. 검색으로 나오는 자료 대부분이 이 열에 해당한다.
> 📖 [Version 16 Upgrade Guide](https://nextjs.org/docs/app/guides/upgrading/version-16)

| 구버전 자료의 코드 | v16의 실제 | 증상 |
|---|---|---|
| `params.slug` (동기) | `const { slug } = await params` | |
| `cookies()` (동기) | `await cookies()` | |
| `middleware.ts` | `proxy.ts` | |
| `revalidateTag(tag)` | `revalidateTag(tag, 'max')` / `updateTag(tag)` | |
| `experimental.ppr` | `cacheComponents: true` | |
| `next lint` | ESLint / Biome 직접 실행 | |
| fetch가 기본 캐시됨 | 기본 캐시 안 됨 | |
| 라우트가 static 또는 dynamic | PPR — 한 페이지에 공존 | |

---

## C. React 습관

> 학습 중 `#언러닝` 오답이 나올 때마다 추가한다.

| 반사신경 | App Router에서 | 
|---|---|
| "상태가 필요하니 `useState`" | 서버 컴포넌트에서는 불가. 경계를 먼저 판단 |
| "데이터는 `useEffect`에서" | 서버 컴포넌트에서 직접 `await` |
| | |
