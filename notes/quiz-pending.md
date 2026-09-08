# 대기 중인 퀴즈

다음 세션 **웜업에서 이 파일을 먼저 편다.** 답을 맞춘 뒤 이 파일은 비운다.

답은 여기 적지 않는다 — 세션 시작 때 말로 답하고, 틀린 것만 `wrong-answers.md` 로 간다.

---

## S30·S31 재출제 (출제: 2026-09-08 · 2회차)

1회차(9/7)는 Q1✗ Q2✗ Q3✗ Q4⅓ Q5(결론만). 같은 내용을 **또 다른 배치로** 다시 묻는다.
바꾼 축: 형제 → 중첩 · 경계 1개 → 2개 · await 의 층 이동 · 다른 파일 → 같은 파일.

**답하기 전에 다섯 답을 나란히 놓고 서로 충돌하지 않는지 훑는다** (패턴 ①, 7회).

### Q1. 중첩된 경계

```tsx
<Suspense fallback={<p>바깥 로딩…</p>}>
  <Slow sec={1} name="바깥" />
  <Suspense fallback={<p>안쪽 로딩…</p>}>
    <Slow sec={3} name="안쪽" />
  </Suspense>
</Suspense>
```

**t=0 / t=1 / t=3 세 시점에 화면에 각각 무엇이 있는가?**

### Q2. 셸의 경계선

```tsx
// app/orders/page.tsx   — loading.tsx 는 없다
export default async function Page() {
  const user = await getUser()          // 0.5초
  return (
    <>
      <h1>{user.name} 님</h1>
      <Suspense fallback={<p>⏳</p>}>
        <Slow sec={2} name="주문내역" />
      </Suspense>
    </>
  )
}
```

- (a) `<h1>` 은 몇 초에 도착하는가?
- (b) 같은 폴더에 `loading.tsx` 를 추가하면 무엇이 달라지는가? `<h1>` 의 도착 시각은?

### Q3. 경계가 두 개일 때

```tsx
<OuterBoundary name="바깥">              {/* catchError */}
  <h1>제목</h1>
  <InnerBoundary name="안쪽">            {/* catchError */}
    <Suspense><Boom /></Suspense>        {/* 1초 뒤 throw */}
  </InnerBoundary>
  <Suspense><Slow sec={2} name="정상" /></Suspense>
</OuterBoundary>
```

**어느 Fallback 이 그려지는가?** 그리고 `<h1>제목</h1>` 과 정상 위젯은 각각 어떻게 되는가?

### Q4. try/catch 가 먼저 있을 때

```tsx
async function Widget() {
  try {
    const res = await fetch('https://api.example.com/posts/1')
    if (res.status === 404) notFound()
    return <article>{/* … */}</article>
  } catch (err) {
    return <p>불러오지 못했습니다</p>
  }
}
```

이 `Widget` 을 `catchError` 로 만든 경계 안에 넣었고, 앱에는 `not-found.tsx` 도 있다.
API 가 404 를 돌려줬다.

**화면에 나오는 것은 셋 중 무엇인가?** `not-found.tsx` / `불러오지 못했습니다` / `catchError` 의 Fallback.
그리고 그 이유는?

### Q5. 같은 파일, 같은 컴포넌트

`next build && next start` 로 띄운 프로덕션이다.

```tsx
export default async function Page({ searchParams }) {
  const { mode } = await searchParams

  if (mode === 'a') {
    return <p>실패: API_KEY=sk-live-abc123 로 인증 실패</p>
  }
  if (mode === 'b') {
    throw new Error('API_KEY=sk-live-abc123 로 인증 실패')
  }
  return <p>정상</p>
}
```

**`?mode=a` 와 `?mode=b` 중 브라우저에 키가 그대로 보이는 쪽은?** 왜 한쪽만 그런가?
