'use client'

export default function LayoutErrorBoundary({
  error,
  reset,
}: {
  error: Error
  reset: () => void
}) {
  return (
    <div style={{ border: '3px solid blue', padding: 16, margin: 12 }}>
      <h2>🅱️ 자식 error.tsx (layout-error/)</h2>
      <p>같은 폴더의 error.tsx가 잡았습니다.</p>
      <pre style={{ background: '#eee', padding: 8 }}>{error.message}</pre>
      <button onClick={reset}>reset()</button>
    </div>
  )
}
