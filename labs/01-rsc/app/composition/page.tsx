import Link from 'next/link'

export default function CompositionIndex() {
  return (
    <div style={{ padding: 16 }}>
      <h1>컴포지션 패턴 실험</h1>
      <p>
        같은 <code>ServerData</code> 컴포넌트를 두 가지 방식으로 클라이언트
        컴포넌트 안에 넣는다.
      </p>
      <nav style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <Link href="/composition/wrapper-a">
          방식 A — 클라이언트가 직접 import
        </Link>
        <Link href="/composition/wrapper-b">방식 B — children 으로 전달</Link>
        <Link href="/">home</Link>
      </nav>
    </div>
  )
}
