import Link from 'next/link'

// 캐시 오염이 없는 새 라우트. 첫 방문 시 서버 요청이 실제로 나가는지 확인하기 위한 것.
export default function Pricing() {
  console.log('🔷 PricingPage 실행')

  return (
    <div>
      <h1>pricing</h1>
      <nav style={{ display: 'flex', gap: 12 }}>
        <Link href="/">home</Link>
        <Link href="/about">about</Link>
      </nav>
    </div>
  )
}
