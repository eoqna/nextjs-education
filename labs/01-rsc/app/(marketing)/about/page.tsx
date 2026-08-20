import Link from 'next/link'

export default function About() {
  return (
    <div>
      <h1>about</h1>
      <nav style={{ display: 'flex', gap: 12 }}>
        <Link href="/">home</Link>
        {/* 프리페치를 끈 링크 — 클릭하는 순간에야 서버로 요청이 나간다 */}
        <Link href="/contact" prefetch={false}>
          contact (prefetch 꺼짐)
        </Link>
        <Link href="/cart">cart</Link>
        {/* 한 번도 방문한 적 없는 라우트 + 프리페치 꺼짐 = 캐시 오염 없음 */}
        <Link href="/pricing" prefetch={false}>
          pricing (첫 방문)
        </Link>
      </nav>
    </div>
  )
}
