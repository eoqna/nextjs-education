import Link from 'next/link'
import LinkStatusHint from '@/app/_components/LinkStatusHint'

// 이 페이지 자체는 서버 컴포넌트다.
// 클라이언트가 필요한 부분(LinkStatusHint)만 클라이언트 컴포넌트로 분리했다.
export default function LinkStatusDemo() {
  const box = {
    border: '1px solid #ccc',
    padding: 12,
    margin: '12px 0',
  }

  return (
    <div style={{ padding: 16 }}>
      <h1>useLinkStatus — 어느 배지가 켜지는가</h1>
      <p>
        A·B·C 모두 <code>/cart?slow=1</code> (3초 지연) 로 이동한다. 세 링크에
        각각 배지를 달았다. <strong>하나를 클릭했을 때 어느 배지가 켜지는지</strong>{' '}
        보라.
      </p>

      <div style={box}>
        <Link href="/cart?slow=1">
          A. prefetch 기본
          <LinkStatusHint label="A" />
        </Link>
      </div>

      <div style={box}>
        <Link href="/cart?slow=1" prefetch={false}>
          B. prefetch=false
          <LinkStatusHint label="B" />
        </Link>
      </div>

      <div style={box}>
        <Link href="/about" prefetch={false}>
          C. 다른 목적지(/about, 지연 없음)
          <LinkStatusHint label="C" />
        </Link>
      </div>

      <hr />
      <nav style={{ display: 'flex', gap: 12 }}>
        <Link href="/">home</Link>
        <Link href="/about">about</Link>
      </nav>
    </div>
  )
}
