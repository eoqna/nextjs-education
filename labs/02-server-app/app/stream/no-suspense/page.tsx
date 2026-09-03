import Link from 'next/link'
import Slow from '../Slow'

// Suspense 없음 — await 가 어디까지 막는지 본다
export default function NoSuspensePage() {
  return (
    <div style={{ padding: 16 }}>
      <h1>Suspense 없음</h1>
      <p>MARKER_TITLE — 이 줄은 언제 보이나?</p>
      <Slow sec={3} name="A" />
      <Slow sec={1} name="B" />
      <p>MARKER_END</p>
      <Link href="/stream/with-suspense">Suspense 있는 버전 →</Link>
    </div>
  )
}
