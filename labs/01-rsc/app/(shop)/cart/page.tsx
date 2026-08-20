import Link from 'next/link'

export default function Cart() {
  return (
    <div>
      <h1>cart</h1>
      <nav style={{ display: 'flex', gap: 12 }}>
        <Link href="/">home</Link>
        <Link href="/about">about</Link>
        <Link href="/contact">contact</Link>
      </nav>
    </div>
  )
}
