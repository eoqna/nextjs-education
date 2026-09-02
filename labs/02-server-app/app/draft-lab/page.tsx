import Link from 'next/link'
import { draftMode } from 'next/headers'

const published = { title: '발행된 글', body: '누구나 볼 수 있는 내용' }
const drafts = { title: '초안 (미발행)', body: '편집자만 볼 수 있는 내용' }

export default async function DraftLabPage() {
  const { isEnabled } = await draftMode()
  const post = isEnabled ? drafts : published

  return (
    <div style={{ padding: 16 }}>
      <h1>Draft Mode</h1>
      <p>
        draftMode: <strong>{isEnabled ? '✅ 켜짐' : '❌ 꺼짐'}</strong>
      </p>
      <div style={{ border: '2px solid ' + (isEnabled ? 'crimson' : '#ccc'), padding: 12 }}>
        <h2>{post.title}</h2>
        <p>{post.body}</p>
      </div>
      <p>렌더 시각: {new Date().toISOString()}</p>
      <hr />
      <nav style={{ display: 'flex', gap: 12 }}>
        <Link href="/api/draft">켜기</Link>
        <Link href="/api/draft?on=0">끄기</Link>
        <Link href="/">home</Link>
      </nav>
    </div>
  )
}
