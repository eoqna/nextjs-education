'use client'

import { catchError, type ErrorInfo } from 'next/error'

// props 는 첫 인자, 에러 정보는 두 번째 인자로 온다
function Fallback({ name }: { name: string }, { error, retry }: ErrorInfo) {
  return (
    <div style={{ border: '2px dashed crimson', padding: 12, margin: 4 }}>
      <strong>⚠️ {name} 위젯만 실패</strong>
      <p style={{ fontSize: 13 }}>{String((error as Error)?.message ?? error)}</p>
      <button onClick={() => retry()}>retry()</button>
    </div>
  )
}

export default catchError(Fallback)
