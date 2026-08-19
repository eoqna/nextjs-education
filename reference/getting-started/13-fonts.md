# 폰트 최적화

> **원문:** `node_modules/next/dist/docs/01-app/01-getting-started/13-fonts.md`
> **버전:** Next.js 16.3.1
> **웹:** https://nextjs.org/docs/app/getting-started/fonts
> **비고:** Pages Router 전용 내용(`<PagesOnly>`)은 제외했다.

[`next/font`](https://nextjs.org/docs/app/api-reference/components/font) 모듈은 폰트를 자동으로 최적화하고 **외부 네트워크 요청을 제거**하여 프라이버시와 성능을 개선한다.

모든 폰트 파일에 대해 **자체 호스팅(self-hosting)이 내장**되어 있다. 덕분에 레이아웃 시프트 없이 웹폰트를 최적으로 로드할 수 있다.

`next/font`를 사용하려면 [`next/font/local`](#로컬-폰트) 또는 [`next/font/google`](#google-폰트)에서 import하고, 적절한 옵션과 함께 함수로 호출한 뒤, 폰트를 적용할 요소의 `className`에 설정한다. 예를 들면 다음과 같다.

```tsx filename="app/layout.tsx" highlight={1,3-5,9} switcher
import { Geist } from 'next/font/google'

const geist = Geist({
  subsets: ['latin'],
})

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={geist.className}>
      <body>{children}</body>
    </html>
  )
}
```

```jsx filename="app/layout.js" highlight={1,3-5,9} switcher
import { Geist } from 'next/font/google'

const geist = Geist({
  subsets: ['latin'],
})

export default function Layout({ children }) {
  return (
    <html className={geist.className}>
      <body>{children}</body>
    </html>
  )
}
```

폰트는 그것이 사용된 컴포넌트로 범위가 한정된다. 애플리케이션 전체에 폰트를 적용하려면 [루트 레이아웃](https://nextjs.org/docs/app/api-reference/file-conventions/layout#root-layout)에 추가한다.

## Google 폰트

모든 Google Font를 자동으로 자체 호스팅할 수 있다. **폰트는 정적 자산(static asset)으로 포함되어 배포처와 동일한 도메인에서 서빙된다.** 즉 사용자가 사이트를 방문할 때 브라우저에서 Google로 나가는 요청이 전혀 없다.

Google 폰트를 사용하려면 `next/font/google`에서 원하는 폰트를 import한다.

```tsx filename="app/layout.tsx" switcher
import { Geist } from 'next/font/google'

const geist = Geist({
  subsets: ['latin'],
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={geist.className}>
      <body>{children}</body>
    </html>
  )
}
```

```jsx filename="app/layout.js" switcher
import { Geist } from 'next/font/google'

const geist = Geist({
  subsets: ['latin'],
})

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={geist.className}>
      <body>{children}</body>
    </html>
  )
}
```

성능과 유연성을 위해 [가변 폰트(variable font)](https://fonts.google.com/variablefonts) 사용을 권장한다. 가변 폰트를 쓸 수 없다면 굵기(weight)를 명시해야 한다.

```tsx filename="app/layout.tsx" highlight={4} switcher
import { Roboto } from 'next/font/google'

const roboto = Roboto({
  weight: '400',
  subsets: ['latin'],
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={roboto.className}>
      <body>{children}</body>
    </html>
  )
}
```

```jsx filename="app/layout.js"  highlight={4} switcher
import { Roboto } from 'next/font/google'

const roboto = Roboto({
  weight: '400',
  subsets: ['latin'],
})

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={roboto.className}>
      <body>{children}</body>
    </html>
  )
}
```

## 로컬 폰트

로컬 폰트를 사용하려면 `next/font/local`에서 `localFont` 함수를 import하고 로컬 폰트 파일의 [`src`](https://nextjs.org/docs/app/api-reference/components/font#src)를 지정한다. 경로는 `localFont`를 호출한 파일을 기준으로 해석된다. 폰트는 [`public`](https://nextjs.org/docs/app/api-reference/file-conventions/public-folder) 폴더나 `app` 폴더 내부를 포함해 프로젝트 어디에나 둘 수 있다. 예를 들어 `app/fonts/`에 저장된 폰트를 사용하려면 다음과 같이 한다.

```tsx filename="app/layout.tsx" switcher
import localFont from 'next/font/local'

const myFont = localFont({
  src: './my-font.woff2',
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={myFont.className}>
      <body>{children}</body>
    </html>
  )
}
```

```jsx filename="app/layout.js" switcher
import localFont from 'next/font/local'

const myFont = localFont({
  src: './my-font.woff2',
})

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={myFont.className}>
      <body>{children}</body>
    </html>
  )
}
```

하나의 폰트 패밀리에 여러 파일을 사용하려면 `src`를 배열로 지정할 수 있다.

```js
const roboto = localFont({
  src: [
    {
      path: './Roboto-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: './Roboto-Italic.woff2',
      weight: '400',
      style: 'italic',
    },
    {
      path: './Roboto-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
    {
      path: './Roboto-BoldItalic.woff2',
      weight: '700',
      style: 'italic',
    },
  ],
})
```
