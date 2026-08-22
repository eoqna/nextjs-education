import Link from 'next/link'

export default async function Cart({ searchParams }: PageProps<'/cart'>) {
  const { slow } = await searchParams

  // ?slow=1 을 붙이면 3초 지연 — loading.tsx 를 관찰하기 위한 것
  if (slow) {
    console.log('🟠 CartPage — 3초 지연 시작')
    await new Promise((resolve) => setTimeout(resolve, 3000))
    console.log('🟠 CartPage — 지연 끝, 렌더링')
  }

  return (
    <div>
      <h1>cart {slow ? '(느린 버전)' : ''}</h1>
      <nav style={{ display: 'flex', gap: 12 }}>
        <Link href="/">home</Link>
        <Link href="/about">about</Link>
        <Link href="/contact">contact</Link>
        <Link href="/cart?slow=1">cart 느리게</Link>
        <Link href="/error-test">에러 실험</Link>
      </nav>
    </div>
  )
}
