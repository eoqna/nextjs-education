import { Suspense } from 'react'
import Link from 'next/link'
import Slow from '../Slow'

// 빌드 타임 정적 생성 중에 에러가 나면 빌드 자체가 실패한다.
// error.tsx 는 런타임 경계라 그걸 막지 못한다. 그래서 동적으로 돌린다.
export const dynamic = 'force-dynamic'

// Suspense 안에서 1초 뒤 에러를 던진다
async function Boom(): Promise<React.ReactElement> {
  await new Promise((r) => setTimeout(r, 1000))
  throw new Error('💥 Suspense 안에서 터진 에러')
}

export default function ErrorInSuspensePage() {
  return (
    <div style={{ padding: 16 }}>
      <h1>Suspense 안의 에러</h1>
      <p>MARKER_TITLE — 셸은 즉시 보인다</p>

      <Suspense fallback={<p style={{ padding: 8, background: '#eee' }}>⏳ 정상 컴포넌트 로딩…</p>}>
        <Slow sec={2} name="정상" />
      </Suspense>

      <Suspense fallback={<p style={{ padding: 8, background: '#eee' }}>⏳ 곧 터질 컴포넌트 로딩…</p>}>
        <Boom />
      </Suspense>

      <p>MARKER_END</p>
      <Link href="/stream/with-suspense">← 정상 버전</Link>
    </div>
  )
}
