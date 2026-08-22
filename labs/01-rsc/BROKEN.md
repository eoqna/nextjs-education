# 고장내기 기록

의도적으로 깨뜨려본 것들과 그때 나온 에러 메시지. **에러 메시지 첫 줄을 그대로 옮겨 적는다** — 나중에 같은 걸 만났을 때 검색 없이 원인을 알기 위해서다.

---

## 1. `error.tsx` 에서 `'use client'` 제거

**세션:** S3
**대상:** `app/error-test/page-error/error.tsx`

**증상:** HTTP 500. 페이지가 아예 렌더링되지 않음 (런타임이 아니라 **컴파일 단계**에서 막힘).

```
Error: app/error-test/page-error/error.tsx must be a Client Component.
       Add the "use client" directive the top of the file to resolve this issue.
```

**원인 (두 가지)**

1. **에러 경계는 React 클래스 컴포넌트 메커니즘이다.** `getDerivedStateFromError` / `componentDidCatch`는 state와 생명주기를 쓴다. 서버 컴포넌트에는 둘 다 없다. 게다가 하이드레이션 이후 브라우저에서 발생하는 에러도 잡아야 하므로 클라이언트여야 한다.
2. **`reset` prop이 함수다.** 함수는 서버 → 클라이언트 직렬화 경계를 넘지 못한다. 서버 컴포넌트라면 `reset`을 받을 수도, `onClick`에 붙일 수도 없다.

**연결:** S1에서 확인한 직렬화 제약과 같은 벽. 새 규칙이 아니다.

---

<!-- 새 항목은 아래에 추가한다 -->
