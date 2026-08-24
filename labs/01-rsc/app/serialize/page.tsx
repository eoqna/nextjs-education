import { Suspense } from 'react'
import Link from 'next/link'
import Received from './Received'

async function fetchSomething() {
  await new Promise((resolve) => setTimeout(resolve, 500))
  return '💫 0.5초 뒤 도착한 값'
}

// 이 페이지는 서버 컴포넌트다.
// 아래 props 가 클라이언트 경계를 넘을 수 있는지 확인한다.
export default function SerializePage() {
  return (
    <div style={{ padding: 16 }}>
      <h1>직렬화 경계 실험</h1>

      <Suspense fallback={<p>promise 기다리는 중…</p>}>
        <Received
          str="문자열"
          num={42}
          bool={true}
          nul={null}
          arr={[1, 2, 3]}
          obj={{ a: 1 }}
          date={new Date()}
          map={new Map([['a', 1]])}
          set={new Set([1, 2])}
          promise={fetchSomething()}
          node={<strong>JSX 요소</strong>}
        />
      </Suspense>

      <hr />
      <p>
        실패 후보(<code>fn</code>, <code>cls</code>)는{' '}
        <code>app/serialize/broken/page.tsx</code> 에서 따로 확인한다.
      </p>
      <nav style={{ display: 'flex', gap: 12 }}>
        <Link href="/serialize/broken">실패 후보 보기</Link>
        <Link href="/">home</Link>
      </nav>
    </div>
  )
}
