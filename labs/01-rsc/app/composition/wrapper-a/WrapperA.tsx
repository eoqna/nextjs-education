'use client'

import { useState } from 'react'
import ServerData from '../ServerData' // ← 클라이언트 파일이 직접 import

export default function WrapperA() {
  const [open, setOpen] = useState(true)

  return (
    <div style={{ border: '2px solid crimson', padding: 12 }}>
      <p>WrapperA (클라이언트) — ServerData 를 직접 import</p>
      <button onClick={() => setOpen(!open)}>{open ? '닫기' : '열기'}</button>
      {open && <ServerData />}
    </div>
  )
}
