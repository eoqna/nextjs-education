import Link from 'next/link'
import { cookies, headers } from 'next/headers'
import ThemeButtons from './ThemeButtons'

export default async function CookieLabPage() {
  const c = await cookies()
  const h = await headers()

  // ① 읽기 — 동작하는가?
  const theme = c.get('theme')?.value ?? '(없음)'
  const ua = h.get('user-agent')?.slice(0, 40) ?? '(없음)'

  // ② 쓰기 — 서버 컴포넌트에서 시도하면?
  let writeResult = ''
  try {
    c.set('visited', 'true')
    writeResult = '✅ 쓰기 성공 (예상 밖)'
  } catch (e) {
    writeResult = `❌ ${(e as Error).constructor.name}\n${(e as Error).message}`
  }

  // headers 쓰기도 시도
  let headerWrite = ''
  try {
    // headers() 는 ReadonlyHeaders 를 반환하지만 런타임 동작을 보기 위해 우회한다
    ;(h as unknown as Headers).set('x-custom', 'hi')
    headerWrite = '✅ 쓰기 성공 (예상 밖)'
  } catch (e) {
    headerWrite = `❌ ${(e as Error).constructor.name} — ${(e as Error).message}`
  }

  const box = { border: '1px solid #ccc', padding: 12, margin: '12px 0' }

  return (
    <div style={{ padding: 16 }}>
      <h1>cookies() / headers()</h1>

      <div style={box}>
        <h2>① 서버 컴포넌트에서 읽기</h2>
        <p>theme: <strong>{theme}</strong></p>
        <p>user-agent: <code>{ua}…</code></p>
      </div>

      <div style={box}>
        <h2>② 서버 컴포넌트에서 쓰기</h2>
        <pre style={{ background: '#eee', padding: 8, whiteSpace: 'pre-wrap' }}>{writeResult}</pre>
        <p>headers().set() 시도:</p>
        <pre style={{ background: '#eee', padding: 8, whiteSpace: 'pre-wrap' }}>{headerWrite}</pre>
      </div>

      <div style={box}>
        <h2>③ 다른 곳에서 쓰기</h2>
        <ThemeButtons />
      </div>

      <hr />
      <nav style={{ display: 'flex', gap: 12 }}>
        <Link href="/security">← 보안</Link>
        <Link href="/">home</Link>
      </nav>
    </div>
  )
}
