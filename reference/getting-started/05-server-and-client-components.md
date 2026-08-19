# 서버 컴포넌트와 클라이언트 컴포넌트

> **원문:** `node_modules/next/dist/docs/01-app/01-getting-started/05-server-and-client-components.md`
> **버전:** Next.js 16.3.1
> **웹:** https://nextjs.org/docs/app/getting-started/server-and-client-components

기본적으로 레이아웃과 페이지는 [서버 컴포넌트](https://react.dev/reference/rsc/server-components)다. 덕분에 서버에서 데이터를 가져오고 UI의 일부를 렌더링하며, 필요하면 결과를 캐시하고 클라이언트로 스트리밍할 수 있다. 인터랙션이나 브라우저 API가 필요할 때는 [클라이언트 컴포넌트](https://react.dev/reference/rsc/use-client)로 기능을 덧붙인다.

이 문서는 Next.js에서 서버/클라이언트 컴포넌트가 어떻게 동작하는지, 언제 무엇을 써야 하는지, 그리고 둘을 어떻게 조합하는지 예시와 함께 설명한다.

## 언제 서버 컴포넌트를, 언제 클라이언트 컴포넌트를 쓰는가

클라이언트 환경과 서버 환경은 할 수 있는 일이 다르다. 서버/클라이언트 컴포넌트는 용도에 따라 각 환경에서 로직을 실행할 수 있게 해준다.

**클라이언트 컴포넌트**는 다음이 필요할 때 쓴다.

- [상태](https://react.dev/learn/managing-state)와 [이벤트 핸들러](https://react.dev/learn/responding-to-events). 예: `onClick`, `onChange`
- [생명주기 로직](https://react.dev/learn/lifecycle-of-reactive-effects). 예: `useEffect`
- 브라우저 전용 API. 예: `localStorage`, `window`, `Navigator.geolocation` 등
- [커스텀 훅](https://react.dev/learn/reusing-logic-with-custom-hooks)

**서버 컴포넌트**는 다음이 필요할 때 쓴다.

- 데이터 소스에 가까운 곳에서 DB나 API로부터 데이터를 가져올 때
- API 키, 토큰 등 비밀값을 클라이언트에 노출하지 않고 사용할 때
- 브라우저로 전송되는 자바스크립트 양을 줄일 때
- [First Contentful Paint (FCP)](https://web.dev/fcp/)를 개선하고 콘텐츠를 점진적으로 스트리밍할 때

예를 들어 `<Page>` 컴포넌트는 글 데이터를 가져오는 서버 컴포넌트이며, 그 데이터를 클라이언트 인터랙션을 담당하는 `<LikeButton>`에 props로 전달한다.

```tsx filename="app/[id]/page.tsx" highlight={1,17} switcher
import LikeButton from '@/app/ui/like-button'
import { getPost } from '@/lib/data'

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const post = await getPost(id)

  return (
    <div>
      <main>
        <h1>{post.title}</h1>
        {/* ... */}
        <LikeButton likes={post.likes} />
      </main>
    </div>
  )
}
```

```tsx filename="app/ui/like-button.tsx" highlight={1} switcher
'use client'

import { useState } from 'react'

export default function LikeButton({ likes }: { likes: number }) {
  // ...
}
```

## Next.js에서 서버/클라이언트 컴포넌트는 어떻게 동작하는가

### 서버에서

서버에서 Next.js는 React의 API를 사용해 렌더링을 조율한다. 렌더링 작업은 개별 라우트 세그먼트([레이아웃과 페이지](https://nextjs.org/docs/app/getting-started/layouts-and-pages))별로 청크로 나뉘며, 화면에 표시되든 아니든 [병렬 라우트 슬롯](https://nextjs.org/docs/app/api-reference/file-conventions/parallel-routes)도 포함된다.

- **서버 컴포넌트**는 **RSC 페이로드(React Server Component Payload)** 라는 특수한 데이터 포맷으로 렌더링된다.
- **클라이언트 컴포넌트**와 RSC 페이로드가 함께 HTML을 [프리렌더](https://nextjs.org/docs/app/glossary#prerendering)하는 데 쓰인다.

> **RSC 페이로드란?**
>
> RSC 페이로드는 렌더링된 React 서버 컴포넌트 트리를 압축한 바이너리 표현이다. 클라이언트의 React가 브라우저 DOM을 갱신하는 데 사용한다. RSC 페이로드에는 다음이 담긴다.
>
> - 서버 컴포넌트의 렌더링 결과
> - 클라이언트 컴포넌트가 렌더링될 위치의 **플레이스홀더**와 해당 자바스크립트 파일에 대한 **참조**
> - 서버 컴포넌트에서 클라이언트 컴포넌트로 전달된 props

### 클라이언트에서 (최초 로드)

그다음 클라이언트에서는 이렇게 진행된다.

1. **HTML** — 인터랙션은 아직 안 되지만 빠른 미리보기를 즉시 보여준다.
2. **RSC 페이로드** — 클라이언트와 서버 컴포넌트 트리를 조정(reconcile)한다.
3. **자바스크립트** — 클라이언트 컴포넌트를 하이드레이션하여 앱을 인터랙티브하게 만든다.

> **하이드레이션이란?**
>
> 하이드레이션은 정적 HTML을 인터랙티브하게 만들기 위해 React가 DOM에 [이벤트 핸들러](https://react.dev/learn/responding-to-events)를 붙이는 과정이다.

### 이후의 네비게이션

이후 네비게이션에서는 다음과 같다.

- **RSC 페이로드**가 프리페치되고 캐시되어 즉각적인 이동이 가능하다.
- **클라이언트 컴포넌트**는 서버 렌더링 HTML 없이 전적으로 클라이언트에서 렌더링된다.

## 예시

### 클라이언트 컴포넌트 사용하기

파일 최상단, import보다 위에 [`"use client"`](https://react.dev/reference/react/use-client) 디렉티브를 추가하면 클라이언트 컴포넌트가 된다.

```tsx filename="app/ui/counter.tsx" highlight={1} switcher
'use client'

import { useState } from 'react'

export default function Counter() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <p>{count} likes</p>
      <button onClick={() => setCount(count + 1)}>Click me</button>
    </div>
  )
}
```

`"use client"`는 서버 모듈 그래프와 클라이언트 모듈 그래프(트리) 사이의 **경계를 선언**하는 데 쓰인다.

**어떤 파일이 `"use client"`로 표시되면, 그 파일의 모든 import와 그 파일이 직접 렌더링하는 컴포넌트들이 전부 클라이언트 번들에 포함된다.** 따라서 클라이언트용으로 의도한 컴포넌트마다 디렉티브를 붙일 필요가 없다.

이 동작은 클라이언트 컴포넌트의 [모듈 그래프](https://nextjs.org/docs/app/glossary#module-graph)에 속한 컴포넌트에 적용된다. 즉 그것이 import하는 모듈과 직접 렌더링하는 컴포넌트가 대상이다. **`children`이나 다른 prop으로 전달된 서버 컴포넌트에는 적용되지 않는다.** 그런 컴포넌트는 클라이언트 컴포넌트의 모듈 그래프로 import되지 않으며, 서버에서 렌더링된 뒤 그 결과물이 클라이언트 컴포넌트로 전달된다.

서버/클라이언트 컴포넌트를 조합하는 방법은 [서버와 클라이언트 컴포넌트 섞어 쓰기](#서버와-클라이언트-컴포넌트-섞어-쓰기)를 참고한다.

### JS 번들 크기 줄이기

클라이언트 자바스크립트 번들 크기를 줄이려면, UI의 큰 부분을 통째로 클라이언트 컴포넌트로 만들지 말고 **인터랙션이 필요한 특정 컴포넌트에만** `'use client'`를 추가한다.

예를 들어 `<Layout>` 컴포넌트는 로고와 내비게이션 링크 같은 정적 요소가 대부분이지만 인터랙티브한 검색바를 포함한다. `<Search />`는 인터랙티브하므로 클라이언트 컴포넌트여야 하지만, 레이아웃의 나머지는 서버 컴포넌트로 남을 수 있다.

```tsx filename="app/layout.tsx" highlight={12} switcher
// Client Component
import Search from './search'
// Server Component
import Logo from './logo'

// Layout is a Server Component by default
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <nav>
        <Logo />
        <Search />
      </nav>
      <main>{children}</main>
    </>
  )
}
```

```tsx filename="app/ui/search.tsx" highlight={1} switcher
'use client'

export default function Search() {
  // ...
}
```

### 서버에서 클라이언트 컴포넌트로 데이터 전달하기

props를 사용해 서버 컴포넌트에서 클라이언트 컴포넌트로 데이터를 전달할 수 있다.

```tsx filename="app/[id]/page.tsx" highlight={1,12} switcher
import LikeButton from '@/app/ui/like-button'
import { getPost } from '@/lib/data'

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const post = await getPost(id)

  return <LikeButton likes={post.likes} />
}
```

```tsx filename="app/ui/like-button.tsx" highlight={1} switcher
'use client'

export default function LikeButton({ likes }: { likes: number }) {
  // ...
}
```

또는 [`use` API](https://react.dev/reference/react/use)로 서버 컴포넌트에서 클라이언트 컴포넌트로 데이터를 스트리밍할 수도 있다. [예시](https://nextjs.org/docs/app/getting-started/fetching-data#streaming-data-with-the-use-api)를 참고한다.

> **알아두면 좋은 것:** 클라이언트 컴포넌트로 전달되는 props는 React가 [직렬화](https://react.dev/reference/react/use-server#serializable-parameters-and-return-values)할 수 있어야 한다.

### 서버와 클라이언트 컴포넌트 섞어 쓰기

서버 컴포넌트를 클라이언트 컴포넌트에 **prop으로** 전달할 수 있다. 이렇게 하면 서버에서 렌더링된 UI를 클라이언트 컴포넌트 안에 시각적으로 중첩시킬 수 있다.

흔한 패턴은 `children`을 사용해 `<ClientComponent>` 안에 _슬롯_ 을 만드는 것이다. 예를 들어 서버에서 데이터를 가져오는 `<Cart>` 컴포넌트를, 표시 여부를 클라이언트 상태로 토글하는 `<Modal>` 컴포넌트 안에 넣는 경우다.

```tsx filename="app/ui/modal.tsx" switcher
'use client'

export default function Modal({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>
}
```

그다음 부모 서버 컴포넌트(예: `<Page>`)에서 `<Cart>`를 `<Modal>`의 자식으로 전달한다.

```tsx filename="app/page.tsx"  highlight={7} switcher
import Modal from './ui/modal'
import Cart from './ui/cart'

export default function Page() {
  return (
    <Modal>
      <Cart />
    </Modal>
  )
}
```

이 패턴에서 서버 컴포넌트는 클라이언트 컴포넌트에 prop으로 전달되더라도 **미리 서버에서 렌더링된다.** RSC 페이로드에는 그 서버 컴포넌트들의 렌더링 결과와, 클라이언트 컴포넌트가 렌더링될 위치의 플레이스홀더 및 자바스크립트 파일 참조가 담긴다.

### 컨텍스트 프로바이더

[React 컨텍스트](https://react.dev/learn/passing-data-deeply-with-context)는 현재 테마 같은 전역 상태를 공유할 때 흔히 쓰인다. 그러나 **서버 컴포넌트에서는 React 컨텍스트를 지원하지 않는다.**

컨텍스트를 쓰려면 `children`을 받는 클라이언트 컴포넌트를 만든다.

```tsx filename="app/theme-provider.tsx" switcher
'use client'

import { createContext } from 'react'

export const ThemeContext = createContext({})

export default function ThemeProvider({
  children,
}: {
  children: React.ReactNode
}) {
  return <ThemeContext.Provider value="dark">{children}</ThemeContext.Provider>
}
```

그다음 서버 컴포넌트(예: `layout`)에서 import한다.

```tsx filename="app/layout.tsx" switcher
import ThemeProvider from './theme-provider'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}
```

이제 서버 컴포넌트가 프로바이더를 직접 렌더링할 수 있고, 앱 전체의 다른 클라이언트 컴포넌트들이 이 컨텍스트를 사용할 수 있다.

> **알아두면 좋은 것:** 프로바이더는 트리에서 **가능한 한 깊은 곳에** 렌더링해야 한다. 위 예시에서 `ThemeProvider`가 `<html>` 문서 전체가 아니라 `{children}`만 감싸는 것에 주목하자. 이렇게 해야 Next.js가 서버 컴포넌트의 정적인 부분을 최적화하기 쉬워진다.

서버에서 가져온 데이터를 컨텍스트로 전달하고 클라이언트 컴포넌트에서 `use()`로 읽는 방법은 [컨텍스트 프로바이더 안에서 React의 `use` 사용하기](https://nextjs.org/docs/app/guides/single-page-applications#using-reacts-use-within-a-context-provider)를 참고한다.

### 서드파티 컴포넌트

클라이언트 전용 기능에 의존하는 서드파티 컴포넌트를 쓸 때는, 그것을 클라이언트 컴포넌트로 감싸면 정상 동작하게 만들 수 있다.

예를 들어 `acme-carousel` 패키지에서 `<Carousel />`을 import한다고 하자. 이 컴포넌트는 `useState`를 쓰지만 아직 `"use client"` 디렉티브가 없다.

`<Carousel />`을 클라이언트 컴포넌트 **안에서** 쓰면 정상 동작한다.

```tsx filename="app/gallery.tsx" switcher
'use client'

import { useState } from 'react'
import { Carousel } from 'acme-carousel'

export default function Gallery() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div>
      <button onClick={() => setIsOpen(true)}>View pictures</button>
      {/* Works, since Carousel is used within a Client Component */}
      {isOpen && <Carousel />}
    </div>
  )
}
```

그러나 서버 컴포넌트 안에서 직접 쓰려고 하면 에러가 난다. Next.js가 `<Carousel />`이 클라이언트 전용 기능을 쓴다는 사실을 모르기 때문이다.

이를 해결하려면 클라이언트 전용 기능에 의존하는 서드파티 컴포넌트를 직접 만든 클라이언트 컴포넌트로 감싼다.

```tsx filename="app/carousel.tsx" switcher
'use client'

import { Carousel } from 'acme-carousel'

export default Carousel
```

이제 서버 컴포넌트 안에서 `<Carousel />`을 직접 쓸 수 있다.

```tsx filename="app/page.tsx" switcher
import Carousel from './carousel'

export default function Page() {
  return (
    <div>
      <p>View pictures</p>
      {/*  Works, since Carousel is a Client Component */}
      <Carousel />
    </div>
  )
}
```

> **라이브러리 제작자를 위한 조언**
>
> 컴포넌트 라이브러리를 만든다면 클라이언트 전용 기능에 의존하는 진입점에 `"use client"` 디렉티브를 추가하라. 그러면 사용자가 래퍼를 만들 필요 없이 서버 컴포넌트에서 바로 import할 수 있다.
>
> 일부 번들러는 `"use client"` 디렉티브를 제거해버릴 수 있다는 점에 유의하자. esbuild에서 디렉티브를 유지하도록 설정하는 예시는 [React Wrap Balancer](https://github.com/shuding/react-wrap-balancer/blob/main/tsup.config.ts#L10-L13)와 [Vercel Analytics](https://github.com/vercel/analytics/blob/main/packages/web/tsup.config.js#L26-L30) 저장소에서 볼 수 있다.

### 환경 오염 방지하기

자바스크립트 모듈은 서버 컴포넌트와 클라이언트 컴포넌트 양쪽에서 공유될 수 있다. 따라서 **서버 전용 코드가 실수로 클라이언트에 import될 수 있다.** 다음 함수를 보자.

```ts filename="lib/data.ts" switcher
export async function getData() {
  const res = await fetch('https://external-service.com/data', {
    headers: {
      authorization: process.env.API_KEY,
    },
  })

  return res.json()
}
```

이 함수에는 절대 클라이언트에 노출되어서는 안 되는 `API_KEY`가 들어 있다.

Next.js에서는 **`NEXT_PUBLIC_` 접두사가 붙은 환경변수만** 클라이언트 번들에 포함된다. 접두사가 없으면 Next.js가 그 값을 **빈 문자열로 치환한다.**

그 결과 `getData()`가 클라이언트에서 import되어 실행되더라도 의도대로 동작하지 않는다.

클라이언트 컴포넌트에서 실수로 사용하는 것을 막으려면 [`server-only` 패키지](https://www.npmjs.com/package/server-only)를 쓸 수 있다.

서버 전용 코드가 담긴 파일에 이 패키지를 import한다.

```js filename="lib/data.js"
import 'server-only'

export async function getData() {
  const res = await fetch('https://external-service.com/data', {
    headers: {
      authorization: process.env.API_KEY,
    },
  })

  return res.json()
}
```

이제 이 모듈을 클라이언트 컴포넌트에서 import하려고 하면 **빌드 타임에 에러**가 발생한다.

이에 대응하는 [`client-only` 패키지](https://www.npmjs.com/package/client-only)는 `window` 객체에 접근하는 코드처럼 클라이언트 전용 로직이 담긴 모듈을 표시하는 데 쓸 수 있다.

Next.js에서 `server-only`나 `client-only` 설치는 **선택 사항**이다. 다만 린트 규칙이 명시되지 않은 의존성을 문제 삼는다면 설치해두는 편이 낫다.

```bash package="npm"
npm install server-only
```

Next.js는 `server-only`와 `client-only` import를 내부적으로 처리하여, 모듈이 잘못된 환경에서 사용될 때 더 명확한 에러 메시지를 제공한다. NPM에 있는 이 패키지들의 실제 내용은 Next.js가 사용하지 않는다.

또한 Next.js는 [`noUncheckedSideEffectImports`](https://www.typescriptlang.org/tsconfig/#noUncheckedSideEffectImports)가 활성화된 TypeScript 설정을 위해 `server-only`와 `client-only`의 타입 선언도 자체 제공한다.
