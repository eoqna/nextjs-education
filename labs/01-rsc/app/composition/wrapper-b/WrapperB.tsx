'use client'

import { useState } from 'react'

// ServerData 를 import 하지 않는다. prop 으로 받을 뿐이다.
// children 과 content — 이름만 다르고 하는 일은 같은지 확인한다.
export default function WrapperB({
  children,
  content,
}: {
  children: React.ReactNode
  content: React.ReactNode
}) {
  const [open, setOpen] = useState(true)

  return (
    <div style={{ border: '2px solid seagreen', padding: 12 }}>
      <p>WrapperB (클라이언트)</p>
      <button onClick={() => setOpen(!open)}>{open ? '닫기' : '열기'}</button>

      {open && (
        <>
          <div style={{ border: '1px dashed #888', padding: 8, margin: 8 }}>
            <small>children 으로 받은 것</small>
            {children}
          </div>
          <div style={{ border: '1px dashed #888', padding: 8, margin: 8 }}>
            <small>content 라는 이름으로 받은 것</small>
            {content}
          </div>
        </>
      )}
    </div>
  )
}
