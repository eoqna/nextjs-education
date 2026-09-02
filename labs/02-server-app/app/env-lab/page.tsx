import Link from 'next/link'
import ClientEnv from './ClientEnv'

export default function EnvLabPage() {
  // 서버 컴포넌트에서는 둘 다 읽힌다
  const secret = process.env.DB_PASSWORD
  const publicUrl = process.env.NEXT_PUBLIC_API_URL

  return (
    <div style={{ padding: 16 }}>
      <h1>환경변수</h1>

      <div style={{ border: '2px solid seagreen', padding: 12, marginBottom: 12 }}>
        <h3>서버 컴포넌트에서</h3>
        <p><code>DB_PASSWORD</code> → <strong>{JSON.stringify(secret)}</strong></p>
        <p><code>NEXT_PUBLIC_API_URL</code> → <strong>{JSON.stringify(publicUrl)}</strong></p>
      </div>

      <ClientEnv />

      <hr />
      <nav style={{ display: 'flex', gap: 12 }}>
        <Link href="/cookie-lab">← 쿠키</Link>
        <Link href="/">home</Link>
      </nav>
    </div>
  )
}
