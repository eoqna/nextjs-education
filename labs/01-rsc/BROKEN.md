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

## 2. 직렬화되지 않는 값을 클라이언트 컴포넌트로 넘기기

**세션:** S4
**대상:** `app/serialize/broken/page.tsx`

### 2-1. 함수 전달

```
Functions cannot be passed directly to Client Components unless you explicitly
expose it by marking it with "use server". Or maybe you meant to call this
function rather than return it.
```

함수 본문은 코드다. 코드와 그것이 붙잡은 클로저는 스트림으로 보낼 수 없다.
`"use server"` 를 붙이면 예외인데, 함수를 보내는 게 아니라 **그 함수를 가리키는 ID**를
보내기 때문이다 (Server Actions). 코드는 여전히 서버에 있다.

### 2-2. 클래스 인스턴스 전달

```
Only plain objects, and a few built-ins, can be passed to Client Components
from Server Components. Classes or null prototypes are not supported.
```

`a few built-ins` — React 가 복원법을 아는 타입 목록이 정해져 있다.

**성공 (타입까지 보존됨)**
`string` `number` `boolean` `null` `Array` plain object
`Date` `Map` `Set` `Promise`(use() 로 풀림) JSX 요소

**실패**
일반 함수, 클래스 인스턴스

### 기준

> **서버와 클라이언트가 이미 공유하고 있는 타입인가**

`Date` 는 양쪽 다 알기 때문에 "Date, 값은 N" 만 보내면 클라이언트가 자기 `Date` 로
되살린다. `MyClass` 는 클라이언트가 모르므로 `greet()` 를 복원할 방법이 없다.

**데이터는 넘어가고 동작(코드)은 넘어가지 않는다.** 클래스 인스턴스는 둘이 섞여 있다.

"새로 생성한 객체인가"는 기준이 아니다 — `{a:1}` 도 새로 생성한 객체지만 넘어간다.

---

<!-- 새 항목은 아래에 추가한다 -->
