import Link from 'next/link'
import { createPost, getTitles } from './actions'
import StatefulForm from './StatefulForm'
import { WrongPlaceForm } from './SubmitButton'

// 이 페이지는 서버 컴포넌트다.
export default async function FormPage() {
  const titles = await getTitles()

  const box = { border: '1px solid #ccc', padding: 12, margin: '12px 0' }

  return (
    <div style={{ padding: 16 }}>
      <h1>폼과 상태</h1>

      <div style={box}>
        <h2>A. 순수 form — 클라이언트 코드 없음</h2>
        <p>
          이 폼에는 <code>&apos;use client&apos;</code> 가 어디에도 없다. JS 를 꺼도
          동작하는지 확인할 것.
        </p>
        <form action={createPost}>
          <input name="title" placeholder="제목" />
          <button>생성 (JS 없이도?)</button>
        </form>
      </div>

      <div style={box}>
        <h2>B. useActionState + useFormStatus</h2>
        <p>서버 검증이 1.5초 걸린다. 그동안 버튼이 어떻게 되는지 볼 것.</p>
        <StatefulForm />
      </div>

      <div style={box}>
        <h2>C. useFormStatus 를 잘못된 위치에서 호출</h2>
        <p>
          <code>&lt;form&gt;</code> 을 렌더하는 컴포넌트 자신에서 호출했다.
          제출해도 버튼 상태가 바뀌는지 볼 것.
        </p>
        <WrongPlaceForm action={createPost} />
      </div>

      <div style={box}>
        <h2>저장된 제목 ({titles.length})</h2>
        <ul>
          {titles.map((t, i) => (
            <li key={i}>{t}</li>
          ))}
        </ul>
      </div>

      <hr />
      <nav style={{ display: 'flex', gap: 12 }}>
        <Link href="/actions">← Server Actions</Link>
        <Link href="/">home</Link>
      </nav>
    </div>
  )
}
