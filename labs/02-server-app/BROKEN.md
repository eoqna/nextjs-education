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
