import Link from 'next/link'
import WrapperB from './WrapperB'
import ServerData from '../ServerData'

// 이 페이지는 서버 컴포넌트다.
// 같은 ServerData 를 children 과 content 두 경로로 넘겨 차이가 있는지 본다.
export default function WrapperBPage() {
  return (
    <div style={{ padding: 16 }}>
      <h1>방식 B — prop 으로 넘기기</h1>
      <WrapperB content={<ServerData />}>
        <ServerData />
      </WrapperB>
      <hr />
      <nav style={{ display: 'flex', gap: 12 }}>
        <Link href="/composition">돌아가기</Link>
      </nav>
    </div>
  )
}
