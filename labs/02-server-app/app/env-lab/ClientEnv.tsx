'use client'

export default function ClientEnv() {
  // 클라이언트 컴포넌트에서 두 종류의 env 를 읽는다
  const secret = process.env.DB_PASSWORD
  const publicUrl = process.env.NEXT_PUBLIC_API_URL

  return (
    <div style={{ border: '2px solid crimson', padding: 12 }}>
      <h3>클라이언트 컴포넌트에서</h3>
      <table>
        <tbody>
          <tr>
            <td><code>DB_PASSWORD</code></td>
            <td>값: <strong>{JSON.stringify(secret)}</strong></td>
            <td>타입: {typeof secret}</td>
          </tr>
          <tr>
            <td><code>NEXT_PUBLIC_API_URL</code></td>
            <td>값: <strong>{JSON.stringify(publicUrl)}</strong></td>
            <td>타입: {typeof publicUrl}</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}
