# 캐시 모델 매핑표

**작성 시점:** S47 (10주차) — 3단계의 마지막 세션

**용도:** 3~4개월 뒤 실무 투입 시 프로젝트가 Next.js 14/15이거나 `cacheComponents` 미적용일 가능성이 높다. 그때 구모델 코드를 신모델 개념으로 번역하기 위한 보험이다.

**작성 방법:** `cacheComponents`를 끄고 같은 기능을 구모델로 다시 구현한 뒤 채운다. 문서를 읽고 채우지 말고, **직접 만들어보고 채운다.**

📖 [Caching (Previous Model)](https://nextjs.org/docs/app/guides/caching-without-cache-components) · [Migrating to Cache Components](https://nextjs.org/docs/app/guides/migrating-to-cache-components)

---

## 핵심 차이 한 줄

> 신모델: 기본이 **동적**, 캐시할 것만 **명시적으로 지정**한다.
> 구모델: 기본이 **정적**, 런타임 API를 쓰는 순간 라우트 전체가 동적으로 **전환된다.**

이 방향의 차이가 나머지 전부를 설명한다.

---

## 매핑표

**최소 8행을 채운다.**

| 신모델 (Cache Components) | 구모델 | 비고 |
|---|---|---|
| `use cache` + `cacheLife` | | |
| `use cache: private` | | |
| `use cache: remote` | | |
| `cacheTag` + `revalidateTag(tag, profile)` | | |
| `updateTag(tag)` | | |
| `refresh()` | | |
| `Suspense`로 런타임 접근 격리 | | |
| 프리렌더 실패 시 dev 오버레이 insight | | |
| 렌더 패스 내 중복 제거 | | |
| ISR | | |

---

## 구모델에만 있는 것

신모델로 옮겨오지 않는, 구모델 코드에서만 보게 될 것들.

| API / 설정 | 하는 일 | 신모델에서는 |
|---|---|---|
| `export const dynamic = 'force-dynamic'` | | |
| `export const revalidate = 60` | | |
| `export const fetchCache = ...` | | |
| `unstable_cache(fn, keys, opts)` | | |
| `unstable_noStore()` | | |
| `fetch(url, { cache: 'force-cache' })` | | |

---

## 증상 → 원인 진단표

"데이터를 바꿨는데 화면이 안 바뀐다"를 만났을 때 쓴다. 각 모델에서 확인 순서가 다르다.

**신모델에서 확인할 순서**

1.
2.
3.

**구모델에서 확인할 순서**

1.
2.
3.
