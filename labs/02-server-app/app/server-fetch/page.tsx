import Link from 'next/link'

// 서버 컴포넌트. 'use client' 없음 → 절차 1에 의해 번들에 안 들어감 → 서버에서 실행.
export default async function ServerFetchPage() {
  console.log('🔴 서버에서 fetch 시작')

  // example.com 은 Access-Control-Allow-Origin 헤더를 주지 않는다.
  // 브라우저에서 부르면 CORS 로 막히지만 서버에서는 상관없다.
  const res = await fetch('https://example.com')
  const html = await res.text()

  console.log('🔴 서버 fetch 완료:', res.status, html.length, 'bytes')

  // API 키를 URL 에 넣는 상황을 흉내낸다 (실제 호출은 하지 않는다)
  const fakeKey = 'SECRET_KEY_12345'
  const urlWithKey = `https://api.example.com/data?key=${fakeKey}`

  return (
    <div style={{ padding: 16 }}>
      <h1>서버 컴포넌트에서 fetch</h1>

      <p>
        상태: <strong>{res.status}</strong> / 본문 <strong>{html.length}</strong>{' '}
        bytes
      </p>

      <p>
        키가 들어간 URL 을 서버에서만 사용:{' '}
        <code>{urlWithKey.replace(fakeKey, '••••••')}</code>
      </p>

      <details>
        <summary>받아온 HTML 앞부분</summary>
        <pre style={{ background: '#eee', padding: 8, overflow: 'auto' }}>
          {html.slice(0, 300)}
        </pre>
      </details>

      <hr />
      <nav style={{ display: 'flex', gap: 12 }}>
        <Link href="/client-fetch">클라이언트 버전 →</Link>
        <Link href="/">home</Link>
      </nav>
    </div>
  )
}
