'use client'

export default function InnerError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div style={{ border: '3px solid blue', padding: 16, margin: 12 }}>
      <h2>🅱️ 자식 error.tsx (error-in-suspense/)</h2>
      <pre style={{ background: '#eee', padding: 8 }}>{error.message}</pre>
      <button onClick={reset}>reset()</button>
    </div>
  )
}
