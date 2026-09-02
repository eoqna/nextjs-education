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
  -H "Next-Action: 00d6858945626c962ace20b69f00e0c2a2d8a3e88e" \
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

> 정정: 처음 기록한 ID `00af59bd…` 는 `getUsers` 였다. 실제 삭제 액션은
> `00d68589…`. 당시엔 6개를 전부 호출해서 공격 자체는 성공했다. (S26 에서 확인)

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
## 6. proxy.ts 를 인증의 유일한 방어선으로 삼기

**세션:** S26

### 확인된 것

**proxy 는 요청이 라우트에 도달하기 전에 실행된다.**

```
요청 ──► proxy ──► 라우트(페이지 / Route Handler / Server Action) ──► 응답
         ↑ 아직 아무것도 렌더링되지 않음
```

그래서 **쿠키를 쓸 수 있다.** 어제(S25) 세운 기준 그대로다.

```
"응답이 시작되기 전인가?"
  Server Action  ✅        Route Handler  ✅
  proxy          ✅        서버 컴포넌트  ❌
```

검증: `set-cookie: proxy-stamp=67098; Path=/`

**모든 요청에 실행된다.** 페이지·Route Handler·정적 파일(`/next.svg`,
`/favicon.ico`) 전부. `matcher` 로 제한하지 않으면 이미지 하나 요청할 때마다 돈다.
→ **proxy 안에서 DB 조회를 하면 안 되는 이유.**

**Server Action 호출도 proxy 를 거친다.**

```
🚧 proxy — POST /security  [Action]
```

S23 에서 page 는 안 거쳤지만 proxy 는 거친다. `matcher` 안이면 실제로 차단된다:

```
POST /security  (쿠키 없음)  →  403 {"error":"proxy 가 막았다"}
```

### 그래도 유일한 방어선으로 삼으면 안 되는 이유

**`matcher` 범위가 곧 방어 범위다.** 경로 하나를 빠뜨리면 그만큼 구멍이 난다.
그리고 proxy 는 모든 요청에 실행되므로 무거운 권한 확인(DB 조회)을 넣기 어렵고,
보통 "세션 쿠키가 있는가" 정도만 본다 — **인증(누구인가)은 되지만
인가(무엇을 할 수 있는가)는 못 한다.**

> proxy 는 **1차 필터**다. 실제 방어는 **각 Server Action / Route Handler 안에서**
> 한다 (S23).

### 미확인으로 남은 것

`matcher` 밖 URL 로 같은 액션 ID 를 POST 하면 우회되는가?
→ 응답이 `{}` 로 와서 **액션이 실행되지 않은 것으로 보이나** 확정하지 못했다.
   (복구 액션 호출이 실패해 초기 상태가 불명확했다)
   Next.js 가 라우트별로 액션 ID 를 검증하는지 다시 확인할 것.

---

<!-- 새 항목은 아래에 추가한다 -->
## 7. 클라이언트 컴포넌트에서 서버 전용 env 읽기 ★

**세션:** S27
**대상:** `app/env-lab/ClientEnv.tsx`

### 빌드 산출물에서 확인한 것

클라이언트 번들에 남은 코드:

```js
let e = t.default.env.DB_PASSWORD,        // ← 치환 안 됨. 런타임 조회로 남는다
    n = "https://api.example.com";        // ← 값 문자열로 치환됨
```

```
빌드 타임
  NEXT_PUBLIC_*   →  값 문자열로 치환. JS 파일 안에 박힌다
  그 외           →  치환하지 않는다. process.env.X 조회 코드가 그대로 남는다

런타임
  서버(SSR)        →  process.env 가 실제로 존재 → 값이 읽힌다
  브라우저          →  process.env 가 없다 → undefined
```

### 함정

| | 결과 |
|---|---|
| JS 번들에서 `super_secret_123` | **0회** — 안전해 보인다 |
| HTML 에서 `super_secret_123` | **3개** — 실제로는 노출됐다 |

**클라이언트 컴포넌트도 최초 요청 때는 서버에서 한 번 렌더링된다.**
그때 `process.env` 가 읽히고, 그 결과가 HTML 로 브라우저에 간다.
번들만 확인하면 안전하다고 착각하기 쉽다.

게다가 하이드레이션 후에는 `undefined` 가 되므로 값이 사라지거나
불일치 경고가 날 수 있다.

문서의 *"replaces them with an empty string"* 은 **클라이언트 번들에 한한 이야기**다.

### 규칙

> 서버 전용 값은 **클라이언트 컴포넌트에서 아예 읽지 않는다.**
> `NEXT_PUBLIC_` 을 붙이면 번들에 박히고, 안 붙이면 SSR 로 새어나간다.
> 둘 다 노출이다.

서버 컴포넌트에서 읽어서 **필요한 부분만 가공해 넘기거나**, `server-only` 패키지로
클라이언트 import 자체를 빌드 타임에 막는다 (S5 문서에서 본 방법).

### 곁들여 — 빌드에서만 잡히는 타입 에러

dev 에서 통과하던 코드가 `next build` 에서 막혔다.

```
<form action={createPost}> 의 액션이 Promise<{ok:boolean}> 를 반환하는데
form action 은 void | Promise<void> 를 요구
```

**`<form action={}>` 에 넘기는 액션은 값을 반환하면 안 된다.**
반환값이 필요하면 `useActionState` 를 쓴다 (S21).
**dev 만 믿으면 안 된다** — 배포 직전에 처음 보게 된다.

---

<!-- 새 항목은 아래에 추가한다 -->
## 8. Draft Mode 를 검증 없이 여는 Route Handler

**세션:** S28

### 확인한 것 — 정적 페이지가 동적으로 바뀐다

`/draft-lab` 은 빌드에서 `○ Static` 으로 판정됐다. 그런데:

```
쿠키 없음   2026-09-02T02:11:54.666Z  (두 번 다 동일 — 빌드 시각 고정)
Draft 켬    2026-09-02T02:12:17.657Z
            2026-09-02T02:12:17.688Z  (매번 다름 — 요청마다 렌더링)
```

발급되는 쿠키 이름이 답이다:

```
set-cookie: __prerender_bypass=cb4866bf…; Path=/; Secure; HttpOnly; SameSite=none
```

**prerender 를 bypass 한다** — 빌드 때 만든 HTML 을 건너뛰고 매번 새로 렌더링한다.

> 지금까지 "정적이냐 동적이냐"는 코드가 결정했는데,
> Draft Mode 는 **요청에 달린 쿠키 하나로 그 판정을 뒤집는다.**
> 3단계(무엇이 라우트를 dynamic 으로 만드는가)로 이어지는 지점.

### 취약점 — 쿠키만 있으면 누구나 본다

```
User-Agent 를 attacker/1.0 으로 바꿔도  →  초안 (미발행)  그대로 보임
```

`HttpOnly; Secure` 라서 JS 로 훔치긴 어렵지만, **값이 새면 그걸로 끝이다.**

```
S23  액션 ID 만 알면 호출 가능
S28  bypass 쿠키만 있으면 초안 열람 가능      ← 같은 구조
```

게다가 `/api/draft` 를 **아무나 호출하면 쿠키를 발급받는다.** 훔칠 필요도 없다.

### 해법 — 시크릿 토큰 검증

```ts
export async function GET(request: Request) {
  const secret = new URL(request.url).searchParams.get('secret')
  if (secret !== process.env.DRAFT_SECRET) {
    return new Response('Invalid token', { status: 401 })
  }
  (await draftMode()).enable()
}
```

S23 의 원칙이 그대로다 — **문을 여는 엔드포인트는 자기 문을 스스로 잠근다.**

---

<!-- 새 항목은 아래에 추가한다 -->
