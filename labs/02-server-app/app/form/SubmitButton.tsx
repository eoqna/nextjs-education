'use client'

import { useFormStatus } from 'react-dom'

// <form> 의 자식 컴포넌트. 여기서 호출해야 동작한다.
export function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus()

  return (
    <button disabled={pending} style={{ opacity: pending ? 0.5 : 1 }}>
      {pending ? '전송 중…' : label}
    </button>
  )
}

// 잘못된 위치 — <form> 을 렌더하는 컴포넌트 자신에서 호출.
// 자식이 아니라 형제/부모 관계라 pending 을 알 수 없다.
export function WrongPlaceForm({
  action,
}: {
  action: (formData: FormData) => void
}) {
  const { pending } = useFormStatus()

  return (
    <form action={action}>
      <input name="title" placeholder="제목" />
      <button disabled={pending}>
        {pending ? '전송 중…' : '잘못된 위치 (항상 이 상태)'}
      </button>
    </form>
  )
}
