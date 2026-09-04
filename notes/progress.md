# 진행 상황

새 세션을 시작할 때 이 파일을 먼저 읽는다. 마지막 갱신: 2026-09-04

## 지금 어디까지 왔나

```
✅ 1단계  RSC 멘탈 모델          S1~S7 (졸업시험 → 재학습 2회 → 절차 3종 확립)
🔄 2단계  서버 사이드 실행        S15~S31 진행 중
⬜ 3단계  PPR · 명시적 캐싱
⬜ 4단계  사이드 프로젝트
```

### 2단계 세부

```
✅ S15·S16  웹 표준 Request/Response, HTTP 쿠키       labs/02-server/*.mjs
✅ S17      서버 컴포넌트 fetch — CORS·키 노출
✅ S18      Route Handlers
✅ S19      4주차 정리 + 설명 산출물 #1
✅ S20~S23  Server Actions (기본·폼·흐름제어·보안)
✅ S24      5주차 정리 + 설명 산출물 #2
✅ S25~S28  런타임 API (cookies·proxy·env·draftMode)
✅ S29      6주차 정리 + 설명 산출물 #3
✅ S30      스트리밍과 Suspense
🔄 S31      에러 경계 2종 — catchError          ← 여기서 멈춤
⬜ S32~33   졸업 시험 · 인증 CRUD
⬜ S34      7주차 정리 + 설명 산출물 #4
```

## ⚠️ S31 미완 — 다음 세션에서 이것부터

**브라우저 확인 하나가 남았다.** `catchError` 로 감싼 위젯만 격리되는지.

```
cd labs/02-server-app && PORT=3100 npm start

localhost:3100/stream/error-in-suspense   격리 없음 (error.tsx 만)
localhost:3100/stream/isolated            catchError 로 격리
```

**볼 것:** 2초 뒤 `✅ 정상 — 2초` 가 보이는가

```
error-in-suspense   안 보인다  →  페이지 전체가 대체됨 (S30 에서 확인 완료)
isolated            보이면     →  터진 위젯만 대체됨 = S30 숙제 해결
```

서버 HTML 로는 확인 불가 — 에러 UI 는 클라이언트가 그린다.

## 학습 방식 (CLAUDE.md 규칙과 함께 볼 것)

- **예측 → 실행 → 대조 → 오답노트 → 커밋** 순서. 예측 없이 문서부터 읽지 않는다
- 세션 끝에 **웜업 퀴즈 5문제** 출제. 답은 다음 세션 시작 때 확인
- **오답노트는 조수가 초안을 쓰고 `[전제]` 한 줄만 사용자가 채운다**
  (9일간 기록이 멈춰 웜업 정답률이 무너진 뒤 CLAUDE.md 규칙 6으로 명문화)
- 웜업 문제는 오답노트에서 뽑는다 — 도입 후 정답률이 4/5 오답 → 5/5 정답으로 회복

## 반복되는 패턴 (계속 관찰 중)

**① 자기 답끼리 모순 — 6회**

```
S4 / 1단계 졸업시험 / S18 / S20 / S27 / S30
```

원인은 14일차 전제에 본인이 적었다 — *"Q2 를 먼저 쓰고 시간이 지나 Q3 을 쓰면서
기억났는데 앞 답을 고치지 않았다."* **모르는 게 아니라 제출 전에 훑어보지 않는 것.**

**② dev 에서 되던 게 build 에서 막힘 — 2회**

```
S27  <form action={액션}> 타입 에러
S31  프리렌더 중 에러 → 빌드 중단
```

## 자산

```
notes/decision-procedures.md   판정 절차 3종 ★ 헷갈리면 여기부터
notes/unlearning.md            CSR 습관 8항목
notes/wrong-answers.md         오답 23건 (#서버실행 16 / #관찰방법 3 / #rsc경계 3 …)
notes/weekly/                  설명 산출물 3편
labs/01-rsc/BROKEN.md          고장내기 3건
labs/02-server-app/BROKEN.md   고장내기 11건
reference/                     공식문서 번역 6편
```

## 실습 앱

```
labs/01-rsc/          1단계. 고장낸 코드가 남아 있다 (지우지 말 것)
labs/02-server/       .mjs — Next.js 없이 웹 표준만
labs/02-server-app/   2단계 본체. proxy.ts 있음, .env.local 필요
```

**dev 서버는 사용자가 별도 터미널에서 띄운다** (백그라운드로 띄우면 턴 경계에서 죽는다).

## 유용했던 기법

- **Server Action 을 curl 로 직접 호출** — `.next/dev/server/server-reference-manifest.json`
  에서 액션 ID 를 찾아 `Next-Action` 헤더로 POST. S23 보안 실험의 핵심 도구였다
- **스트리밍 도착 시각 측정** — python 으로 바이트 단위로 읽으며 마커 등장 시각 기록.
  `Suspense` 유무를 0.04s vs 3.04s 로 대비시켰다
- **빌드 산출물 grep** — `.next/static` 에서 env 값을 찾아 인라인 치환을 확인
