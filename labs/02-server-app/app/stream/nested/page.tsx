import Link from 'next/link'

// 경계 배치 3종. 1초 뒤 무엇이 남는지 예측표를 먼저 채우고 열 것.
export default function NestedIndex() {
  return (
    <div style={{ padding: 16 }}>
      <h1>경계 배치 3종</h1>
      <p>1초 뒤 화면에 무엇이 남는가? 예측을 먼저 적고 연다.</p>
      <ul style={{ lineHeight: 2 }}>
        <li>
          <Link href="/stream/nested/inside">① Boom 이 안쪽 경계 안</Link>
        </li>
        <li>
          <Link href="/stream/nested/outside">② Boom 이 안쪽 경계 밖</Link>
        </li>
        <li>
          <Link href="/stream/nested/no-boundary">③ catchError 경계가 없음</Link>
        </li>
      </ul>
      <Link href="/stream/isolated">← isolated (S31)</Link>
    </div>
  )
}
