'use client'

export default function StreamError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div style={{ border: '3px solid red', padding: 16, margin: 12 }}>
      <h2>🅰️ 부모 error.tsx (app/stream/)</h2>
      <pre style={{ background: '#eee', padding: 8 }}>{error.message}</pre>
      <button onClick={reset}>reset()</button>
    </div>
  )
}
