# 레이아웃과 페이지

> **원문:** `node_modules/next/dist/docs/01-app/01-getting-started/03-layouts-and-pages.md`
> **버전:** Next.js 16.3.1
> **웹:** https://nextjs.org/docs/app/getting-started/layouts-and-pages
> **비고:** 원문의 다이어그램 이미지는 제외했다.

Next.js는 **파일 시스템 기반 라우팅**을 사용한다. 즉 폴더와 파일로 라우트를 정의한다. 이 문서는 레이아웃과 페이지를 만들고 그 사이를 링크로 연결하는 방법을 안내한다.

## 페이지 만들기

**페이지**는 특정 라우트에서 렌더링되는 UI다. 페이지를 만들려면 `app` 디렉토리 안에 [`page` 파일](https://nextjs.org/docs/app/api-reference/file-conventions/page)을 추가하고 React 컴포넌트를 default export 한다. 예를 들어 인덱스 페이지(`/`)를 만들려면 다음과 같이 한다.

```tsx filename="app/page.tsx" switcher
export default function Page() {
  return <h1>Hello Next.js!</h1>
}
```

```jsx filename="app/page.js" switcher
export default function Page() {
  return <h1>Hello Next.js!</h1>
}
```

## 레이아웃 만들기

레이아웃은 여러 페이지 사이에서 **공유되는** UI다. **네비게이션 시 레이아웃은 상태를 보존하고, 인터랙티브한 상태를 유지하며, 다시 렌더링되지 않는다.**

레이아웃은 [`layout` 파일](https://nextjs.org/docs/app/api-reference/file-conventions/layout)에서 React 컴포넌트를 default export 하여 정의한다. 이 컴포넌트는 `children` prop을 받아야 하며, 여기에는 페이지나 또 다른 [레이아웃](#레이아웃-중첩하기)이 들어올 수 있다.

예를 들어 인덱스 페이지를 자식으로 받는 레이아웃을 만들려면 `app` 디렉토리 안에 `layout` 파일을 추가한다.

```tsx filename="app/layout.tsx" switcher
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        {/* Layout UI */}
        {/* Place children where you want to render a page or nested layout */}
        <main>{children}</main>
      </body>
    </html>
  )
}
```

```jsx filename="app/layout.js" switcher
export default function DashboardLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {/* Layout UI */}
        {/* Place children where you want to render a page or nested layout */}
        <main>{children}</main>
      </body>
    </html>
  )
}
```

위 레이아웃은 `app` 디렉토리의 루트에 정의되어 있으므로 [루트 레이아웃](https://nextjs.org/docs/app/api-reference/file-conventions/layout#root-layout)이라고 부른다. 루트 레이아웃은 **필수**이며 반드시 `html`과 `body` 태그를 포함해야 한다.

## 중첩 라우트 만들기

중첩 라우트는 여러 URL 세그먼트로 구성된 라우트다. 예를 들어 `/blog/[slug]` 라우트는 세 개의 세그먼트로 이루어진다.

- `/` (루트 세그먼트)
- `blog` (세그먼트)
- `[slug]` (리프 세그먼트)

Next.js에서는 다음과 같다.

- **폴더**는 URL 세그먼트에 대응하는 라우트 세그먼트를 정의하는 데 쓰인다.
- **파일**(`page`, `layout` 등)은 해당 세그먼트에서 보여줄 UI를 만드는 데 쓰인다.

중첩 라우트를 만들려면 폴더를 서로 중첩하면 된다. 예를 들어 `/blog` 라우트를 추가하려면 `app` 디렉토리에 `blog` 폴더를 만든다. 그다음 `/blog`를 공개적으로 접근 가능하게 하려면 `page.tsx` 파일을 추가한다.

```tsx filename="app/blog/page.tsx" switcher
// Dummy imports
import { getPosts } from '@/lib/posts'
import { Post } from '@/ui/post'

export default async function Page() {
  const posts = await getPosts()

  return (
    <ul>
      {posts.map((post) => (
        <Post key={post.id} post={post} />
      ))}
    </ul>
  )
}
```

```jsx filename="app/blog/page.js" switcher
// Dummy imports
import { getPosts } from '@/lib/posts'
import { Post } from '@/ui/post'

export default async function Page() {
  const posts = await getPosts()

  return (
    <ul>
      {posts.map((post) => (
        <Post key={post.id} post={post} />
      ))}
    </ul>
  )
}
```

폴더를 계속 중첩하여 중첩 라우트를 만들 수 있다. 예를 들어 특정 블로그 글을 위한 라우트를 만들려면 `blog` 안에 새 `[slug]` 폴더를 만들고 `page` 파일을 추가한다.

```tsx filename="app/blog/[slug]/page.tsx" switcher
function generateStaticParams() {}

export default function Page() {
  return <h1>Hello, Blog Post Page!</h1>
}
```

```jsx filename="app/blog/[slug]/page.js" switcher
function generateStaticParams() {}

export default function Page() {
  return <h1>Hello, Blog Post Page!</h1>
}
```

폴더 이름을 대괄호로 감싸면(예: `[slug]`) [동적 라우트 세그먼트](https://nextjs.org/docs/app/api-reference/file-conventions/dynamic-routes)가 만들어진다. 데이터로부터 여러 페이지를 생성할 때 사용한다. 블로그 글, 상품 페이지 등이 그 예다.

## 레이아웃 중첩하기

기본적으로 폴더 계층의 레이아웃들도 함께 중첩된다. 즉 부모 레이아웃이 `children` prop을 통해 자식 레이아웃을 감싼다. 특정 라우트 세그먼트(폴더) 안에 `layout`을 추가하여 레이아웃을 중첩할 수 있다.

예를 들어 `/blog` 라우트를 위한 레이아웃을 만들려면 `blog` 폴더 안에 새 `layout` 파일을 추가한다.

```tsx filename="app/blog/layout.tsx" switcher
export default function BlogLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <section>{children}</section>
}
```

```jsx filename="app/blog/layout.js" switcher
export default function BlogLayout({ children }) {
  return <section>{children}</section>
}
```

위의 두 레이아웃을 합치면, 루트 레이아웃(`app/layout.js`)이 블로그 레이아웃(`app/blog/layout.js`)을 감싸고, 그것이 다시 블로그 페이지(`app/blog/page.js`)와 블로그 글 페이지(`app/blog/[slug]/page.js`)를 감싼다.

## 동적 세그먼트 만들기

[동적 세그먼트](https://nextjs.org/docs/app/api-reference/file-conventions/dynamic-routes)를 사용하면 데이터로부터 생성되는 라우트를 만들 수 있다. 예를 들어 블로그 글마다 라우트를 일일이 만드는 대신, 동적 세그먼트를 만들어 블로그 글 데이터를 기반으로 라우트를 생성할 수 있다.

동적 세그먼트를 만들려면 세그먼트(폴더) 이름을 대괄호로 감싼다: `[segmentName]`. 예를 들어 `app/blog/[slug]/page.tsx` 라우트에서 `[slug]`가 동적 세그먼트다.

```tsx filename="app/blog/[slug]/page.tsx" switcher
export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = await getPost(slug)

  return (
    <div>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
    </div>
  )
}
```

```jsx filename="app/blog/[slug]/page.js" switcher
export default async function BlogPostPage({ params }) {
  const { slug } = await params
  const post = await getPost(slug)

  return (
    <div>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
    </div>
  )
}
```

[동적 세그먼트](https://nextjs.org/docs/app/api-reference/file-conventions/dynamic-routes)와 [`params`](https://nextjs.org/docs/app/api-reference/file-conventions/page#params-optional) prop에 대해 더 알아볼 수 있다.

[동적 세그먼트 내부에 중첩된 레이아웃](https://nextjs.org/docs/app/api-reference/file-conventions/layout#params-optional) 역시 `params` prop에 접근할 수 있다.

## search params로 렌더링하기

서버 컴포넌트 **페이지**에서는 [`searchParams`](https://nextjs.org/docs/app/api-reference/file-conventions/page#searchparams-optional) prop으로 검색 파라미터에 접근할 수 있다.

```tsx filename="app/page.tsx" switcher
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const filters = (await searchParams).filters
}
```

```jsx filename="app/page.jsx" switcher
export default async function Page({ searchParams }) {
  const filters = (await searchParams).filters
}
```

`searchParams`를 사용하면 해당 페이지는 [**동적 렌더링**](https://nextjs.org/docs/app/glossary#dynamic-rendering)으로 전환된다. 검색 파라미터를 읽으려면 들어오는 요청이 필요하기 때문이다.

클라이언트 컴포넌트는 [`useSearchParams`](https://nextjs.org/docs/app/api-reference/functions/use-search-params) 훅으로 검색 파라미터를 읽을 수 있다.

[프리렌더링된](https://nextjs.org/docs/app/api-reference/functions/use-search-params#prerendering) 라우트와 [동적으로 렌더링되는](https://nextjs.org/docs/app/api-reference/functions/use-search-params#dynamic-rendering) 라우트에서의 `useSearchParams` 동작을 더 알아볼 수 있다.

### 무엇을 언제 쓸 것인가

- **페이지의 데이터를 로드하는 데** 검색 파라미터가 필요하다면 `searchParams` prop을 쓴다 (예: 페이지네이션, DB 필터링).
- 검색 파라미터가 **클라이언트에서만** 쓰인다면 `useSearchParams`를 쓴다 (예: 이미 props로 로드된 목록을 필터링).
- 소소한 최적화로, **콜백이나 이벤트 핸들러** 안에서는 `new URLSearchParams(window.location.search)`를 써서 리렌더를 유발하지 않고 검색 파라미터를 읽을 수 있다.

## 페이지 간 링크

[`<Link>` 컴포넌트](https://nextjs.org/docs/app/api-reference/components/link)로 라우트 간을 이동할 수 있다. `<Link>`는 HTML `<a>` 태그를 확장한 Next.js 내장 컴포넌트로, [프리페칭](https://nextjs.org/docs/app/getting-started/linking-and-navigating#prefetching)과 [클라이언트 사이드 네비게이션](https://nextjs.org/docs/app/getting-started/linking-and-navigating#client-side-transitions)을 제공한다.

예를 들어 블로그 글 목록을 만들려면 `next/link`에서 `<Link>`를 import하고 `href` prop을 전달한다.

```tsx filename="app/ui/post.tsx" highlight={1,2,11} switcher
import Link from 'next/link'
import { getPosts } from '@/lib/posts'

export default async function Posts() {
  const posts = await getPosts()

  return (
    <ul>
      {posts.map((post) => (
        <li key={post.slug}>
          <Link href={`/blog/${post.slug}`}>{post.title}</Link>
        </li>
      ))}
    </ul>
  )
}
```

```jsx filename="app/ui/post.js" highlight={1,2,11} switcher
import Link from 'next/link'
import { getPosts } from '@/lib/posts'

export default async function Posts() {
  const posts = await getPosts()

  return (
    <ul>
      {posts.map((post) => (
        <li key={post.slug}>
          <Link href={`/blog/${post.slug}`}>{post.title}</Link>
        </li>
      ))}
    </ul>
  )
}
```

> **알아두면 좋은 것:** `<Link>`는 Next.js에서 라우트 간 이동의 기본 수단이다. 더 고급 네비게이션이 필요하면 [`useRouter` 훅](https://nextjs.org/docs/app/api-reference/functions/use-router)을 쓸 수도 있다.

## 라우트 Props 헬퍼

Next.js는 라우트 구조로부터 `params`와 이름 있는 슬롯을 추론하는 유틸리티 타입을 제공한다.

- [**PageProps**](https://nextjs.org/docs/app/api-reference/file-conventions/page#page-props-helper) — `page` 컴포넌트를 위한 props. `params`와 `searchParams`를 포함한다.
- [**LayoutProps**](https://nextjs.org/docs/app/api-reference/file-conventions/layout#layout-props-helper) — `layout` 컴포넌트를 위한 props. `children`과 이름 있는 슬롯(예: `@analytics` 같은 폴더)을 포함한다.

이들은 **전역으로 사용 가능한** 헬퍼이며, `next dev`, `next build`, [`next typegen`](https://nextjs.org/docs/app/api-reference/cli/next#next-typegen-options) 실행 시 생성된다.

```tsx filename="app/blog/[slug]/page.tsx"
export default async function Page(props: PageProps<'/blog/[slug]'>) {
  const { slug } = await props.params
  return <h1>Blog post: {slug}</h1>
}
```

```tsx filename="app/dashboard/layout.tsx"
export default function Layout(props: LayoutProps<'/dashboard'>) {
  return (
    <section>
      {props.children}
      {/* If you have app/dashboard/@analytics, it appears as a typed slot: */}
      {/* {props.analytics} */}
    </section>
  )
}
```

> **알아두면 좋은 것**
>
> - 정적 라우트에서 `params`는 `{}`로 해석된다.
> - `PageProps`, `LayoutProps`는 전역 헬퍼이므로 **import가 필요 없다.**
> - 타입은 `next dev`, `next build`, `next typegen` 실행 중에 생성된다.
