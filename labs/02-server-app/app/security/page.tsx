import Link from 'next/link'
import { getUsers, getRole } from './actions'
import AdminButtons from './AdminButtons'

export default async function SecurityPage() {
  const users = await getUsers()
  const role = await getRole()

  return (
    <div style={{ padding: 16 }}>
      <h1>Server Action 보안</h1>

      <p>
        사용자 ({users.length}): <strong>{users.join(', ') || '(비어 있음)'}</strong>
      </p>

      <AdminButtons role={role} />

      <hr />
      <nav style={{ display: 'flex', gap: 12 }}>
        <Link href="/flow">← 흐름 제어</Link>
        <Link href="/">home</Link>
      </nav>
    </div>
  )
}
