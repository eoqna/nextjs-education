'use client'

import { useState } from 'react'

// ServerData 를 import 하지 않는다. children 으로 받을 뿐이다.
export default function WrapperB({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(true)

  return (
    <div style={{ border: '2px solid seagreen', padding: 12 }}>
      <p>WrapperB (클라이언트) — children 으로 받음</p>
      <button onClick={() => setOpen(!open)}>{open ? '닫기' : '열기'}</button>
      {open && children}
    </div>
  )
}
