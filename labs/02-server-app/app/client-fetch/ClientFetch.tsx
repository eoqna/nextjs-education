'use client'

import { useEffect, useState } from 'react'

export default function ClientFetch() {
  const [status, setStatus] = useState('요청 전')
  const [detail, setDetail] = useState('')

  useEffect(() => {
    console.log('🔵 클라이언트에서 fetch 시작 (브라우저 콘솔)')

    fetch('https://example.com')
      .then(async (res) => {
        const html = await res.text()
        setStatus(`성공 — ${res.status}`)
        setDetail(`${html.length} bytes`)
      })
      .catch((e: Error) => {
        setStatus('실패')
        setDetail(`${e.name} — ${e.message}`)
      })
  }, [])

  return (
    <div style={{ border: '2px solid crimson', padding: 12 }}>
      <p>
        결과: <strong>{status}</strong>
      </p>
      <pre style={{ background: '#eee', padding: 8, whiteSpace: 'pre-wrap' }}>
        {detail || '…'}
      </pre>
      <p style={{ fontSize: 13, color: '#666' }}>
        자세한 에러는 브라우저 콘솔에 찍힌다. Network 탭도 함께 볼 것.
      </p>
    </div>
  )
}
