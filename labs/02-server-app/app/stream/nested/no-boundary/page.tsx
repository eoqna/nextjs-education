import { Suspense } from 'react'
import Link from 'next/link'
import Slow from '../../Slow'

export const dynamic = 'force-dynamic'

async function Boom(): Promise<React.ReactElement> {
  await new Promise((r) => setTimeout(r, 1000))
  throw new Error('💥 1초 뒤 터짐')
}

// catchError 경계를 둘 다 뺐다. Suspense 만 남는다.
// 이 라우트 위에 있는 것은 app/stream/error.tsx 하나뿐이다.
export default function Page() {
  return (
    <div style={{ padding: 16 }}>
      <h1>③ MARKER_제목 — catchError 경계가 없음</h1>

      <Suspense fallback={<p style={{ background: '#eee', padding: 8 }}>⏳ Boom 로딩…</p>}>
        <Boom />
      </Suspense>

      <Suspense fallback={<p style={{ background: '#eee', padding: 8 }}>⏳ 정상 로딩…</p>}>
        <Slow sec={2} name="정상" />
      </Suspense>

      <Link href="/stream/nested">← 목록</Link>
    </div>
  )
}
