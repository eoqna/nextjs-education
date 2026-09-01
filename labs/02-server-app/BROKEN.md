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
