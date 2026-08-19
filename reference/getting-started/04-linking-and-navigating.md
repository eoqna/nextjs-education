# 링크와 네비게이션

> **원문:** `node_modules/next/dist/docs/01-app/01-getting-started/04-linking-and-navigating.md`
> **버전:** Next.js 16.3.1
> **웹:** https://nextjs.org/docs/app/getting-started/linking-and-navigating
> **비고:** 원문의 다이어그램 이미지는 제외했다.

Next.js에서 라우트는 기본적으로 **서버에서 렌더링**된다. 이는 곧 새 라우트를 보여주기 전에 클라이언트가 서버 응답을 기다려야 한다는 뜻이다. Next.js에는 [프리페칭](#프리페칭), [스트리밍](#스트리밍), [클라이언트 사이드 전환](#클라이언트-사이드-전환)이 내장되어 있어 네비게이션이 빠르고 반응성 있게 유지된다.

이 문서는 Next.js에서 네비게이션이 어떻게 동작하는지, 그리고 [동적 라우트](#loadingtsx-가-없는-동적-라우트)와 [느린 네트워크](#느린-네트워크)에 대해 어떻게 최적화할 수 있는지 설명한다.

## 네비게이션의 동작 원리

Next.js의 네비게이션을 이해하려면 다음 개념들에 익숙해지는 것이 도움이 된다.

- [서버 렌더링](#서버-렌더링)
- [프리페칭](#프리페칭)
- [스트리밍](#스트리밍)
- [클라이언트 사이드 전환](#클라이언트-사이드-전환)

### 서버 렌더링

Next.js에서 [레이아웃과 페이지](https://nextjs.org/docs/app/getting-started/layouts-and-pages)는 기본적으로 [React 서버 컴포넌트](https://react.dev/reference/rsc/server-components)다. **최초 진입과 이후의 네비게이션 모두에서**, [서버 컴포넌트 페이로드](https://nextjs.org/docs/app/getting-started/server-and-client-components)가 서버에서 생성된 뒤 클라이언트로 전송된다.

서버 렌더링은 **언제** 일어나는지에 따라 두 종류로 나뉜다.

- **프리렌더링(Prerendering)** — 빌드 시점 또는 [재검증](https://nextjs.org/docs/app/getting-started/revalidating) 중에 일어나며, 결과가 캐시된다.
- **동적 렌더링(Dynamic Rendering)** — 클라이언트 요청에 응답하여 요청 시점에 일어난다.

서버 렌더링의 트레이드오프는 새 라우트를 보여주기 전에 클라이언트가 서버 응답을 기다려야 한다는 점이다. Next.js는 사용자가 방문할 가능성이 높은 라우트를 [프리페치](#프리페칭)하고 [클라이언트 사이드 전환](#클라이언트-사이드-전환)을 수행하여 이 지연을 해소한다.

> **알아두면 좋은 것:** 최초 방문 시에는 HTML도 함께 생성된다.

### 프리페칭

프리페칭은 사용자가 이동하기 **전에** 백그라운드에서 라우트를 미리 불러오는 것이다. 사용자가 링크를 클릭하는 시점에 다음 라우트를 렌더링할 데이터가 이미 클라이언트에 준비되어 있으므로, 라우트 간 이동이 즉각적으로 느껴진다.

**Next.js는 [`<Link>` 컴포넌트](https://nextjs.org/docs/app/api-reference/components/link)로 연결된 라우트를 그것이 사용자의 뷰포트에 들어올 때 자동으로 프리페치한다.**

```tsx filename="app/layout.tsx" switcher
import Link from 'next/link'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        <nav>
          {/* Prefetched when the link is hovered or enters the viewport */}
          <Link href="/blog">Blog</Link>
          {/* No prefetching */}
          <a href="/contact">Contact</a>
        </nav>
        {children}
      </body>
    </html>
  )
}
```

```jsx filename="app/layout.js" switcher
import Link from 'next/link'

export default function Layout({ children }) {
  return (
    <html>
      <body>
        <nav>
          {/* Prefetched when the link is hovered or enters the viewport */}
          <Link href="/blog">Blog</Link>
          {/* No prefetching */}
          <a href="/contact">Contact</a>
        </nav>
        {children}
      </body>
    </html>
  )
}
```

라우트가 얼마나 프리페치되는지는 그것이 정적인지 동적인지에 따라 다르다.

- **정적 라우트** — 라우트 전체가 프리페치된다.
- **동적 라우트** — 프리페칭이 생략되거나, [`loading.tsx`](https://nextjs.org/docs/app/api-reference/file-conventions/loading)가 있으면 부분적으로 프리페치된다.

동적 라우트의 프리페칭을 생략하거나 부분적으로만 수행함으로써, Next.js는 사용자가 결코 방문하지 않을 수도 있는 라우트에 대한 불필요한 서버 작업을 피한다. 다만 이동 전에 서버 응답을 기다리게 되면 사용자에게 앱이 반응하지 않는다는 인상을 줄 수 있다.

> **알아두면 좋은 것:** 링크별 프리페칭 제어 방법과 [부분 프리페칭(Partial Prefetching)](https://nextjs.org/docs/app/guides/adopting-partial-prefetching) 도입 시 동작 변화를 포함한 전체 동작은 [프리페칭 가이드](https://nextjs.org/docs/app/guides/prefetching)를 참고한다.

동적 라우트로의 네비게이션 경험을 개선하려면 [스트리밍](#스트리밍)을 사용할 수 있다.

### 스트리밍

스트리밍은 라우트 전체가 렌더링될 때까지 기다리지 않고, 준비된 부분부터 서버가 클라이언트로 보낼 수 있게 한다. 페이지의 일부가 아직 로딩 중이더라도 사용자는 무언가를 더 빨리 보게 된다. Next.js에서 스트리밍이 동작하는 방식은 [스트리밍 가이드](https://nextjs.org/docs/app/guides/streaming)에서 깊이 다룬다.

동적 라우트의 경우 이는 곧 **부분 프리페치**가 가능해진다는 뜻이다. 즉 공유 레이아웃과 로딩 스켈레톤을 미리 요청해둘 수 있다.

스트리밍을 사용하려면 라우트 폴더에 `loading.tsx`를 만든다.

```tsx filename="app/dashboard/loading.tsx" switcher
export default function Loading() {
  // Add fallback UI that will be shown while the route is loading.
  return <LoadingSkeleton />
}
```

```jsx filename="app/dashboard/loading.js" switcher
export default function Loading() {
  // Add fallback UI that will be shown while the route is loading.
  return <LoadingSkeleton />
}
```

내부적으로 Next.js는 `page.tsx`의 내용을 자동으로 `<Suspense>` 경계로 감싼다. 라우트가 로딩되는 동안 프리페치된 폴백 UI가 표시되고, 준비가 끝나면 실제 콘텐츠로 교체된다.

> **알아두면 좋은 것:** 중첩된 컴포넌트의 로딩 UI를 만들 때 [`<Suspense>`](https://react.dev/reference/react/Suspense)를 직접 사용할 수도 있다.

`loading.tsx`의 이점은 다음과 같다.

- 사용자에게 즉각적인 이동과 시각적 피드백을 제공한다.
- 공유 레이아웃이 계속 인터랙티브하게 유지되며, 네비게이션을 중단할 수 있다.
- Core Web Vitals 개선 — [TTFB](https://web.dev/articles/ttfb), [FCP](https://web.dev/articles/fcp), [TTI](https://web.dev/articles/tti).

네비게이션 경험을 한층 더 개선하기 위해, Next.js는 `<Link>` 컴포넌트로 [클라이언트 사이드 전환](#클라이언트-사이드-전환)을 수행한다.

### 클라이언트 사이드 전환

전통적으로 서버 렌더링된 페이지로 이동하면 **전체 페이지 로드(full page load)** 가 발생한다. 이때 상태가 초기화되고, 스크롤 위치가 리셋되며, 인터랙션이 차단된다.

Next.js는 `<Link>` 컴포넌트를 통한 클라이언트 사이드 전환으로 이를 피한다. 페이지를 다시 로드하는 대신 다음과 같은 방식으로 콘텐츠를 동적으로 갱신한다.

- **공유되는 레이아웃과 UI를 그대로 유지한다.**
- 현재 페이지를, 프리페치된 로딩 상태나 준비된 새 페이지로 교체한다.

클라이언트 사이드 전환은 서버 렌더링 앱을 클라이언트 렌더링 앱처럼 **느껴지게** 만드는 요소다. 여기에 [프리페칭](#프리페칭)과 [스트리밍](#스트리밍)이 결합되면 동적 라우트에서도 빠른 전환이 가능해진다.

Next.js는 클라이언트 사이드 전환 중 [페이지 최상단으로 스크롤하는 것](https://nextjs.org/docs/app/api-reference/components/link#scroll)도 처리한다. 이동 후 콘텐츠가 sticky 또는 fixed 헤더 뒤로 스크롤된다면 CSS [`scroll-padding-top`](https://nextjs.org/docs/app/api-reference/components/link#scroll-offset-with-sticky-headers)으로 해결할 수 있다.

## 전환이 느려지는 원인

위의 최적화들이 네비게이션을 빠르고 반응성 있게 만들어준다. 그러나 특정 조건에서는 전환이 여전히 **느리게 느껴질** 수 있다. 흔한 원인과 개선 방법은 다음과 같다.

### `loading.tsx` 가 없는 동적 라우트

동적 라우트로 이동할 때 클라이언트는 결과를 보여주기 전에 서버 응답을 기다려야 한다. 사용자에게는 앱이 반응하지 않는 것처럼 보일 수 있다.

동적 라우트에는 `loading.tsx`를 추가하여 부분 프리페칭을 활성화하고, 즉각적인 이동을 유발하며, 라우트가 렌더링되는 동안 로딩 UI를 표시하기를 권장한다.

```tsx filename="app/blog/[slug]/loading.tsx" switcher
export default function Loading() {
  return <LoadingSkeleton />
}
```

```jsx filename="app/blog/[slug]/loading.js" switcher
export default function Loading() {
  return <LoadingSkeleton />
}
```

> **알아두면 좋은 것:** 개발 모드에서는 Next.js Devtools로 라우트가 정적인지 동적인지 확인할 수 있다. 자세한 내용은 [`devIndicators`](https://nextjs.org/docs/app/api-reference/config/next-config-js/devIndicators)를 참고한다.

### `generateStaticParams` 가 없는 동적 세그먼트

[동적 세그먼트](https://nextjs.org/docs/app/api-reference/file-conventions/dynamic-routes)가 프리렌더링될 수 있는데도 [`generateStaticParams`](https://nextjs.org/docs/app/api-reference/functions/generate-static-params)가 없어서 프리렌더링되지 않으면, 해당 라우트는 요청 시점의 동적 렌더링으로 넘어간다.

`generateStaticParams`를 추가하여 빌드 시점에 정적으로 생성되도록 한다.

```tsx filename="app/blog/[slug]/page.tsx" switcher
export async function generateStaticParams() {
  const posts = await fetch('https://.../posts').then((res) => res.json())

  return posts.map((post) => ({
    slug: post.slug,
  }))
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  // ...
}
```

```jsx filename="app/blog/[slug]/page.js" switcher
export async function generateStaticParams() {
  const posts = await fetch('https://.../posts').then((res) => res.json())

  return posts.map((post) => ({
    slug: post.slug,
  }))
}

export default async function Page({ params }) {
  const { slug } = await params
  // ...
}
```

### 느린 네트워크

느리거나 불안정한 네트워크에서는 사용자가 링크를 클릭하기 전에 프리페칭이 끝나지 않을 수 있다. 이는 정적 라우트와 동적 라우트 모두에 영향을 준다. 이 경우 `loading.js` 폴백이 아직 프리페치되지 않았기 때문에 즉시 나타나지 않을 수 있다.

체감 성능을 개선하려면 [`useLinkStatus` 훅](https://nextjs.org/docs/app/api-reference/functions/use-link-status)으로 전환이 진행 중임을 즉시 피드백할 수 있다.

```tsx filename="app/ui/loading-indicator.tsx" switcher
'use client'

import { useLinkStatus } from 'next/link'

export default function LoadingIndicator() {
  const { pending } = useLinkStatus()
  return (
    <span aria-hidden className={`link-hint ${pending ? 'is-pending' : ''}`} />
  )
}
```

```jsx filename="app/ui/loading-indicator.js" switcher
'use client'

import { useLinkStatus } from 'next/link'

export default function LoadingIndicator() {
  const { pending } = useLinkStatus()
  return (
    <span aria-hidden className={`link-hint ${pending ? 'is-pending' : ''}`} />
  )
}
```

초기 애니메이션 지연(예: 100ms)을 주고 처음에는 보이지 않게(예: `opacity: 0`) 시작하여 힌트를 "디바운스"할 수 있다. 이렇게 하면 네비게이션이 지정한 지연보다 오래 걸릴 때만 로딩 인디케이터가 표시된다. CSS 예시는 [`useLinkStatus` 레퍼런스](https://nextjs.org/docs/app/api-reference/functions/use-link-status#gracefully-handling-fast-navigation)를 참고한다.

> **알아두면 좋은 것:** **실험적** [`useOffline`](https://nextjs.org/docs/app/api-reference/config/next-config-js/useOffline) 훅을 사용하면 연결이 끊겨도 프리페치된 라우트로 이동할 수 있다. [오프라인 지원 가이드](https://nextjs.org/docs/app/guides/offline-support)를 참고한다.

> **알아두면 좋은 것:** 프로그레스 바 같은 다른 시각적 피드백 패턴을 사용할 수도 있다. [예시 보기](https://github.com/vercel/react-transition-progress).

### 프리페칭 비활성화

`<Link>` 컴포넌트의 `prefetch` prop을 `false`로 설정하여 프리페칭을 끌 수 있다. 링크가 많은 목록(예: 무한 스크롤 테이블)을 렌더링할 때 불필요한 리소스 사용을 피하는 데 유용하다.

```tsx
<Link prefetch={false} href="/blog">
  Blog
</Link>
```

다만 프리페칭 비활성화에는 트레이드오프가 있다.

- **정적 라우트** — 사용자가 링크를 클릭할 때만 가져온다.
- **동적 라우트** — 클라이언트가 이동하기 전에 서버에서 먼저 렌더링되어야 한다.

프리페치를 완전히 끄지 않으면서 리소스 사용을 줄이려면 hover 시에만 프리페치할 수 있다. 뷰포트 안의 모든 링크가 아니라 사용자가 방문할 **가능성이 더 높은** 라우트로 프리페칭을 한정하는 방법이다.

```tsx filename="app/ui/hover-prefetch-link.tsx" switcher
'use client'

import Link from 'next/link'
import { useState } from 'react'

function HoverPrefetchLink({
  href,
  children,
}: {
  href: string
  children: React.ReactNode
}) {
  const [active, setActive] = useState(false)

  return (
    <Link
      href={href}
      prefetch={active ? null : false}
      onMouseEnter={() => setActive(true)}
    >
      {children}
    </Link>
  )
}
```

```jsx filename="app/ui/hover-prefetch-link.js" switcher
'use client'

import Link from 'next/link'
import { useState } from 'react'

function HoverPrefetchLink({ href, children }) {
  const [active, setActive] = useState(false)

  return (
    <Link
      href={href}
      prefetch={active ? null : false}
      onMouseEnter={() => setActive(true)}
    >
      {children}
    </Link>
  )
}
```

### 하이드레이션 미완료

`<Link>`는 **클라이언트 컴포넌트**이며, 라우트를 프리페치하려면 먼저 하이드레이션되어야 한다. 최초 방문 시 자바스크립트 번들이 크면 하이드레이션이 지연되어 프리페칭이 바로 시작되지 못할 수 있다.

React는 선택적 하이드레이션(Selective Hydration)으로 이를 완화하며, 다음 방법으로 더 개선할 수 있다.

- [`@next/bundle-analyzer`](https://nextjs.org/docs/app/guides/package-bundling#nextbundle-analyzer-for-webpack) 플러그인으로 번들 크기를 파악하고 큰 의존성을 제거한다.
- 가능한 로직을 클라이언트에서 서버로 옮긴다. [서버 컴포넌트와 클라이언트 컴포넌트](https://nextjs.org/docs/app/getting-started/server-and-client-components) 문서를 참고한다.

## 예시

### 네이티브 History API

Next.js에서는 페이지를 다시 로드하지 않고 브라우저 히스토리 스택을 갱신하기 위해 네이티브 [`window.history.pushState`](https://developer.mozilla.org/en-US/docs/Web/API/History/pushState)와 [`window.history.replaceState`](https://developer.mozilla.org/en-US/docs/Web/API/History/replaceState) 메서드를 사용할 수 있다.

`pushState`와 `replaceState` 호출은 Next.js 라우터와 통합되어 [`usePathname`](https://nextjs.org/docs/app/api-reference/functions/use-pathname), [`useSearchParams`](https://nextjs.org/docs/app/api-reference/functions/use-search-params)와 동기화된다.

#### `window.history.pushState`

브라우저 히스토리 스택에 새 항목을 추가할 때 사용한다. 사용자는 이전 상태로 되돌아갈 수 있다. 예를 들어 상품 목록을 정렬하는 경우는 다음과 같다.

```tsx fileName="app/ui/sort-products.tsx" switcher
'use client'

import { useSearchParams } from 'next/navigation'

export default function SortProducts() {
  const searchParams = useSearchParams()

  function updateSorting(sortOrder: string) {
    const params = new URLSearchParams(searchParams.toString())
    params.set('sort', sortOrder)
    window.history.pushState(null, '', `?${params.toString()}`)
  }

  return (
    <>
      <button onClick={() => updateSorting('asc')}>Sort Ascending</button>
      <button onClick={() => updateSorting('desc')}>Sort Descending</button>
    </>
  )
}
```

```jsx fileName="app/ui/sort-products.js" switcher
'use client'

import { useSearchParams } from 'next/navigation'

export default function SortProducts() {
  const searchParams = useSearchParams()

  function updateSorting(sortOrder) {
    const params = new URLSearchParams(searchParams.toString())
    params.set('sort', sortOrder)
    window.history.pushState(null, '', `?${params.toString()}`)
  }

  return (
    <>
      <button onClick={() => updateSorting('asc')}>Sort Ascending</button>
      <button onClick={() => updateSorting('desc')}>Sort Descending</button>
    </>
  )
}
```

#### `window.history.replaceState`

브라우저 히스토리 스택의 현재 항목을 교체할 때 사용한다. 사용자는 이전 상태로 되돌아갈 수 없다. 예를 들어 애플리케이션의 로케일을 전환하는 경우는 다음과 같다.

```tsx fileName="app/ui/locale-switcher.tsx" switcher
'use client'

import { usePathname } from 'next/navigation'

export function LocaleSwitcher() {
  const pathname = usePathname()

  function switchLocale(locale: string) {
    // e.g. '/en/about' or '/fr/contact'
    const newPath = `/${locale}${pathname}`
    window.history.replaceState(null, '', newPath)
  }

  return (
    <>
      <button onClick={() => switchLocale('en')}>English</button>
      <button onClick={() => switchLocale('fr')}>French</button>
    </>
  )
}
```

```jsx fileName="app/ui/locale-switcher.js" switcher
'use client'

import { usePathname } from 'next/navigation'

export function LocaleSwitcher() {
  const pathname = usePathname()

  function switchLocale(locale) {
    // e.g. '/en/about' or '/fr/contact'
    const newPath = `/${locale}${pathname}`
    window.history.replaceState(null, '', newPath)
  }

  return (
    <>
      <button onClick={() => switchLocale('en')}>English</button>
      <button onClick={() => switchLocale('fr')}>French</button>
    </>
  )
}
```
