'use client'

import { use } from 'react'

type Props = {
  str: string
  num: number
  bool: boolean
  nul: null
  arr: number[]
  obj: { a: number }
  date: Date
  map: Map<string, number>
  set: Set<number>
  promise: Promise<string>
  node: React.ReactNode
}

// 받은 값이 "무엇으로" 도착했는지 확인한다.
// 값이 넘어왔는지보다 타입이 보존됐는지가 중요하다.
export default function Received(props: Props) {
  const resolved = use(props.promise)

  const rows: [string, string, string][] = [
    ['str', String(props.str), typeof props.str],
    ['num', String(props.num), typeof props.num],
    ['bool', String(props.bool), typeof props.bool],
    ['nul', String(props.nul), props.nul === null ? 'null ✓' : typeof props.nul],
    [
      'arr',
      JSON.stringify(props.arr),
      Array.isArray(props.arr) ? 'Array ✓' : typeof props.arr,
    ],
    ['obj', JSON.stringify(props.obj), typeof props.obj],
    [
      'date',
      String(props.date),
      props.date instanceof Date
        ? '✅ Date 인스턴스로 도착'
        : `❌ ${typeof props.date} 로 도착`,
    ],
    [
      'map',
      props.map instanceof Map
        ? JSON.stringify([...props.map.entries()])
        : String(props.map),
      props.map instanceof Map
        ? '✅ Map 인스턴스로 도착'
        : `❌ ${typeof props.map} 로 도착`,
    ],
    [
      'set',
      props.set instanceof Set ? JSON.stringify([...props.set]) : String(props.set),
      props.set instanceof Set
        ? '✅ Set 인스턴스로 도착'
        : `❌ ${typeof props.set} 로 도착`,
    ],
    ['promise', resolved, '✅ use() 로 풀림'],
  ]

  return (
    <div style={{ padding: 16 }}>
      <h2>클라이언트 컴포넌트가 받은 값</h2>

      <table style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr style={{ background: '#eee' }}>
            <th style={cell}>prop</th>
            <th style={cell}>값</th>
            <th style={cell}>도착한 타입</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(([name, value, type]) => (
            <tr key={name}>
              <td style={cell}>
                <code>{name}</code>
              </td>
              <td style={cell}>{value}</td>
              <td style={cell}>{type}</td>
            </tr>
          ))}
          <tr>
            <td style={cell}>
              <code>node</code>
            </td>
            <td style={cell}>{props.node}</td>
            <td style={cell}>렌더링됨</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

const cell: React.CSSProperties = {
  border: '1px solid #ccc',
  padding: '6px 10px',
  textAlign: 'left',
  verticalAlign: 'top',
}
