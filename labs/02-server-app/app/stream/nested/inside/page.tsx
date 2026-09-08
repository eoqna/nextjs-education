import { Suspense } from 'react'
import Link from 'next/link'
import Slow from '../../Slow'
import Boundary from '../Boundary'

// 프리렌더 중 에러가 나면 빌드가 중단된다(BROKEN.md 10번). 그래서 동적으로 돌린다.
export const dynamic = 'force-dynamic'

async function Boom(): Promise<React.ReactElement> {
  await new Promise((r) => setTimeout(r, 1000))
  throw new Error('💥 1초 뒤 터짐')
}

// Boom 을 감싸는 경계가 둘이다: 안쪽 · 바깥
export default function Page() {
  return (
    <Boundary name="바깥">
      <div style={{ padding: 16 }}>
        <h1>① MARKER_제목 — Boom 이 안쪽 경계 안</h1>

        <Boundary name="안쪽">
          <Suspense fallback={<p style={{ background: '#eee', padding: 8 }}>⏳ Boom 로딩…</p>}>
            <Boom />
          </Suspense>
        </Boundary>

        <Suspense fallback={<p style={{ background: '#eee', padding: 8 }}>⏳ 정상 로딩…</p>}>
          <Slow sec={2} name="정상" />
        </Suspense>

        <Link href="/stream/nested">← 목록</Link>
      </div>
    </Boundary>
  )
}
