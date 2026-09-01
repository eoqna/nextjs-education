import Link from 'next/link'
import FlowButtons from './FlowButtons'

export default function FlowPage() {
  return (
    <div style={{ padding: 16 }}>
      <h1>흐름 제어 — redirect / notFound</h1>
      <p>
        터미널의 번호(① ~ ⑧)로 실행 순서를 추적할 수 있다. 어느 번호가 찍히고
        어느 번호가 안 찍히는지가 핵심이다.
      </p>
      <FlowButtons />
      <hr />
      <nav style={{ display: 'flex', gap: 12 }}>
        <Link href="/form">← 폼</Link>
        <Link href="/">home</Link>
      </nav>
    </div>
  )
}
