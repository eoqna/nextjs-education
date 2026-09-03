import { Suspense } from 'react'
import Link from 'next/link'
import Slow from '../Slow'

export default function WithSuspensePage() {
  return (
    <div style={{ padding: 16 }}>
      <h1>Suspense 있음</h1>
      <p>MARKER_TITLE — 이 줄은 언제 보이나?</p>

      <Suspense fallback={<p style={{ padding: 8, background: '#eee' }}>⏳ A 로딩…</p>}>
        <Slow sec={3} name="A" />
      </Suspense>

      <Suspense fallback={<p style={{ padding: 8, background: '#eee' }}>⏳ B 로딩…</p>}>
        <Slow sec={1} name="B" />
      </Suspense>

      <p>MARKER_END</p>
      <Link href="/stream/no-suspense">← Suspense 없는 버전</Link>
    </div>
  )
}
