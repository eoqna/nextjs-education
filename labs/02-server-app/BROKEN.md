# 고장내기 기록 — 02-server-app

에러 메시지 첫 줄을 그대로 옮겨 적는다. 나중에 같은 걸 만났을 때 검색 없이 원인을 알기 위해서다.

---

## 1. 같은 폴더에 `page.tsx` 와 `route.ts`

**세션:** S18

```
Error: An issue occurred while preparing your Next.js app
Conflicting route and page at /conflict:
  route at /conflict/route and page at /conflict/page
```

**우선순위로 하나를 고르지 않는다. 거부한다.** 둘 다 `/conflict` 라는 같은 URL 을
요구하므로 Next.js 가 결정할 수 없다.

### 파급 범위가 크다

| | 충돌 상태 | `route.ts` 제거 후 |
|---|---|---|
| `/conflict` | 500 | 200 |
| `/` | **500** | 200 |
| `/server-fetch` | **500** | 200 |
| `/api/echo` | **500** | 200 |

**해당 라우트만 죽는 게 아니라 앱 전체가 500 이 된다.** 라우팅 테이블을 만드는
준비 단계에서 실패하기 때문이다. 파일 하나를 잘못 둬서 전체가 멈추는 상황이므로,
"내가 안 건드린 페이지도 죽었다" 싶으면 라우트 충돌을 의심할 것.

---

## 2. Route Handler 에서 body 를 두 번 읽기

**세션:** S18

```
TypeError — Body is unusable: Body has already been read
```

`labs/02-server/web-standards.mjs` 에서 순수 Node 로 봤던 **메시지와 완전히 동일하다.**
`Response` 든 `Request` 든, Node 든 Route Handler 든 같은 스트림 규격이다.

해법도 같다 — **읽기 전에** `request.clone()`.

```ts
const forLogging = request.clone()   // 먼저 복제
const logged = await forLogging.json()
const body = await request.json()    // 원본은 무사
```

---

<!-- 새 항목은 아래에 추가한다 -->
## 3. try/catch 가 redirect 를 삼킨다

**세션:** S22
**대상:** `app/flow/actions.ts`

```ts
try {
  await db.save(formData)
  redirect('/done')          // ← 예외를 던진다
} catch (e) {
  return { error: '저장에 실패했습니다' }   // ← 리다이렉트 예외를 여기서 잡아버림
}
```

`redirect` / `notFound` / `unauthorized` / `forbidden` 은 **예외를 던져서** 동작한다.
호출 다음 줄은 실행되지 않는다 (터미널 로그 ②·⑧ 이 안 찍히는 것으로 확인).

따라서 위 코드는 **저장이 성공했는데도** catch 로 빠져서
"저장에 실패했습니다"를 반환한다. **에러도 안 나고 조용히 잘못 동작한다.**

### 증상

| | 응답 |
|---|---|
| 정상 | `200` + `x-action-redirect: /flow/done;push` |
| try/catch | `200` + `{"error":"저장에 실패했습니다"}` — **헤더 없음** |

### 해법 — `unstable_rethrow`

```ts
import { unstable_rethrow } from 'next/navigation'

try {
  redirect('/done')
} catch (e) {
  unstable_rethrow(e)   // 프레임워크 내부 예외면 즉시 다시 던진다
  // 여기부터는 진짜 에러만 온다
  return { error: '저장에 실패했습니다' }
}
```

`catch` 첫 줄에 둔다. 로그 ⑥ 이 안 찍히는 것으로 즉시 재던짐을 확인했다.

### 곁들여 확인한 것 — Server Action 의 리다이렉트는 302 가 아니다

```
HTTP/1.1 200 OK
x-action-redirect: /flow/done;push
content-type: text/x-component
```

이미 POST 응답 중이라 302 를 보내면 브라우저가 자동으로 따라가버리고,
클라이언트 사이드 전환이 무의미해진다. 그래서 **200 으로 응답하고 헤더에
목적지를 실어** 클라이언트 라우터가 처리하게 한다. `;push` 는 히스토리 스택에
쌓으라는 뜻.

---

<!-- 새 항목은 아래에 추가한다 -->
## 4. Server Action 에 권한 체크가 없다 ★

**세션:** S23
**대상:** `app/security/actions.ts`

### 공격

로그인도, 쿠키도, 버튼 클릭도 없이 사용자 전체를 삭제했다.

```bash
curl -X POST http://localhost:3000/security \
  -H "Next-Action: 00af59bd51775d93b5dccfabf31f4b99c75ecf4200" \
  -H 'Content-Type: text/plain;charset=UTF-8' \
  --data '[]'
```

결과: `사용자 (0): (비어 있음)` / `role: guest`

### 착각했던 "보호"

```tsx
{role === 'admin' && <DeleteButton />}   // 화면을 숨겼을 뿐, 문을 잠근 게 아니다
```

**Server Action 호출은 page.tsx 를 거치지 않는다.**

```
브라우저 ──POST (Next-Action: ID)──► 액션 함수 직접 실행
                                      ↑ page 의 검사를 통과하지 않음
```

### 액션 ID 는 비밀이 아니다

클라이언트가 그 ID 로 서버를 호출하므로 **ID 는 클라이언트 코드 안에 있다.**
브라우저에서 JS 를 열면 보인다. 해시는 보안 장치가 아니라 함수 이름 대신 쓰는
식별자일 뿐이다. (이번엔 `.next/dev/server/server-reference-manifest.json` 에서 찾았다)

### 해법 — 액션 안에서 직접 확인

```ts
export async function deleteAllUsersSafe() {
  const role = await getRole()                        // ← 액션 내부에서
  if (role !== 'admin') {
    return { ok: false, error: '권한 없음' }
  }
  // ...
}
```

같은 공격을 두 액션에 동시에 날린 결과:

```
💀 deleteAllUsers 실행됨 — 권한 확인 없이        ← 뚫림
🔒 deleteAllUsersSafe — 요청자 role: guest
🔒 거부됨                                         ← 막힘
```

### 원칙

> **모든 Server Action 은 인증 없는 공개 API 엔드포인트다.**
> 각 액션이 자기 문을 스스로 잠가야 한다.

### S5 와 같은 원리

| | 감춘 것 | 실제 |
|---|---|---|
| S5 | `{open && children}` | 닫아둬도 서버는 이미 실행 |
| S23 | `{role === 'admin' && <Btn/>}` | 안 보여줘도 호출 가능 |

**렌더링 여부와 실행 가능 여부는 별개다.** 같은 원리가 성능 문제로도,
보안 구멍으로도 나타난다.

---

<!-- 새 항목은 아래에 추가한다 -->
## 5. 서버 컴포넌트에서 쿠키·헤더 쓰기

**세션:** S25
**대상:** `app/cookie-lab/page.tsx`

```
❌ ReadonlyRequestCookiesError
   Cookies can only be modified in a Server Action or Route Handler.

❌ ReadonlyHeadersError
   Headers cannot be modified.
```

타입 이름이 답을 담고 있다 — **Readonly**RequestCookies.
서버 컴포넌트가 받는 것은 **읽기 전용 사본**이다.

### 왜 — 권한이 아니라 타이밍

```
HTTP/1.1 200 OK
Set-Cookie: theme=dark        ← 헤더가 먼저 전송된다
Content-Type: text/html
                              ← 빈 줄로 헤더 구간 종료
<html>...                     ← 서버 컴포넌트는 여기를 만드는 중
```

서버 컴포넌트가 실행될 때는 **헤더 구간이 이미 지나갔다.** body 는 스트리밍이라
일부가 브라우저에 도착했을 수도 있다. 되돌아가서 헤더를 끼워넣을 방법이 없다.

### 그래서 되는 곳

| 위치 | 왜 되나 |
|---|---|
| **Server Action** | 응답을 아직 시작하지 않았다. 액션이 끝난 뒤 응답이 만들어진다 |
| **Route Handler** | `Response` 를 직접 만들어 반환한다. 헤더를 포함해서 통째로 |

검증:

```
GET /api/set-cookie?theme=blue
  → set-cookie: theme=blue; Path=/       Route Handler 쓰기 성공
  → 이후 서버 컴포넌트에서 theme: blue    읽기 성공
```

### 클라이언트에서 쓰면 안 되나

`document.cookie` 로 쓸 수는 있다. 다만 **`HttpOnly` 쿠키는 그렇게 만들 수 없다**
(S16 — HttpOnly 는 JS 접근을 막는다). 세션 쿠키를 클라이언트에서 만든다면
그건 이미 안전하지 않다는 뜻이다.

### 연결

S15 "body 는 스트림" → S3 "서버가 응답을 조각내어 보낸다" → 여기.
**응답이 이미 흐르기 시작했다**는 하나의 사실이 세 곳에서 다른 얼굴로 나타난다.

---

<!-- 새 항목은 아래에 추가한다 -->
