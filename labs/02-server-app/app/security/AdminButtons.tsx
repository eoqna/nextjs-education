'use client'

import { useState } from 'react'
import {
  deleteAllUsers,
  deleteAllUsersSafe,
  resetUsers,
  setRole,
} from './actions'

export default function AdminButtons({ role }: { role: string }) {
  const [log, setLog] = useState<string[]>([])
  const add = (s: string) => setLog((p) => [s, ...p].slice(0, 6))

  const btn = { padding: '6px 12px', marginRight: 8, marginBottom: 8 }

  return (
    <div>
      <p>
        현재 role: <strong>{role}</strong>
      </p>

      <div>
        <button style={btn} onClick={async () => { await setRole('admin'); location.reload() }}>
          role=admin 으로
        </button>
        <button style={btn} onClick={async () => { await setRole('guest'); location.reload() }}>
          role=guest 로
        </button>
        <button style={btn} onClick={async () => { const r = await resetUsers(); add(`reset → ${JSON.stringify(r)}`) }}>
          사용자 복구
        </button>
      </div>

      {/* 관리자에게만 보여준다 — 이게 "보호"일까? */}
      {role === 'admin' && (
        <div style={{ border: '2px solid crimson', padding: 12, marginTop: 12 }}>
          <p>⚠️ 관리자 전용 영역 (guest 에게는 렌더되지 않음)</p>
          <button style={btn} onClick={async () => { const r = await deleteAllUsers(); add(`취약버전 → ${JSON.stringify(r)}`) }}>
            전체 삭제 (취약)
          </button>
          <button style={btn} onClick={async () => { const r = await deleteAllUsersSafe(); add(`안전버전 → ${JSON.stringify(r)}`) }}>
            전체 삭제 (안전)
          </button>
        </div>
      )}

      <pre style={{ background: '#eee', padding: 8, marginTop: 12, minHeight: 80, whiteSpace: 'pre-wrap' }}>
        {log.join('\n') || '—'}
      </pre>
    </div>
  )
}
