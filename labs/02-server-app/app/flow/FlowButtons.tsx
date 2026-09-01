'use client'

import { useState } from 'react'
import {
  redirectOk,
  redirectInTryCatch,
  redirectWithRethrow,
  notFoundAction,
} from './actions'

export default function FlowButtons() {
  const [log, setLog] = useState<string[]>([])
  const add = (s: string) => setLog((p) => [s, ...p].slice(0, 6))

  const run = (name: string, fn: () => Promise<unknown>) => async () => {
    add(`▶ ${name} 호출`)
    try {
      const r = await fn()
      add(`  반환값: ${JSON.stringify(r)}`)
    } catch (e) {
      add(`  ❌ ${(e as Error).message}`)
    }
  }

  const btn = { padding: '6px 12px', marginRight: 8, marginBottom: 8 }

  return (
    <div>
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        <button style={btn} onClick={run('redirectOk', redirectOk)}>
          1. redirect (정상)
        </button>
        <button style={btn} onClick={run('redirectInTryCatch', redirectInTryCatch)}>
          2. try/catch 안에서
        </button>
        <button style={btn} onClick={run('redirectWithRethrow', redirectWithRethrow)}>
          3. unstable_rethrow 추가
        </button>
        <button style={btn} onClick={run('notFoundAction', notFoundAction)}>
          4. notFound
        </button>
      </div>

      <pre
        style={{
          background: '#eee',
          padding: 8,
          minHeight: 100,
          whiteSpace: 'pre-wrap',
        }}
      >
        {log.join('\n') || '버튼을 눌러보세요. 터미널도 함께 볼 것.'}
      </pre>
    </div>
  )
}
