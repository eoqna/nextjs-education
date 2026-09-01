import Link from 'next/link'

export default function DonePage() {
  return (
    <div style={{ padding: 16 }}>
      <h1>✅ 도착</h1>
      <p>리다이렉트가 성공했다는 뜻이다.</p>
      <Link href="/flow">← 돌아가기</Link>
    </div>
  )
}
