# 대기 중인 퀴즈

다음 세션 **웜업에서 이 파일을 먼저 편다.** 답을 맞춘 뒤 이 파일은 비운다.

답은 여기 적지 않는다 — 세션 시작 때 말로 답하고, 틀린 것만 `wrong-answers.md` 로 간다.

---

## S30·S31 (출제: 2026-09-07)

범위: 스트리밍과 Suspense · 에러 경계 2종

### Q1. 두 경계의 도착 순서

```tsx
<div>
  <h1>제목</h1>
  <Suspense fallback={<p>A 로딩…</p>}>
    <Slow sec={3} name="A" />
  </Suspense>
  <Suspense fallback={<p>B 로딩…</p>}>
    <Slow sec={1} name="B" />
  </Suspense>
</div>
```

HTML 소스에서는 A 가 B 보다 위에 있다.
**브라우저 화면에서 A 와 B 중 어느 쪽이 먼저 채워지는가? 왜 그런가?**

### Q2. await 의 위치를 옮기면

```tsx
// app/slowlayout/layout.tsx
export default async function Layout({ children }) {
  await new Promise((r) => setTimeout(r, 3000))
  return <section>{children}</section>
}

// app/slowlayout/page.tsx   ← Suspense 는 여기 있다
export default function Page() {
  return (
    <>
      <h1>MARKER_TITLE</h1>
      <Suspense fallback={<p>⏳</p>}>
        <Slow sec={1} name="위젯" />
      </Suspense>
    </>
  )
}
```

**`MARKER_TITLE` 은 몇 초에 도착하는가?** page 에 Suspense 가 있는데도 그런가?

### Q3. 경계를 위로 올리면

```tsx
export default function Page() {
  return (
    <WidgetBoundary name="페이지">      {/* catchError 로 만든 경계 */}
      <h1>제목</h1>
      <Suspense><Slow sec={2} name="정상" /></Suspense>
      <Suspense><Boom /></Suspense>     {/* 1초 뒤 throw */}
    </WidgetBoundary>
  )
}
```

**1초 뒤 화면에 남아 있는 것은 무엇인가?** `<h1>제목</h1>` 은 보이는가?

### Q4. 프레임워크 예외

`catchError` 로 감싼 안쪽의 서버 컴포넌트가 `redirect('/login')` 을 호출했다.

- (a) Fallback 이 그려지는가, 리다이렉트가 되는가?
- (b) 같은 자리에 `error.tsx` 를 뒀다면 어떻게 되는가?
- (c) 이 동작이 S22 에서 손수 하던 무엇을 대신하는가?

### Q5. 감춰지는 것과 안 감춰지는 것

`next build && next start` 로 띄운 프로덕션에서 두 가지를 비교한다.

```tsx
// (가) Server Action 이 값을 return 한다
'use server'
export async function save() {
  return { error: 'DB 연결 실패: postgres://admin:p@ssw0rd@db:5432' }
}
```

```tsx
// (나) 서버 컴포넌트가 throw 한다
export default async function Page() {
  throw new Error('DB 연결 실패: postgres://admin:p@ssw0rd@db:5432')
}
```

**브라우저에 접속 정보가 그대로 보이는 쪽은 어디인가? 왜 한쪽만 감춰지는가?**
