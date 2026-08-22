'use client'
// 이 지시어를 지우면 컴파일 에러(HTTP 500). 자세한 내용은 BROKEN.md 참고.

export default function PageErrorBoundary({
  error,
  reset,
}: {
  error: Error
  reset: () => void
}) {
  return (
    <div style={{ border: '3px solid blue', padding: 16, margin: 12 }}>
      <h2>🅱️ 자식 error.tsx (page-error/)</h2>
      <p>같은 폴더의 error.tsx가 잡았습니다.</p>
      <pre style={{ background: '#eee', padding: 8 }}>{error.message}</pre>
      <button onClick={reset}>reset()</button>
    </div>
  )
}
