# 경계 배치 3종 — 예측표

작성: 2026-09-08 · 실행 전에 채웠다. 실행 후 `실제` 칸을 채운다.

같은 규칙에서 5회 연속 오답이 났다(오답노트 16·18·19·20일차).
설명을 여섯 번째 반복하는 대신 눈으로 확인하려고 만든 실습이다.

## ① Boom 이 안쪽 경계 안 (`/stream/nested/inside`)

```tsx
<Boundary name="바깥">
  <h1>MARKER_제목</h1>
  <Boundary name="안쪽">
    <Suspense><Boom /></Suspense>        {/* 1초 뒤 throw */}
  </Boundary>
  <Suspense><Slow sec={2} name="정상" /></Suspense>
</Boundary>
```

| 1초 뒤 | 예측 | 실제 |
|---|---|---|
| 제목 | 보인다 | |
| 안쪽 Fallback | 안 보인다 | |
| 바깥 Fallback | 보인다 | |
| 정상 위젯(2초) | 안 보인다 | |

> 예측 안에서 충돌이 있다 — 바깥이 발동했다면서 바깥이 감싼 제목은 살아남는다고 했다.
> 이게 참이려면 Fallback 이 "터진 자리에만" 나타나야 한다. 그것이 이 실습의 쟁점이다.

## ② Boom 이 안쪽 경계 밖 (`/stream/nested/outside`)

①과 부품도 개수도 같다. Boom 과 안쪽 경계의 위치만 바뀌었다.

```tsx
<Boundary name="바깥">
  <h1>MARKER_제목</h1>
  <Boundary name="안쪽">
    <Suspense><Slow sec={2} name="정상" /></Suspense>
  </Boundary>
  <Suspense><Boom /></Suspense>          {/* 1초 뒤 throw */}
</Boundary>
```

| 1초 뒤 | 예측 | 실제 |
|---|---|---|
| 제목 | 안 보인다 | |
| 안쪽 Fallback | 안 보인다 | |
| 바깥 Fallback | 보인다 | |
| 정상 위젯(2초) | 안 보인다 | |

## ③ catchError 경계 없음 (`/stream/nested/no-boundary`)

`Suspense` 만 남는다. 위에 있는 에러 경계는 `app/stream/error.tsx` 하나뿐이다.

| 1초 뒤 | 예측 | 실제 |
|---|---|---|
| 제목 | 안 보인다 | |
| error.tsx (🅰️ 빨간 테두리) | 보인다 | |
| 정상 위젯(2초) | 안 보인다 | |

## 확인 후 채울 것

- ①②③ 중 어긋난 칸
- 세 배치를 한 줄로 설명하는 규칙
