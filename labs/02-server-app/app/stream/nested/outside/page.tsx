import { Suspense } from 'react'
import Link from 'next/link'
import Slow from '../../Slow'
import Boundary from '../Boundary'

export const dynamic = 'force-dynamic'

async function Boom(): Promise<React.ReactElement> {
  await new Promise((r) => setTimeout(r, 1000))
  throw new Error('💥 1초 뒤 터짐')
}

// ① 과 같은 부품, 같은 개수. Boom 과 안쪽 경계의 위치만 서로 바뀌었다.
export default function Page() {
  return (
    <Boundary name="바깥">
      <div style={{ padding: 16 }}>
        <h1>② MARKER_제목 — Boom 이 안쪽 경계 밖</h1>

        <Boundary name="안쪽">
          <Suspense fallback={<p style={{ background: '#eee', padding: 8 }}>⏳ 정상 로딩…</p>}>
            <Slow sec={2} name="정상" />
          </Suspense>
        </Boundary>

        <Suspense fallback={<p style={{ background: '#eee', padding: 8 }}>⏳ Boom 로딩…</p>}>
          <Boom />
        </Suspense>

        <Link href="/stream/nested">← 목록</Link>
      </div>
    </Boundary>
  )
}
