'use client'

export default function ParentError({
  error,
  reset,
}: {
  error: Error
  reset: () => void
}) {
  return (
    <div style={{ border: '3px solid red', padding: 16, margin: 12 }}>
      <h2>🅰️ 부모 error.tsx (app/error-test/)</h2>
      <p>여기까지 올라왔다는 뜻입니다.</p>
      <pre style={{ background: '#eee', padding: 8 }}>{error.message}</pre>
      <button onClick={reset}>reset()</button>
    </div>
  )
}
