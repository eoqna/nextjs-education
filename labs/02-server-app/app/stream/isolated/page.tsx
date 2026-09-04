import { Suspense } from 'react'
import Link from 'next/link'
import Slow from '../Slow'
import WidgetBoundary from './WidgetBoundary'

// 빌드 타임 정적 생성 중에 에러가 나면 빌드 자체가 실패한다.
// error.tsx 는 런타임 경계라 그걸 막지 못한다. 그래서 동적으로 돌린다.
export const dynamic = 'force-dynamic'

async function Boom(): Promise<React.ReactElement> {
  await new Promise((r) => setTimeout(r, 1000))
  throw new Error('💥 외부 API 응답 없음')
}

export default function IsolatedPage() {
  return (
    <div style={{ padding: 16 }}>
      <h1>catchError 로 격리</h1>
      <p>MARKER_TITLE — 위젯 하나가 터져도 나머지는 살아남는가?</p>

      <Suspense fallback={<p style={{ background: '#eee', padding: 8 }}>⏳ 정상 로딩…</p>}>
        <Slow sec={2} name="정상" />
      </Suspense>

      {/* 터지는 위젯만 catchError 로 감싼다 */}
      <WidgetBoundary name="추천">
        <Suspense fallback={<p style={{ background: '#eee', padding: 8 }}>⏳ 추천 위젯 로딩…</p>}>
          <Boom />
        </Suspense>
      </WidgetBoundary>

      <p>MARKER_END</p>
      <nav style={{ display: 'flex', gap: 12 }}>
        <Link href="/stream/error-in-suspense">← 격리 없는 버전</Link>
        <Link href="/">home</Link>
      </nav>
    </div>
  )
}
