import Link from 'next/link'
import WrapperA from './WrapperA'

export default function WrapperAPage() {
  return (
    <div style={{ padding: 16 }}>
      <h1>방식 A — 클라이언트가 서버 컴포넌트를 직접 import</h1>
      <WrapperA />
      <hr />
      <nav style={{ display: 'flex', gap: 12 }}>
        <Link href="/composition">돌아가기</Link>
      </nav>
    </div>
  )
}
