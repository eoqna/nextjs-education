import Link from 'next/link'

export default function ErrorTestIndex() {
  return (
    <div>
      <h1>에러 경계 실험</h1>
      <nav style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <Link href="/error-test/page-error">
          Q2 · page.tsx 가 에러를 던진다
        </Link>
        <Link href="/error-test/layout-error">
          Q3 · layout.tsx 가 에러를 던진다
        </Link>
        <Link href="/">home</Link>
      </nav>
    </div>
  )
}
