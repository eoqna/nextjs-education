# 02-server · 웹 표준 실습

2단계 첫 두 세션(S15·S16)은 **Next.js 없이 순수 Node** 로 진행한다.
Route Handler 의 `Request`/`Response` 가 프레임워크 산물이 아니라
웹 표준이라는 걸 손으로 확인하기 위해서다.

```bash
node web-standards.mjs
node request-basics.mjs
node cookies.mjs
```

## 확인한 것

**전역 API** — `Request` `Response` `fetch` `Headers` `FormData` `URL`
Node 18+ 에서 전역이다. import 불필요.

**body 는 ReadableStream**
- `.json()` 이 Promise 인 이유 — 스트림을 끝까지 읽어야 하니까
- 두 번 읽으면 `TypeError: Body has already been read`
- `bodyUsed` 플래그로 소비 여부를 확인
- 두 번 읽어야 하면 **읽기 전에** `clone()`

**쿼리 파라미터** — `req.query` 는 없다 (그건 Express 것).
`new URL(req.url).searchParams` 로 파싱.

**GET + body** — `TypeError`. 조용히 무시되지 않는다.

**쿠키의 비대칭**

| | 헤더 | 내용 |
|---|---|---|
| 응답 | `Set-Cookie` × N | 이름=값 + 속성(HttpOnly, Secure, SameSite…) |
| 요청 | `Cookie` × 1 | 이름=값 만. **속성은 오지 않는다** |

- `headers.get('set-cookie')` 는 여러 개를 콤마로 합쳐버린다 → **`getSetCookie()`** 를 쓸 것
- 서버는 쿠키가 HttpOnly 인지 알 수 없다. **속성은 브라우저에게 주는 지시일 뿐이고 브라우저가 지킨다**
- 따라서 쿠키 속성은 방어의 전부가 아니다. 서버는 항상 토큰 자체를 검증해야 한다

**세 속성이 막는 것**

```
HttpOnly   JS 접근 차단          XSS 방어
Secure     HTTPS 에서만 전송      도청 방어
SameSite   교차 사이트 요청 제한   CSRF 방어
```

**세션 토큰은 localStorage 가 아니라 HttpOnly 쿠키에.**
localStorage 는 XSS 한 번이면 통째로 털린다.
