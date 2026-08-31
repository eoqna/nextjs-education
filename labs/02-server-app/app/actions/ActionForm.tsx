'use client'

import { useState } from 'react'
import { createPost, listPosts, deleteAll, returnsFunction } from './actions'

export default function ActionForm() {
  const [log, setLog] = useState<string[]>([])
  const add = (s: string) => setLog((prev) => [s, ...prev].slice(0, 8))

  return (
    <div style={{ border: '2px solid seagreen', padding: 12 }}>
      <p>
        아래 버튼들은 <strong>서로 다른 Server Action</strong> 을 호출한다.
        Network 탭을 열어두고 눌러볼 것.
      </p>

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <button
          onClick={async () => {
            const r = await createPost(`글 ${Date.now() % 1000}`)
            add(`createPost → ${JSON.stringify(r)}`)
          }}
        >
          createPost
        </button>

        <button
          onClick={async () => {
            const r = await listPosts()
            add(`listPosts → ${JSON.stringify(r)}`)
          }}
        >
          listPosts
        </button>

        <button
          onClick={async () => {
            const r = await deleteAll()
            add(`deleteAll → ${JSON.stringify(r)}`)
          }}
        >
          deleteAll
        </button>

        <button
          onClick={async () => {
            try {
              const r = await returnsFunction()
              add(`returnsFunction → ${JSON.stringify(r)}`)
              add(`  retry 의 타입: ${typeof (r as { retry?: unknown }).retry}`)
            } catch (e) {
              add(`returnsFunction → ❌ ${(e as Error).message}`)
            }
          }}
        >
          returnsFunction (Q5)
        </button>
      </div>

      <pre
        style={{
          background: '#eee',
          padding: 8,
          marginTop: 12,
          minHeight: 120,
          whiteSpace: 'pre-wrap',
        }}
      >
        {log.join('\n') || '버튼을 눌러보세요'}
      </pre>
    </div>
  )
}
