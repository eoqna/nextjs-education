'use client'

import { useState } from 'react'

export default function Counter({ label }: { label: string }) {
  const [n, setN] = useState(0)

  return (
    <button
      onClick={() => setN(n + 1)}
      style={{ padding: '4px 10px', marginRight: 8, cursor: 'pointer' }}
    >
      {label}: {n}
    </button>
  )
}
