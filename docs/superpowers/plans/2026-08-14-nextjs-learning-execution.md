# Next.js 학습 실행 계획

> **사용법:** 세션을 마칠 때마다 체크박스를 채운다. 세션은 1회 1.75시간(105분) 기준이며, 주 4~5회 진행한다. 순서를 건너뛰지 않는다 — 뒤 세션이 앞 세션의 결과를 전제로 한다.

## 매 세션 공통 구조 (105분)

아래 세션 목록에는 🔮 예측과 🔨 실습만 적혀 있다. **그 앞뒤에 웜업과 정리가 항상 붙는다.**

| | 시간 | 내용 |
|---|---|---|
| ① 웜업 | 10분 | 지난 세션 끝에 Claude Code가 낸 퀴즈의 답을 확인한다. 오답노트에서 무작위로 1~2개를 꺼내 다시 답해본다 |
| ② 예측 | 15분 | 🔮 항목. **문서를 열기 전에** `notes/prediction-card.md` 형식으로 적는다 |
| ③ 문서 | 30분 | 📖 링크. 예측과 대조하며 읽는다 |
| ④ 실습 | 40분 | 🔨 항목. 고장내기 포함 |
| ⑤ 정리 | 10분 | 틀린 것만 오답노트에. 그리고 Claude Code에게 오늘 범위로 **퀴즈 5개 출제 요청**(답은 받지 않는다) |

**②가 ③보다 앞에 온다는 것이 이 계획의 전부다.** 순서가 뒤집히면 그냥 문서 읽기가 된다.

## 주간 정리 세션 공통 (매주 마지막 세션)

"N주차 정리"로 표시된 세션에서는 아래를 항상 한다.

1. **오답노트 추세 확인** — 이번 주 항목 수를 `notes/wrong-answers.md` 맨 위에 `주차: N / 신규 M건` 형식으로 기록한다. 보는 것은 **절대 개수가 아니라 추세와 태그 분포**다. 새 주제에 들어가면 늘어나는 것이 정상이고, **같은 태그가 3주 연속 쌓이면** 그 영역을 다시 봐야 한다는 신호다.
2. **`#언러닝` 항목 이관** — 해당 태그 항목을 `notes/unlearning.md`로 옮기고 오답노트에서는 지운다.
3. **설명 산출물 작성** — `notes/weekly/TEMPLATE.md` 참조. 주제는 이번 주 오답노트에서 고른다.
4. **커밋.**

**목표:** Claude Code가 작성한 Next.js 코드의 동작을 읽기 전에 예측하고, 남에게 설명할 수 있는 수준에 도달한다.

**접근:** 예측-검증 루프. 문서를 읽기 **전에** 예측을 적고, 읽은 뒤 대조하며, 틀린 것만 오답노트에 남긴다. 공식문서는 순회 대상이 아니라 정답 확인용 참조자료다.

**기술 스택:** Next.js 16.3.x · React 19.2 · TypeScript 5.1+ · Node.js 20.9+ · Turbopack

**스펙:** [`docs/superpowers/specs/2026-08-14-nextjs-learning-plan-design.md`](../specs/2026-08-14-nextjs-learning-plan-design.md)

**총량:** 71세션 · 약 124시간 · 15주

---

## 전역 제약

이 계획 전체에 적용된다. 매 세션 암묵적으로 포함된다.

- **Next.js 버전을 `16.3.x`로 고정한다.** 학습 중 업그레이드하지 않는다. 4단계 시작 시점(11주차)에만 한 번 재검토한다.
- **공식문서만 참조한다.** 검색으로 나온 블로그·유튜브는 v14/v15 기준이 대부분이며, 캐싱·async API·proxy에서 정면 충돌한다. 참조가 필요하면 문서의 해당 페이지를 먼저 찾는다.
- **모든 세션은 예측을 먼저 적고 시작한다.** 예측 없이 문서를 먼저 읽으면 그 세션은 학습이 아니라 독서다.
- **오답노트에는 멘탈 모델 오류만 적는다.** 오타·API 이름 착각은 적지 않는다. `[전제]` 필드는 비워두지 않는다.
- **3단계 실습은 `next build && next start` 프로덕션 빌드로 한다.** 개발 서버는 캐싱·프리렌더 동작이 다르다.
- **1~3단계에서는 Next.js DevTools MCP를 붙이지 않는다.** 4단계에서만 붙인다.
- **`labs/`의 고장낸 코드를 지우지 않는다.** 주석으로 무슨 증상이었는지만 남긴다.

---

## 사전 준비 (0.5h, 학습 시작 전 1회)

- [ ] **P1 · 작업 환경 구성**

```bash
cd /Users/gimdaon/dbshin/projects/nextjs-education
mkdir -p notes/weekly labs project
```

노트 템플릿 4종과 `CLAUDE.md`는 이 계획과 함께 생성되어 있다. 내용을 한 번 읽어둔다.

- [ ] **P2 · Node.js 버전 확인**

```bash
node -v   # v20.9.0 이상이어야 한다
```

미달이면 먼저 업그레이드한다. Next.js 16은 Node 18을 지원하지 않는다.

- [ ] **P3 · 커밋**

```bash
git add -A
git commit -m "chore: 학습 환경 및 노트 템플릿 구성"
```

---

# 1단계 · 언러닝 + RSC 멘탈 모델

**3주 · 14세션 · ~25h**

**졸업 기준:** 임의의 컴포넌트 트리를 보고 클라이언트 번들 경계를 손으로 그릴 수 있다.

## 1주차 — 환경과 파일 규약

- [ ] **S1 · 프로젝트 생성과 문서 지도**

📖 [Installation](https://nextjs.org/docs/app/getting-started/installation) · [Project Structure](https://nextjs.org/docs/app/getting-started/project-structure)

```bash
cd labs
npx create-next-app@latest 01-rsc --typescript --app --tailwind --eslint --no-src-dir
cd 01-rsc && npm run dev
```

🔮 **예측 (문서 읽기 전, 5분):** 생성된 파일 트리를 보고 `app/layout.tsx`와 `app/page.tsx` 각각에 대해 — 이 파일은 서버에서 도는가 클라이언트에서 도는가? `app/` 밖의 파일도 라우트가 되는가? `layout.tsx`는 페이지 이동 시 다시 실행되는가?

🔨 **실습:** 문서 사이드바 전체를 훑고 `notes/doc-map.md`에 **세 그룹으로 분류**해서 적는다 — ① 1단계에서 볼 것 ② 나중에 볼 것 ③ 이번 학습에서 아예 안 볼 것. 3번 그룹을 명시적으로 정하는 것이 목적이다. 안 그러면 문서 전체를 읽으려는 충동이 계속 남는다.

✅ **확인:** dev 서버가 뜨고, 문서 지도가 작성됐다.

---

- [ ] **S2 · 파일 규약**

📖 [Layouts and Pages](https://nextjs.org/docs/app/getting-started/layouts-and-pages) · [layout.js](https://nextjs.org/docs/app/api-reference/file-conventions/layout) · [page.js](https://nextjs.org/docs/app/api-reference/file-conventions/page)

🔮 **예측:** 아래 구조에서 `/dashboard/settings` 에 접속하면 어떤 파일들이 어떤 순서로 중첩되는가? `dashboard/layout.tsx`의 state는 `/dashboard/settings` ↔ `/dashboard/profile` 이동 시 유지되는가?

```
app/
  layout.tsx
  page.tsx
  dashboard/
    layout.tsx
    page.tsx
    settings/page.tsx
    profile/page.tsx
```

🔨 **실습:** 위 구조를 직접 만들고 각 파일에 `<div>파일명</div>`을 렌더한다. 브라우저에서 중첩 순서를 눈으로 확인한다.

🔨 **고장내기:** `dashboard/page.tsx`를 지우고 `/dashboard`에 접속한다. `layout.tsx`만 있으면 어떻게 되는가?

✅ **확인:** layout이 왜 "중첩되며 상태를 유지하는 껍데기"인지 설명할 수 있다.

---

- [ ] **S3 · loading / error / not-found**

📖 [loading.js](https://nextjs.org/docs/app/api-reference/file-conventions/loading) · [error.js](https://nextjs.org/docs/app/api-reference/file-conventions/error) · [not-found.js](https://nextjs.org/docs/app/api-reference/file-conventions/not-found) · [template.js](https://nextjs.org/docs/app/api-reference/file-conventions/template)

🔮 **예측:** `loading.tsx`는 언제 보이는가? `error.tsx`가 잡을 수 있는 에러와 못 잡는 에러는 무엇인가? `layout.tsx`에서 던진 에러는 같은 폴더의 `error.tsx`가 잡는가?

🔨 **실습:** `dashboard/loading.tsx`, `dashboard/error.tsx`를 만들고 페이지에서 3초 지연과 의도적 에러를 각각 발생시킨다.

```tsx
// app/dashboard/page.tsx — 지연 확인용
export default async function Page() {
  await new Promise((r) => setTimeout(r, 3000))
  return <div>dashboard</div>
}
```

🔨 **고장내기:** `error.tsx`에서 `'use client'`를 지운다. 무슨 일이 일어나는가? 왜 error 경계는 클라이언트 컴포넌트여야 하는가?

✅ **확인:** `error.tsx`가 `'use client'`를 요구하는 이유를 설명할 수 있다. `template.tsx`와 `layout.tsx`의 차이를 안다.

---

- [ ] **S4 · 라우팅과 네비게이션**

📖 [Linking and Navigating](https://nextjs.org/docs/app/getting-started/linking-and-navigating) · [Dynamic Segments](https://nextjs.org/docs/app/api-reference/file-conventions/dynamic-routes) · [Route Groups](https://nextjs.org/docs/app/api-reference/file-conventions/route-groups)

🔮 **예측:** `<Link>`와 `<a>`의 차이는 무엇인가? `<Link>`를 화면에 렌더하면 클릭 전에 이미 무슨 일이 일어나는가? 라우트 그룹 `(marketing)`은 URL에 나타나는가?

🔨 **실습:** `app/blog/[slug]/page.tsx`를 만들고 `params`를 화면에 출력한다. **`await params`가 필요하다** — v16에서 동기 접근은 제거됐다.

```tsx
export default async function Page({ params }: PageProps<'/blog/[slug]'>) {
  const { slug } = await params
  return <div>slug: {slug}</div>
}
```

🔨 **고장내기:** `await` 없이 `params.slug`로 접근해본다. 어떤 에러가 나는가? 이 에러 메시지를 기억해둔다 — 구버전 블로그 코드를 복사할 때마다 보게 된다.

✅ **확인:** `PageProps<'/route'>` 타입 헬퍼의 존재를 알고, params가 왜 Promise가 됐는지 추측할 수 있다 (3단계에서 답을 확인한다).

---

- [ ] **S5 · 1주차 정리**

🔨 오답노트를 다시 읽고 `#언러닝` 태그 항목을 `notes/unlearning.md`로 옮긴다.

✍️ **설명 산출물 #1** — `notes/weekly/01-*.md`. 주제는 오답노트에서 고른다. 500~800자, 남에게 설명하는 톤.

🔨 **커밋:** `git add -A && git commit -m "week1: 파일 규약과 라우팅"`

---

## 2주차 — 서버/클라이언트 경계 (1단계의 핵심)

- [ ] **S6 · 서버 컴포넌트가 기본값이다**

📖 [Server and Client Components](https://nextjs.org/docs/app/getting-started/server-and-client-components) · [Rendering Philosophy](https://nextjs.org/docs/app/guides/rendering-philosophy)

🔮 **예측:** 아래 코드는 동작하는가? `console.log`는 어디에 찍히는가 — 브라우저 콘솔인가 터미널인가?

```tsx
// app/test/page.tsx
export default function Page() {
  console.log('안녕')
  return <button onClick={() => alert('클릭')}>버튼</button>
}
```

🔨 **실습:** 위 코드를 그대로 실행하고 예측과 대조한다. 그다음 `'use client'`를 맨 위에 추가하고 `console.log`가 어디로 옮겨가는지 확인한다.

✅ **확인:** "서버 컴포넌트는 브라우저로 코드가 가지 않는다"를 실제로 확인했다.

---

- [ ] **S7 · `'use client'`는 파일이 아니라 경계다**

📖 [use client](https://nextjs.org/docs/app/api-reference/directives/use-client) · [Server and Client Boundary](https://nextjs.org/docs/app/guides/server-and-client-boundary)

🔮 **예측 (이 세션의 핵심):** 아래에서 **클라이언트 번들에 들어가는 파일을 전부 고른다.**

```
app/page.tsx           (지시어 없음) — Header, Sidebar를 import
components/Header.tsx  ('use client')  — Logo를 import
components/Logo.tsx    (지시어 없음)
components/Sidebar.tsx (지시어 없음)  — Menu를 import
components/Menu.tsx    (지시어 없음)
lib/format.ts          (지시어 없음)  — Logo가 import
```

답을 적기 전에 근거도 함께 적는다. **`Logo.tsx`에 `'use client'`가 없다는 사실이 답에 영향을 주는가?**

🔨 **실습:** 위 구조를 실제로 만들고, 각 파일에 `console.log('파일명')`을 넣어 어디에 찍히는지로 검증한다.

🔨 **고장내기:** `Logo.tsx`에서 `useState`를 쓴다. 에러가 나는가? `Menu.tsx`에서 `useState`를 쓰면? 두 결과가 다른 이유가 이 세션의 결론이다.

✅ **확인:** "`'use client'`는 그 파일부터 아래 import 그래프 전체를 클라이언트로 만든다"를 코드로 증명할 수 있다.

---

- [ ] **S8 · 직렬화 경계**

📖 [Server and Client Boundary](https://nextjs.org/docs/app/guides/server-and-client-boundary) (props 전달 섹션)

🔮 **예측:** 서버 컴포넌트에서 클라이언트 컴포넌트로 아래 props를 넘길 때 각각 성공하는가 실패하는가?

```tsx
<ClientComp
  str="문자열"
  num={42}
  date={new Date()}
  map={new Map([['a', 1]])}
  fn={() => console.log('hi')}
  promise={fetchData()}
  node={<div>JSX</div>}
/>
```

7개 각각에 O/X와 이유를 적는다.

🔨 **실습:** 하나씩 실제로 넘겨보고 에러 메시지를 수집한다. 성공한 것 중 예상과 다른 것이 있으면 오답노트로.

✅ **확인:** 무엇이 직렬화 가능한지 목록으로 말할 수 있고, Promise가 넘어가는 이유를 설명할 수 있다.

---

- [ ] **S9 · 컴포지션 패턴 (1단계 최난관)**

📖 [Server and Client Boundary](https://nextjs.org/docs/app/guides/server-and-client-boundary) (컴포지션 섹션)

🔮 **예측:** 아래 두 코드의 차이는? `ServerData`는 각각 서버에서 도는가 클라이언트에서 도는가?

```tsx
// 코드 A
'use client'
import ServerData from './ServerData'
export default function Wrapper() {
  return <div><ServerData /></div>
}

// 코드 B — app/page.tsx (서버)
import Wrapper from './Wrapper'   // 'use client'
import ServerData from './ServerData'
export default function Page() {
  return <Wrapper><ServerData /></Wrapper>
}
```

🔨 **실습:** 둘 다 만들고 `ServerData`에서 `console.log`와 `await`를 써서 어디서 실행되는지 확인한다.

🔨 **고장내기:** 코드 A에서 `ServerData`를 `async` 함수로 만든다. 무슨 에러가 나는가?

✅ **확인:** **"클라이언트 컴포넌트 안에 서버 컴포넌트를 넣으려면 `children`으로 넘겨야 한다"**를 이유와 함께 설명할 수 있다. 이걸 모르면 앱 전체가 `'use client'`로 물든다.

---

- [ ] **S10 · 2주차 정리**

🔨 지금까지 만든 lab 앱의 컴포넌트 트리를 **손으로 그리고 클라이언트 번들 경계를 색칠한다.** 졸업 시험 예행연습이다.

✍️ **설명 산출물 #2** — 주제 추천: "`'use client'`가 파일 단위가 아닌 이유"

🔨 **커밋:** `git add -A && git commit -m "week2: 서버/클라이언트 경계"`

---

## 3주차 — 언러닝과 졸업

- [ ] **S11 · async params와 v16 변경점**

📖 [Version 16 Upgrade Guide](https://nextjs.org/docs/app/guides/upgrading/version-16) · [page.js](https://nextjs.org/docs/app/api-reference/file-conventions/page)

🔮 **예측:** `params`, `searchParams`, `cookies()`, `headers()`가 모두 Promise가 된 이유는 무엇일까? (힌트: 이것들은 언제 알 수 있는 값인가?) 답을 적어두고 3단계 S35에서 확인한다.

🔨 **실습:** 업그레이드 가이드의 제거·변경 목록을 읽고, `notes/unlearning.md`에 **"내가 알고 있던 것 → v16의 실제"** 표를 작성한다. 최소 8행.

✅ **확인:** 구버전 코드를 봤을 때 무엇이 낡았는지 즉시 알아본다.

---

- [ ] **S12 · Pages Router 언러닝**

📖 [App Router Migration](https://nextjs.org/docs/app/guides/migrating/app-router-migration)

🔮 **예측:** `getServerSideProps`, `getStaticProps`, `getStaticPaths`, `_app.tsx`, `_document.tsx`, `pages/api/*`는 각각 App Router에서 무엇으로 대체되는가? 문서를 읽기 전에 6개 모두 답을 적는다.

🔨 **실습:** 예측과 문서를 대조하고 `notes/unlearning.md`의 대조표를 완성한다.

✅ **확인:** Pages Router 습관 중 어떤 것이 App Router에서 **틀린 예측을 만드는지** 목록화했다.

---

- [ ] **S13 · 고장내기 집중**

🔨 아래를 전부 실행하고 에러 메시지와 원인을 `labs/01-rsc/BROKEN.md`에 기록한다.

1. 서버 컴포넌트에서 `useState` 사용
2. 서버 컴포넌트에서 `onClick` 전달
3. 클라이언트 컴포넌트를 `async` 함수로 선언
4. 클라이언트 컴포넌트에서 `fs` 모듈 import
5. 서버 전용 값(예: `process.env.SECRET`)을 클라이언트 컴포넌트에서 접근
6. `error.tsx`에서 `'use client'` 제거
7. `await` 없이 `params` 접근

각 에러 메시지의 **첫 줄을 그대로 옮겨 적는다.** 나중에 같은 에러를 만났을 때 검색 없이 원인을 안다.

✅ **확인:** 7개 에러 메시지와 원인을 짝지을 수 있다.

---

- [ ] **S14 · 1단계 졸업 시험**

🔨 Claude Code에게 출제를 요청한다:

> 1단계에서 배운 범위(서버/클라이언트 컴포넌트, 'use client' 경계, 직렬화, 컴포지션)로 예측 문제를 5개 내줘. 컴포넌트 트리와 코드를 주고, 클라이언트 번들에 들어가는 부분을 묻는 형태로. **답은 알려주지 마.**

답을 스스로 작성한 뒤 채점을 요청한다. **3개 이상 틀리면 2주차를 다시 본다.**

✍️ **설명 산출물 #3** — 주제 추천: "React 개발자가 App Router에서 가장 먼저 버려야 할 습관"

🔨 **커밋:** `git add -A && git commit -m "week3: 1단계 완료 — RSC 멘탈 모델"`

---

# 2단계 · 서버 사이드 실행

**4주 · 20세션 · ~35h**

**졸업 기준:** 인증이 붙은 CRUD를 문서 최소 참조로 구현할 수 있다.

> **이 단계가 갭 1이다.** Node 백엔드 경험이 없으므로 4주차의 웹 표준 기초를 건너뛰지 않는다. 이걸 건너뛰면 Route Handlers가 끝까지 마법처럼 느껴진다.

**실습 앱:** 1단계 앱은 고장낸 코드가 쌓여 있으므로 그대로 두고 새로 만든다.

```bash
cd labs
npx create-next-app@latest 02-server --typescript --app --tailwind --eslint --no-src-dir
```

S15의 웹 표준 실습만 Next.js 없이 순수 Node로 하고, S17부터는 이 앱에서 진행한다.

## 4주차 — 웹 표준 기초와 데이터 페칭

- [ ] **S15 · 웹 표준 Request / Response (Next.js 밖에서)**

📖 [MDN: Request](https://developer.mozilla.org/ko/docs/Web/API/Request) · [MDN: Response](https://developer.mozilla.org/ko/docs/Web/API/Response)

🔮 **예측:** `Response.json()`은 왜 Promise를 반환하는가? 같은 Response의 `.json()`을 두 번 호출하면?

🔨 **실습:** Next.js 없이 순수 Node로 확인한다.

```js
// labs/02-server/web-standards.mjs
const res = new Response(JSON.stringify({ a: 1 }), {
  status: 200,
  headers: { 'content-type': 'application/json' },
})
console.log(res.status, res.headers.get('content-type'))
console.log(await res.json())
console.log(await res.json())   // 두 번째는?
```

```bash
node labs/02-server/web-standards.mjs
```

✅ **확인:** Request/Response가 Next.js 것이 아니라 **웹 표준**이라는 걸 안다. 이 인식이 Route Handlers의 절반이다.

---

- [ ] **S16 · HTTP 쿠키와 헤더**

📖 [MDN: HTTP 쿠키](https://developer.mozilla.org/ko/docs/Web/HTTP/Cookies)

🔮 **예측:** `Set-Cookie`의 `HttpOnly`, `Secure`, `SameSite`는 각각 무엇을 막는가? `HttpOnly` 쿠키를 JS로 읽을 수 있는가?

🔨 **실습:** 브라우저 개발자도구 → Application → Cookies에서 실제 사이트의 쿠키 속성을 관찰한다. `document.cookie`로 읽히는 것과 안 읽히는 것을 비교한다.

✅ **확인:** 세션 쿠키를 `HttpOnly`로 두는 이유를 설명할 수 있다. 2단계 인증 구현의 전제다.

---

- [ ] **S17 · 서버에서 데이터 가져오기**

📖 [Fetching Data](https://nextjs.org/docs/app/getting-started/fetching-data)

🔮 **예측:** 서버 컴포넌트에서 `await fetch(...)`를 하면 요청은 **어디서** 나가는가 — 브라우저인가 서버인가? CORS 제약을 받는가? API 키를 코드에 써도 되는가?

🔨 **실습:** 서버 컴포넌트에서 공개 API를 fetch해 렌더한다. 브라우저 Network 탭에 그 요청이 보이는지 확인한다.

```tsx
export default async function Page() {
  const res = await fetch('https://api.vercel.app/blog')
  const posts = await res.json()
  return <pre>{JSON.stringify(posts, null, 2)}</pre>
}
```

✅ **확인:** Network 탭에 fetch 요청이 **안 보이는** 이유를 설명할 수 있다.

---

- [ ] **S18 · Route Handlers**

📖 [Route Handlers](https://nextjs.org/docs/app/getting-started/route-handlers) · [route.js](https://nextjs.org/docs/app/api-reference/file-conventions/route)

🔮 **예측:** `app/api/hello/route.ts`에서 `export async function GET(request: Request)`을 만들면, 이 `request`는 S15에서 본 웹 표준 `Request`와 같은 것인가? 같은 폴더에 `page.tsx`와 `route.ts`를 동시에 둘 수 있는가?

🔨 **실습:** GET과 POST를 만들고 브라우저와 `curl`로 각각 호출한다.

```ts
// app/api/echo/route.ts
export async function POST(request: Request) {
  const body = await request.json()
  return Response.json({ received: body })
}
```

```bash
curl -X POST localhost:3000/api/echo -H 'content-type: application/json' -d '{"a":1}'
```

🔨 **고장내기:** 같은 폴더에 `page.tsx`와 `route.ts`를 함께 둔다. 무슨 일이 일어나는가?

✅ **확인:** Route Handler가 웹 표준 위에 얇게 올라간 것임을 안다.

---

- [ ] **S19 · 4주차 정리** — ✍️ 설명 산출물 #4 · 커밋

---

## 5주차 — Server Actions

- [ ] **S20 · Server Actions 기본**

📖 [Mutating Data](https://nextjs.org/docs/app/getting-started/mutating-data) · [use server](https://nextjs.org/docs/app/api-reference/directives/use-server)

🔮 **예측:** `'use server'`가 붙은 함수를 클라이언트 컴포넌트에서 호출하면 실제로 무슨 일이 일어나는가? 함수 본문이 브라우저로 전송되는가? `'use client'`와 `'use server'`는 대칭인가?

🔨 **실습:** Server Action을 만들어 폼에서 호출하고, **Network 탭에서 실제로 오가는 요청**을 관찰한다.

✅ **확인:** Server Action이 "자동 생성된 API 엔드포인트"임을 이해한다. `'use server'`가 `'use client'`의 반대가 **아니라는** 점을 설명할 수 있다.

---

- [ ] **S21 · 폼과 상태**

📖 [Forms](https://nextjs.org/docs/app/guides/forms) · [Server Actions](https://nextjs.org/docs/app/guides/server-actions)

🔮 **예측:** `useActionState`와 `useFormStatus`의 차이는? `useFormStatus`는 왜 폼 자체가 아니라 **자식 컴포넌트**에서 호출해야 하는가?

🔨 **실습:** 제출 중 버튼 비활성화 + 서버 검증 에러 표시가 되는 폼을 만든다. JS를 끈 상태에서도 폼이 동작하는지 확인한다.

✅ **확인:** 점진적 향상(progressive enhancement)이 왜 Server Actions의 설계 목표인지 안다.

---

- [ ] **S22 · 흐름 제어 함수**

📖 [redirect](https://nextjs.org/docs/app/api-reference/functions/redirect) · [notFound](https://nextjs.org/docs/app/api-reference/functions/not-found) · [unauthorized](https://nextjs.org/docs/app/api-reference/functions/unauthorized) · [forbidden](https://nextjs.org/docs/app/api-reference/functions/forbidden)

🔮 **예측:** `redirect()`는 값을 반환하는가 예외를 던지는가? `try/catch` 안에서 `redirect()`를 부르면 어떻게 되는가?

🔨 **고장내기:** `try { redirect('/') } catch (e) { console.log('잡힘', e) }` 를 실행한다. 결과를 보고 `unstable_rethrow`가 왜 존재하는지 문서에서 확인한다.

✅ **확인:** 이 함수들이 예외 기반이라는 걸 알고, try/catch와 함께 쓸 때의 함정을 안다.

---

- [ ] **S23 · Server Action 보안**

📖 [Data Security](https://nextjs.org/docs/app/guides/data-security)

🔮 **예측:** Server Action은 자동으로 인증되는가? 화면에 버튼을 렌더하지 않으면 그 Action은 호출될 수 없는가?

🔨 **고장내기 (중요):** 관리자만 보이는 버튼에 연결된 Server Action을 만들되, **Action 내부에는 권한 체크를 넣지 않는다.** 그다음 일반 사용자 세션에서 Network 탭의 Action 요청을 복사해 직접 재전송한다. 실행되는가?

✅ **확인:** **"모든 Server Action은 공개 엔드포인트다"**를 몸으로 안다. 이 감각이 실무에서 가장 값비싼 실수를 막는다.

---

- [ ] **S24 · 5주차 정리** — ✍️ 설명 산출물 #5 · 커밋

---

## 6주차 — 런타임 API와 proxy

- [ ] **S25 · cookies와 headers**

📖 [cookies](https://nextjs.org/docs/app/api-reference/functions/cookies) · [headers](https://nextjs.org/docs/app/api-reference/functions/headers)

🔮 **예측:** 서버 컴포넌트에서 `await cookies()`로 쿠키를 **쓸** 수 있는가? 없다면 어디서 써야 하는가?

🔨 **실습:** Server Action에서 쿠키를 설정하고 서버 컴포넌트에서 읽는 흐름을 만든다.

🔨 **고장내기:** 서버 컴포넌트(페이지)에서 `cookieStore.set(...)`을 시도한다. 에러 메시지를 기록한다.

✅ **확인:** 읽기와 쓰기가 가능한 위치가 다른 이유를 렌더링 흐름으로 설명할 수 있다.

---

- [ ] **S26 · proxy.ts**

📖 [Proxy](https://nextjs.org/docs/app/getting-started/proxy) · [proxy.js](https://nextjs.org/docs/app/api-reference/file-conventions/proxy)

🔮 **예측:** `proxy.ts`는 요청 처리 흐름의 어느 지점에서 실행되는가? DB 조회를 해도 되는가? 정적 파일 요청에도 실행되는가?

🔨 **실습:** 특정 경로를 보호하는 `proxy.ts`를 작성하고 `matcher`로 범위를 제한한다.

> **주의:** 검색 결과 대부분이 `middleware.ts`로 되어 있다. v16에서 `proxy.ts`로 이름이 바뀌었고 Node.js 런타임에서 실행된다. 로직은 동일하다.

✅ **확인:** proxy에서 하면 안 되는 일(무거운 조회, 인증의 유일한 방어선으로 삼기)을 안다.

---

- [ ] **S27 · 환경변수**

📖 [Environment Variables](https://nextjs.org/docs/app/guides/environment-variables)

🔮 **예측:** `NEXT_PUBLIC_` 접두사가 붙은 값과 안 붙은 값의 차이는 **런타임 동작**인가 **빌드 결과물**인가? 빌드 후 `.env`를 바꾸면 `NEXT_PUBLIC_` 값이 바뀌는가?

🔨 **고장내기:** `process.env.SECRET_KEY`를 클라이언트 컴포넌트에서 출력해본다. 무엇이 렌더되는가? 그다음 `next build` 후 `.next/static` 안에서 `NEXT_PUBLIC_` 값을 grep으로 찾아본다.

```bash
npm run build
grep -r "내가_넣은_PUBLIC_값" .next/static | head
```

✅ **확인:** `NEXT_PUBLIC_`이 "인라인 치환"임을 눈으로 확인했다. 비밀값을 절대 넣지 않는 이유가 몸에 남는다.

---

- [ ] **S28 · Draft Mode**

📖 [Draft Mode](https://nextjs.org/docs/app/guides/draft-mode) · [draftMode](https://nextjs.org/docs/app/api-reference/functions/draft-mode)

🔮 **예측:** Draft Mode를 켜면 캐시된 페이지는 어떻게 되는가?

🔨 **실습:** Draft Mode를 켜고 끄는 Route Handler를 만들고 동작을 확인한다.

✅ **확인:** 3단계 캐싱과 연결되는 지점을 인식한다.

---

- [ ] **S29 · 6주차 정리** — ✍️ 설명 산출물 #6 · 커밋

---

## 7주차 — 스트리밍, 에러, 졸업 시험

- [ ] **S30 · 스트리밍과 Suspense**

📖 [Streaming](https://nextjs.org/docs/app/guides/streaming) · [loading.js](https://nextjs.org/docs/app/api-reference/file-conventions/loading)

🔮 **예측:** 한 페이지에 3초 걸리는 컴포넌트와 즉시 렌더되는 컴포넌트가 있을 때, `Suspense`가 **없으면** 사용자는 언제 무엇을 보는가? 있으면 어떻게 달라지는가?

🔨 **실습:** 두 버전을 만들고 Network 탭의 응답 스트림을 관찰한다. HTML이 조각으로 도착하는 것을 확인한다.

✅ **확인:** 스트리밍이 "느린 부분이 빠른 부분을 막지 않게 하는 것"임을 설명할 수 있다. **이 감각이 3단계 전체의 토대다.**

---

- [ ] **S31 · 에러 경계 2종**

📖 [Error Handling](https://nextjs.org/docs/app/getting-started/error-handling) · [catchError](https://nextjs.org/docs/app/api-reference/functions/catchError)

🔮 **예측:** 서버 컴포넌트에서 던진 에러의 메시지가 프로덕션 빌드에서 브라우저에 그대로 보이는가?

🔨 **실습:** `next build && next start`로 확인한다. 개발 모드와 다른 것을 눈으로 본다. 라우트 단위(`error.tsx`)와 컴포넌트 단위(`catchError`)를 각각 적용해본다.

✅ **확인:** 에러 메시지가 프로덕션에서 감춰지는 이유와, 그럼에도 로그를 남기는 방법을 안다.

---

- [ ] **S32~S33 · 졸업 시험: 인증 CRUD (2세션)**

📖 [Authentication](https://nextjs.org/docs/app/guides/authentication)

🔨 **과제:** 아래 요구사항을 **문서를 최소한으로만 참조하며** 구현한다.

1. 쿠키 기반 로그인/로그아웃 (`HttpOnly` 세션 쿠키)
2. 글 목록 / 상세 / 작성 / 수정 / 삭제
3. 작성·수정·삭제는 로그인 사용자만 (**Server Action 내부에서 검증**)
4. `proxy.ts`로 `/admin` 경로 보호
5. 목록은 스트리밍, 로딩 UI 포함
6. 저장소는 메모리 배열이나 JSON 파일로 충분 (DB는 4단계에서)

**시작 전에 4문 예측 카드로 전체 설계를 먼저 적는다.** 코드보다 설계가 먼저다.

✅ **확인:** 막힐 때마다 문서를 찾았다면 어느 페이지였는지 기록한다. 그 페이지들이 아직 약한 영역이다.

---

- [ ] **S34 · 2단계 정리** — ✍️ 설명 산출물 #7 · 커밋 `"week7: 2단계 완료 — 서버 사이드 실행"`

---

# 3단계 · PPR과 명시적 캐싱

**3주 · 14세션 · ~25h**

**졸업 기준:** 임의의 페이지 코드를 보고 정적 셸 / 캐시 / 스트리밍 영역을 색칠할 수 있다.

> **이 단계 전체를 프로덕션 빌드로 실습한다.** dev 서버는 캐싱·프리렌더 동작이 다르므로, dev에서만 확인하면 잘못된 멘탈 모델이 굳는다.
>
> ```bash
> npm run build && npm start
> ```

**실습 앱:** 2단계 졸업 시험에서 만든 CRUD 앱을 복사해서 쓴다. 원본은 비교용으로 남겨둔다 — S47의 구모델 대조에서 다시 필요하다.

```bash
cd labs
cp -R 02-server 03-cache
cd 03-cache && rm -rf .next node_modules && npm install
```

## 8주차 — 프리렌더를 막는 것들

- [ ] **S35 · Cache Components 켜기**

📖 [Caching](https://nextjs.org/docs/app/getting-started/caching) · [cacheComponents](https://nextjs.org/docs/app/api-reference/config/next-config-js/cacheComponents)

```ts
// next.config.ts
import type { NextConfig } from 'next'
const nextConfig: NextConfig = { cacheComponents: true }
export default nextConfig
```

🔮 **예측:** S11에서 적어둔 답 — "params/cookies/headers가 왜 Promise가 됐을까"를 꺼내온다. 이제 답을 맞출 수 있는가?

🔨 **실습:** `labs/03-cache`에 위 플래그를 켜고 빌드한다. **어떤 경고가 뜨는가?** 전부 기록한다. 이 경고 목록이 8~9주차의 실제 학습 항목이 된다 — 내가 짠 코드에서 나온 것이라 남의 예제보다 훨씬 잘 붙는다.

✅ **확인:** PPR이 "static이냐 dynamic이냐" 이분법을 없앤 것임을 이해한다.

---

- [ ] **S36 · blocking-route insight**

📖 [Caching — Working with runtime APIs](https://nextjs.org/docs/app/getting-started/caching)

🔮 **예측:** `await cookies()`를 페이지 최상단에서 호출하면 그 페이지의 **어느 부분까지** 프리렌더가 불가능해지는가?

🔨 **고장내기:** `Suspense` 없이 `await cookies()`를 쓴다. dev 오버레이의 `blocking-route` insight를 띄운다. 그다음 문서가 제시하는 **세 가지 수정법을 전부** 적용해본다.

1. `<Suspense>`로 감싸기
2. `use cache: private`로 캐시하기
3. 라우트를 opt-out 하기

각각의 결과 차이를 기록한다.

✅ **확인:** 세 수정법이 각각 어떤 상황에 맞는지 구분할 수 있다.

---

- [ ] **S37 · 랜덤·시간·crypto**

📖 [Caching — Random values and timestamps](https://nextjs.org/docs/app/getting-started/caching) · [connection](https://nextjs.org/docs/app/api-reference/functions/connection)

🔮 **예측:** `Date.now()`가 프리렌더를 막는 이유는? 막지 않는다면 무슨 일이 일어나겠는가?

🔨 **고장내기:** `Math.random()`, `Date.now()`, `crypto.randomUUID()`를 각각 넣어 세 가지 insight를 모두 띄운다. 그다음 두 해법을 각각 적용한다 — `connection()` + `Suspense` (요청마다 다른 값) vs `use cache` (모두가 같은 값).

✅ **확인:** `connection()`이 "여기서부터는 요청 시점"이라는 선언임을 안다.

---

- [ ] **S38 · 자동으로 프리렌더되는 것들**

📖 [Caching — Predictable values](https://nextjs.org/docs/app/getting-started/caching)

🔮 **예측:** `fs.readFileSync`는 프리렌더를 막는가? `await readFile()`은? 둘의 차이는?

🔨 **실습:** 설정 파일을 ① 컴포넌트 안에서 `await readFile` ② 모듈 스코프에서 `await readFile` ③ `fs.readFileSync` 세 방식으로 읽고 빌드 결과를 비교한다.

✅ **확인:** "요청과 무관한 값"과 "요청에 의존하는 값"의 경계를 안다.

---

- [ ] **S39 · 8주차 정리** — ✍️ 설명 산출물 #8 · 커밋

---

## 9주차 — use cache

- [ ] **S40 · use cache 기본**

📖 [use cache](https://nextjs.org/docs/app/api-reference/directives/use-cache)

🔮 **예측:** 아래 두 코드의 캐시 키는 각각 무엇이 되는가?

```tsx
async function getUser(id: string) {
  'use cache'
  return db.users.find(id)
}

function makeGetter(tenant: string) {
  return async function get(id: string) {
    'use cache'
    return db.query(tenant, id)
  }
}
```

두 번째의 `tenant`는 캐시 키에 포함되는가?

🔨 **실습:** data-level과 UI-level 캐싱을 각각 적용하고, 인자를 바꿔가며 캐시 히트/미스를 로그로 관찰한다.

✅ **확인:** 캐시 키가 **인자 + 클로저로 잡힌 값**에서 자동 생성됨을 안다. 여기서 1단계의 직렬화 제약이 다시 나온다.

---

- [ ] **S41 · cacheLife와 cacheTag**

📖 [cacheLife](https://nextjs.org/docs/app/api-reference/functions/cacheLife) · [cacheTag](https://nextjs.org/docs/app/api-reference/functions/cacheTag)

🔮 **예측:** `stale` / `revalidate` / `expire` 세 값의 차이는? `stale` 기간에 요청이 오면 사용자는 무엇을 받는가?

🔨 **실습:** 짧은 `cacheLife`를 설정하고 시간 경과에 따른 응답 변화를 관찰한다. 세 구간을 실제로 통과시켜본다.

✅ **확인:** stale-while-revalidate 동작을 시간축 그림으로 그릴 수 있다. **React Query를 안 써봤다면 이 개념이 처음일 것이다 — 여기서 시간을 더 써도 좋다.**

---

- [ ] **S42 · 저장 위치 3종**

📖 [use cache: private](https://nextjs.org/docs/app/api-reference/directives/use-cache-private) · [use cache: remote](https://nextjs.org/docs/app/api-reference/directives/use-cache-remote)

🔮 **예측:** `use cache`로 캐시한 값이 서버리스 환경에서 다음 요청에도 남아 있는가? 사용자 A의 캐시를 사용자 B가 볼 수 있는가?

🔨 **실습:** 같은 데이터를 네 방식으로 두고 비교표를 만든다.

| 방식 | 새로고침 후 | 다른 브라우저에서 | 재배포 후 |
|---|---|---|---|
| 캐시 없음 | | | |
| `use cache` | | | |
| `use cache: private` | | | |
| `use cache: remote` | | | |

표를 직접 채운다. 이 표가 9주차의 산출물이다.

✅ **확인:** 사용자별 데이터에 `use cache`(공유)를 쓰면 안 되는 이유를 안다.

---

- [ ] **S43 · 무효화 3종**

📖 [Revalidating](https://nextjs.org/docs/app/getting-started/revalidating) · [How Revalidation Works](https://nextjs.org/docs/app/guides/how-revalidation-works) · [revalidateTag](https://nextjs.org/docs/app/api-reference/functions/revalidateTag) · [updateTag](https://nextjs.org/docs/app/api-reference/functions/updateTag) · [refresh](https://nextjs.org/docs/app/api-reference/functions/refresh)

🔮 **예측:** 글을 수정한 직후 목록으로 돌아갔을 때 **내 변경이 즉시 보이려면** 셋 중 무엇을 써야 하는가? 나머지 둘을 쓰면 무슨 일이 일어나는가?

🔨 **실습:** 수정 Action에서 세 API를 하나씩 바꿔가며 결과를 비교한다.

| API | 사용 위치 | 동작 |
|---|---|---|
| `revalidateTag(tag, 'max')` | 어디서나 | 태그 무효화 + SWR |
| `updateTag(tag)` | Server Action 전용 | read-your-writes |
| `refresh()` | Server Action 전용 | 캐시 미접촉, 미캐시 데이터만 갱신 |

> `revalidateTag`의 2번째 인자는 v16에서 필수화됐다. 인자 하나만 쓰는 코드는 구버전이다.

✅ **확인:** "수정했는데 화면이 안 바뀐다"를 만났을 때 셋 중 무엇이 필요한지 즉답할 수 있다.

---

- [ ] **S44 · 9주차 정리** — ✍️ 설명 산출물 #9 · 커밋

---

## 10주차 — 정적 셸 최대화와 구모델 대조

- [ ] **S45 · 정적 셸 최대화 (3단계의 결론)**

📖 [Caching — Maximizing the static shell](https://nextjs.org/docs/app/getting-started/caching) · [Instant navigation](https://nextjs.org/docs/app/guides/instant-navigation)

🔮 **예측:** 아래 두 layout 중 정적 셸이 더 큰 쪽은? 이유는?

```tsx
// A
export default async function Layout({ children, params }) {
  const { slug } = await params
  return <div><Sidebar /><h1>{slug}</h1>{children}</div>
}

// B
export default function Layout({ children, params }) {
  return (
    <div>
      <Sidebar />
      <Suspense fallback={<h1>Loading...</h1>}>
        {params.then(({ slug }) => <h1>{slug}</h1>)}
      </Suspense>
      {children}
    </div>
  )
}
```

🔨 **실습:** 둘 다 빌드해 정적 셸 크기와 초기 HTML을 비교한다.

✅ **확인:** **"`await`를 트리 아래로 내릴수록 정적 셸이 커진다"** — 이 한 문장이 Next.js 16 설계 감각의 핵심이다.

---

- [ ] **S46 · 프리페치와 Activity**

📖 [Prefetching](https://nextjs.org/docs/app/guides/prefetching) · [Adopting Partial Prefetching](https://nextjs.org/docs/app/guides/adopting-partial-prefetching) · [Preserving UI state](https://nextjs.org/docs/app/guides/preserving-ui-state)

🔮 **예측:** `cacheComponents`를 켜면 페이지를 떠났다 돌아왔을 때 스크롤 위치와 입력값이 유지되는가?

🔨 **고장내기:** 드롭다운이 열린 채로 다른 라우트에 갔다가 돌아온다. 어떻게 되는가? `<Activity>`로 인해 언마운트 전제로 짠 코드가 깨지는 지점을 찾는다.

✅ **확인:** 상태 보존이 기본이 되면서 생기는 새로운 버그 유형을 안다.

---

- [ ] **S47 · 구모델 대조 (실무 보험)**

📖 [Caching (Previous Model)](https://nextjs.org/docs/app/guides/caching-without-cache-components) · [ISR](https://nextjs.org/docs/app/guides/incremental-static-regeneration)

🔨 **실습:** `cacheComponents`를 **끄고** 같은 기능을 구모델로 다시 만든다.

- `fetch(url, { cache: 'force-cache' })` / `next: { revalidate, tags }`
- `unstable_cache` (non-fetch 함수용)
- Route segment config — `export const dynamic`, `export const revalidate`
- React `cache()` 로 렌더 패스 내 중복 제거

🔨 **산출물:** `notes/cache-model-map.md`를 완성한다. 표의 뼈대는 이미 만들어져 있고, **직접 구현해본 결과로** 빈칸을 채운다. 문서만 읽고 채우면 3개월 뒤에 기억나지 않는다.

세 표를 모두 채운다 — ① 신↔구 매핑(10행) ② 구모델에만 있는 것(6행) ③ 증상→원인 진단 순서. ③번이 실무에서 실제로 쓰는 표다.

3~4개월 뒤 구버전 프로젝트에 투입됐을 때 이것이 보험이다.

✅ **확인:** 구모델 코드를 봤을 때 신모델로 번역할 수 있다.

---

- [ ] **S48 · 3단계 졸업 시험**

🔨 Claude Code에게 요청한다:

> Cache Components가 켜진 Next.js 16 페이지 코드를 3개 만들어줘. 각각 정적 콘텐츠, `use cache` 캐시 콘텐츠, 런타임 스트리밍 콘텐츠가 섞여 있어야 해. **어느 부분이 무엇인지는 알려주지 마.**

각 코드에서 정적 셸 / 캐시 / 스트리밍 영역을 **색칠하고** 근거를 적은 뒤 채점을 요청한다.

✍️ **설명 산출물 #10** — 주제 추천: "Next.js 16에서 캐싱이 명시적으로 바뀐 이유"

🔨 **커밋:** `git commit -m "week10: 3단계 완료 — PPR과 명시적 캐싱"`

---

# 4단계 · 사이드 프로젝트

**5주 · 23세션 · ~40h**

**졸업 기준:** 프로젝트의 임의 파일을 열어 4문 카드를 즉답할 수 있다.

> **규칙:** 새 기능 착수 전 반드시 4문 예측 카드로 설계를 먼저 적는다. 이 규칙을 놓으면 "만들었지만 왜 되는지 모르는" 상태로 끝난다.
>
> **이 단계에서 Next.js DevTools MCP를 붙인다.** → [MCP 가이드](https://nextjs.org/docs/app/guides/mcp)

## 11주차 — 설계와 기반

- [ ] **S49 · 주제 확정** — 조건: 인증 + DB + 목록/상세 라우트 포함. 배운 것을 전부 쓰기 위한 최소 조건이다.
- [ ] **S50 · 4문 카드로 전체 라우트 설계** — 코드 이전에 각 라우트가 정적/캐시/스트리밍 중 무엇인지 먼저 정한다
- [ ] **S51 · 프로젝트 스캐폴딩** — `cacheComponents: true`로 시작
- [ ] **S52 · DB 연결** (SQLite/Postgres 등 자유)
- [ ] **S53 · 인증 구현** — 📖 [Authentication with Cache Components](https://nextjs.org/docs/app/guides/authentication-with-cache-components)
- [ ] **S54 · 11주차 정리** — ✍️ 설명 산출물 #11 · 커밋

## 12주차 — 핵심 기능

- [ ] **S55~S58 · 목록 / 상세 / 작성 / 수정·삭제** — 각 기능 착수 전 4문 카드 작성
- [ ] **S59 · 12주차 정리** — ✍️ 설명 산출물 #12 · 커밋

## 13주차 — 캐싱 전략과 성능

- [ ] **S60 · 캐시 경계 설계** — 어디에 `use cache`, 어디에 `private`, 어디에 `Suspense`
- [ ] **S61 · 무효화 전략** — `updateTag` vs `revalidateTag` 배치
- [ ] **S62 · 정적 셸 최대화 리팩터링** — S45에서 배운 패턴 적용
- [ ] **S63 · 번들 분석** — 무엇이 클라이언트로 넘어갔는지 실측. 📖 [Package Bundling](https://nextjs.org/docs/app/guides/package-bundling)
- [ ] **S64 · 13주차 정리** — ✍️ 설명 산출물 #13 · 커밋

## 14주차 — 최적화와 배포

- [ ] **S65 · 이미지** — 📖 [Image Optimization](https://nextjs.org/docs/app/getting-started/images) (v16에서 `qualities`, `minimumCacheTTL` 기본값이 바뀌었다)
- [ ] **S66 · 폰트** — 📖 [Font Optimization](https://nextjs.org/docs/app/getting-started/fonts)
- [ ] **S67 · 메타데이터와 OG** — 📖 [Metadata and OG images](https://nextjs.org/docs/app/getting-started/metadata-and-og-images)
- [ ] **S68 · 배포** — 📖 [Deploying](https://nextjs.org/docs/app/getting-started/deploying) · [Production Checklist](https://nextjs.org/docs/app/guides/production-checklist)
- [ ] **S69 · 14주차 정리** — ✍️ 설명 산출물 #14 · 커밋

## 15주차 — 마무리

- [ ] **S70 · 최종 졸업 시험**

🔨 프로젝트에서 **무작위로 5개 파일**을 골라 (Claude Code에게 고르게 한다) 각각 4문 카드를 **문서 참조 없이** 답한다. 그다음 Claude Code에게 채점을 요청한다.

- [ ] **S71 · 회고**

🔨 오답노트 전체를 다시 읽고 태그별로 집계한다. 가장 많이 틀린 태그가 실무 투입 후 가장 먼저 사고를 낼 영역이다. `notes/weakness.md`에 상위 3개를 적는다.

✍️ **설명 산출물 #15** — 주제: "Next.js를 15주 배우고 나서 처음과 달라진 생각"

🔨 **커밋:** `git commit -m "week15: 학습 과정 완료"`

---

## 진도가 밀릴 때

**우선순위는 이 순서다.** 시간이 부족하면 아래에서부터 잘라낸다.

1. **1단계 (절대 사수)** — 여기가 무너지면 나머지 전부가 모래 위에 선다
2. **3단계** — 실무에서 가장 비싼 버그가 나오는 영역
3. **2단계** — 갭이 크지만 실무에서 검색으로 메울 수 있는 부분이 많다
4. **4단계** — 규모를 줄여도 된다. **3단계를 건너뛰고 4단계를 하는 것보다, 4단계를 줄이고 3단계를 제대로 하는 쪽이 낫다**

3단계가 3주로 부족하면 4단계에서 1주를 빌려온다.

## 중단 후 복귀 방법

2주 이상 쉬었다면 이렇게 재개한다.

1. `notes/wrong-answers.md`를 처음부터 읽는다 (10분)
2. 마지막으로 완료한 세션의 ✅ 확인 항목을 스스로 답해본다
3. 답이 막히면 **그 세션부터 다시** 한다. 진도를 앞으로 밀지 않는다
