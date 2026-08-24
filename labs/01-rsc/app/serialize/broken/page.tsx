import Link from 'next/link'
import BrokenReceiver from './BrokenReceiver'

class MyClass {
  name = '클래스 인스턴스'
  greet() {
    return 'hi'
  }
}

// 서버 컴포넌트. 직렬화되지 않는 값을 클라이언트로 넘기면 어떻게 되는지 확인한다.
export default function BrokenPage() {
  return (
    <div style={{ padding: 16 }}>
      <h1>직렬화 실패 후보</h1>
      <p>
        아래 <code>fn</code> 을 넘긴다. 에러가 나면 메시지를 그대로 기록할 것.
      </p>

      <BrokenReceiver
        // fn={() => console.log('hi')}
        // ↓ 위 fn 을 주석 처리하고 이걸 해제하면 클래스 인스턴스를 시험한다
        cls={new MyClass()}
      />

      <hr />
      <nav style={{ display: 'flex', gap: 12 }}>
        <Link href="/serialize">돌아가기</Link>
        <Link href="/">home</Link>
      </nav>
    </div>
  )
}

// MyClass 를 실제로 쓰지 않으면 린트가 경고하므로 참조만 남긴다
void MyClass
