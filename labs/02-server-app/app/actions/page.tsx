import Link from 'next/link'
import ActionForm from './ActionForm'

export default function ActionsPage() {
  return (
    <div style={{ padding: 16 }}>
      <h1>Server Actions</h1>
      <ActionForm />
      <hr />
      <nav style={{ display: 'flex', gap: 12 }}>
        <Link href="/">home</Link>
      </nav>
    </div>
  )
}
