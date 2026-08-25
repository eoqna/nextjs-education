import Link from 'next/link'
import WrapperB from './WrapperB'
import ServerData from '../ServerData'

// 이 페이지는 서버 컴포넌트다.
// ServerData 를 여기서 렌더링하고, 그 결과를 WrapperB 에 children 으로 넘긴다.
export default function WrapperBPage() {
  return (
    <div style={{ padding: 16 }}>
      <h1>방식 B — children 으로 넘기기</h1>
      <WrapperB>
        <ServerData />
      </WrapperB>
      <hr />
      <nav style={{ display: 'flex', gap: 12 }}>
        <Link href="/composition">돌아가기</Link>
      </nav>
    </div>
  )
}
