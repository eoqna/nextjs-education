'use client'

import { useState } from 'react'
import { setThemeAction, clearThemeAction } from './actions'

export default function ThemeButtons() {
  const [log, setLog] = useState('')
  const btn = { padding: '6px 12px', marginRight: 8 }

  return (
    <div>
      <button style={btn} onClick={async () => {
        const r = await setThemeAction('dark'); setLog(JSON.stringify(r)); location.reload()
      }}>Server Action 으로 dark</button>

      <button style={btn} onClick={async () => {
        const r = await setThemeAction('light'); setLog(JSON.stringify(r)); location.reload()
      }}>Server Action 으로 light</button>

      <button style={btn} onClick={async () => {
        await clearThemeAction(); location.reload()
      }}>삭제</button>

      <button style={btn} onClick={async () => {
        const r = await fetch('/api/set-cookie?theme=blue').then(r => r.json())
        setLog(JSON.stringify(r)); location.reload()
      }}>Route Handler 로 blue</button>

      {log && <pre style={{ background: '#eee', padding: 8, marginTop: 8 }}>{log}</pre>}
    </div>
  )
}
