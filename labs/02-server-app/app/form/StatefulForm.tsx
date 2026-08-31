'use client'

import { useActionState } from 'react'
import { createPostWithState, type FormState } from './actions'
import { SubmitButton } from './SubmitButton'

const initial: FormState = { ok: false, message: '' }

export default function StatefulForm() {
  // useActionState — 액션의 "반환값"을 상태로 받는다
  const [state, formAction] = useActionState(createPostWithState, initial)

  return (
    <form action={formAction}>
      <input name="title" placeholder="제목 (3자 이상)" />
      <SubmitButton label="저장" />

      {state.message && (
        <p style={{ color: state.ok ? 'seagreen' : 'crimson', marginTop: 8 }}>
          {state.ok ? '✅' : '❌'} {state.message}
        </p>
      )}
    </form>
  )
}
