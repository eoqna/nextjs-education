'use client'

import { useLinkStatus } from 'next/link'

// useLinkStatus 는 <Link> 의 자손 컴포넌트에서만 동작한다.
// label 로 어느 링크의 배지인지 구분한다.
export default function LinkStatusHint({ label }: { label: string }) {
  const { pending } = useLinkStatus()

  return (
    <span
      aria-hidden
      style={{
        marginLeft: 8,
        padding: '2px 8px',
        borderRadius: 10,
        background: pending ? '#ff9f43' : '#eee',
        color: pending ? '#000' : '#bbb',
        fontWeight: pending ? 700 : 400,
        fontSize: 12,
      }}
    >
      {label} {pending ? '⏳ pending' : 'idle'}
    </span>
  )
}
