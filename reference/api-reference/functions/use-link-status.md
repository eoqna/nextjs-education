# useLinkStatus

> **원문:** `node_modules/next/dist/docs/01-app/03-api-reference/04-functions/use-link-status.md`
> **버전:** Next.js 16.3.1
> **웹:** https://nextjs.org/docs/app/api-reference/functions/use-link-status

`useLinkStatus` 훅으로 `<Link>`의 **pending** 상태를 추적할 수 있다. 네비게이션이 완료되는 동안 클릭한 링크 위에 은은한 shimmer 효과를 주는 식의 **인라인 피드백**에 쓴다. 다만 `loading.js`를 통한 라우트 단위 폴백과 프리페칭을 통한 즉각 전환을 우선 고려하라.

`useLinkStatus`가 유용한 경우는 다음과 같다.

- [프리페칭](https://nextjs.org/docs/app/getting-started/linking-and-navigating#prefetching)이 비활성화되었거나 진행 중이어서 네비게이션이 막혀 있을 때
- 목적지 라우트가 **동적이면서** 즉각 이동을 가능하게 해줄 [`loading.js`](https://nextjs.org/docs/app/api-reference/file-conventions/loading) 파일이 없을 때

```tsx filename="app/hint.tsx" switcher
'use client'

import Link from 'next/link'
import { useLinkStatus } from 'next/link'

function Hint() {
  const { pending } = useLinkStatus()
  return (
    <span aria-hidden className={`link-hint ${pending ? 'is-pending' : ''}`} />
  )
}

export default function Header() {
  return (
    <header>
      <Link href="/dashboard" prefetch={false}>
        <span className="label">Dashboard</span> <Hint />
      </Link>
    </header>
  )
}
```

> **알아두면 좋은 것:**
>
> - **`useLinkStatus`는 반드시 `Link` 컴포넌트의 자손 컴포넌트 안에서 사용해야 한다.**
> - `Link` 컴포넌트에 `prefetch={false}`가 설정되어 있을 때 가장 유용하다.
> - **링크된 라우트가 이미 프리페치되어 있으면 pending 단계는 건너뛴다.**
> - 여러 링크를 빠르게 연속 클릭하면 마지막 링크의 pending 상태만 표시된다.
> - Pages Router에서는 지원되지 않으며 항상 `{ pending: false }`를 반환한다.
> - 인라인 인디케이터는 레이아웃 시프트를 일으키기 쉽다. **고정 크기 요소를 항상 렌더해두고 opacity만 토글하거나 애니메이션을 쓰는 편이 낫다.**

## `useLinkStatus`가 필요 없을 수도 있다

인라인 피드백을 추가하기 전에 다음을 검토하라.

- 목적지가 정적이고 프로덕션에서 프리페치된다면 pending 단계 자체가 생략될 수 있다.
- 라우트에 `loading.js` 파일이 있다면 라우트 단위 폴백으로 즉각 전환이 가능하다.

네비게이션은 보통 빠르다. **느린 전환을 발견했을 때의 응급 처치로** `useLinkStatus`를 쓰고, 이후 프리페칭이나 `loading.js` 폴백으로 근본 원인을 고쳐 나가라.

## 매개변수

```tsx
const { pending } = useLinkStatus()
```

`useLinkStatus`는 매개변수를 받지 않는다.

## 반환값

단일 속성을 가진 객체를 반환한다.

| 속성 | 타입 | 설명 |
| --- | --- | --- |
| pending | boolean | 히스토리가 갱신되기 전에는 `true`, 갱신된 후에는 `false` |

## 예시

### 인라인 링크 힌트

프리페칭이 완료되지 않았을 때 클릭이 인식됐음을 알려주는, **레이아웃에 영향을 주지 않는 고정 크기 힌트**를 추가한다.

```tsx filename="app/components/loading-indicator.tsx" switcher
'use client'

import { useLinkStatus } from 'next/link'

export default function LoadingIndicator() {
  const { pending } = useLinkStatus()
  return (
    <span aria-hidden className={`link-hint ${pending ? 'is-pending' : ''}`} />
  )
}
```

```tsx filename="app/shop/layout.tsx" switcher
import Link from 'next/link'
import LoadingIndicator from './components/loading-indicator'

const links = [
  { href: '/shop/electronics', label: 'Electronics' },
  { href: '/shop/clothing', label: 'Clothing' },
  { href: '/shop/books', label: 'Books' },
]

function Menubar() {
  return (
    <div>
      {links.map((link) => (
        <Link key={link.label} href={link.href}>
          <span className="label">{link.label}</span> <LoadingIndicator />
        </Link>
      ))}
    </div>
  )
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <Menubar />
      {children}
    </div>
  )
}
```

## 빠른 네비게이션을 매끄럽게 처리하기

새 라우트로의 이동이 빠르면 사용자에게 힌트가 불필요하게 번쩍이며 보일 수 있다. 네비게이션이 실제로 시간이 걸릴 때만 힌트를 보여주려면, **초기 애니메이션 지연(예: 100ms)을 주고 보이지 않는 상태(`opacity: 0`)로 시작**하면 된다.

```css filename="app/styles/global.css"
.link-hint {
  display: inline-block;
  width: 0.6em;
  height: 0.6em;
  margin-left: 0.25rem;
  border-radius: 9999px;
  background: currentColor;
  opacity: 0;
  visibility: hidden; /* reserve space without showing the hint */
}

.link-hint.is-pending {
  /* Animation 1: fade in after 100ms and keep final opacity */
  /* Animation 2: subtle pulsing while pending */
  visibility: visible;
  animation-name: fadeIn, pulse;
  animation-duration: 200ms, 1s;
  /* Appear only if navigation actually takes time */
  animation-delay: 100ms, 100ms;
  animation-timing-function: ease, ease-in-out;
  animation-iteration-count: 1, infinite;
  animation-fill-mode: forwards, none;
}

@keyframes fadeIn {
  to {
    opacity: 0.35;
  }
}
@keyframes pulse {
  50% {
    opacity: 0.15;
  }
}
```

## 버전 히스토리

| 버전 | 변경 |
| --- | --- |
| `v15.3.0` | `useLinkStatus` 도입 |
