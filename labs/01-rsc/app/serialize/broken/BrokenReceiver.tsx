'use client'

// 직렬화 실패 후보를 받아보는 클라이언트 컴포넌트.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function BrokenReceiver(props: any) {
  return (
    <div style={{ padding: 16 }}>
      <h2>여기까지 렌더링됐다면 직렬화에 성공한 것이다</h2>
      <pre>{Object.keys(props).join(', ')}</pre>
    </div>
  )
}
