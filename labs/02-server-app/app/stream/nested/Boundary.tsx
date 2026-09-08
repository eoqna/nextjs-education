'use client'

import { catchError, type ErrorInfo } from 'next/error'

// props 는 첫 인자, 에러 정보는 두 번째 인자
function Fallback({ name }: { name: string }, { error, retry }: ErrorInfo) {
  return (
    <div style={{ border: '3px dashed crimson', padding: 12, margin: 6, background: '#fff5f5' }}>
      <strong>🛑 {name} Fallback</strong>
      <p style={{ fontSize: 13, margin: '6px 0' }}>
        {String((error as Error)?.message ?? error)}
      </p>
      <button onClick={() => retry()}>retry()</button>
    </div>
  )
}

export default catchError(Fallback)
