import Link from 'next/link'
import ClientFetch from './ClientFetch'

// 페이지 자체는 서버 컴포넌트. fetch 를 하는 부분만 클라이언트로 분리했다.
export default function ClientFetchPage() {
  return (
    <div style={{ padding: 16 }}>
      <h1>클라이언트 컴포넌트에서 fetch</h1>
      <p>
        서버 버전과 <strong>완전히 같은 URL</strong> 에 요청한다. 결과가 다르다면
        이유는 코드가 아니라 <strong>실행 위치</strong>에 있다.
      </p>

      <ClientFetch />

      <hr />
      <nav style={{ display: 'flex', gap: 12 }}>
        <Link href="/server-fetch">← 서버 버전</Link>
        <Link href="/">home</Link>
      </nav>
    </div>
  )
}
