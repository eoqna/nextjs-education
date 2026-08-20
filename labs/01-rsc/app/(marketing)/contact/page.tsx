import Link from 'next/link'

export default function Contact() {
  return (
    <div>
      <h1>contact</h1>
      <nav style={{ display: 'flex', gap: 12 }}>
        <Link href="/">home</Link>
        <Link href="/about">about</Link>
        <Link href="/cart">cart</Link>
      </nav>
    </div>
  )
}
