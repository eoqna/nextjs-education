# 공식 문서 한글 번역본

학습 중 참조한 Next.js 공식 문서의 한글 번역을 모아둔다.

## 원문 위치

번역의 출처는 **웹이 아니라 로컬 사본**이다. 설치된 버전과 정확히 일치하므로 버전 불일치가 원천적으로 없다.

```
labs/01-rsc/node_modules/next/dist/docs/01-app/
├── 01-getting-started/   18개
├── 02-guides/            70여개
└── 03-api-reference/     디렉티브 · 함수 · 파일 규약
```

## 번역 규칙

- **코드 블록은 원문 그대로 둔다.** 주석도 번역하지 않는다 — 번역본과 원문을 대조할 수 있어야 하고, 실제로 타이핑할 코드는 영문이다.
- **API 이름, 파일명, 디렉티브는 원문 유지.** `use cache`, `layout.tsx`, `generateStaticParams` 등.
- **Pages Router 전용 내용은 제외한다.** 이 학습은 App Router만 다룬다. 제외한 경우 문서 상단에 표시한다.
- **문서 내 링크는 웹 주소로 변환한다.** 로컬 경로는 클릭할 수 없기 때문이다.
- 각 문서 상단에 원문 경로 · 버전 · 웹 주소를 명시한다.

## 목록

### Getting Started

| 문서 | 원문 | 관련 세션 |
|---|---|---|
| [폰트 최적화](getting-started/13-fonts.md) | `13-fonts.md` | S1 Q2 |
| [링크와 네비게이션](getting-started/04-linking-and-navigating.md) | `04-linking-and-navigating.md` | S1 Q3 · S3 |
| [프로젝트 구조](getting-started/02-project-structure.md) | `02-project-structure.md` | S1 Q4 · S3 |
| [레이아웃과 페이지](getting-started/03-layouts-and-pages.md) | `03-layouts-and-pages.md` | S1 Q3 · S2 |
| [서버 컴포넌트와 클라이언트 컴포넌트](getting-started/05-server-and-client-components.md) | `05-server-and-client-components.md` | S1 Q1 · S6~S9 |

### API Reference

| 문서 | 원문 | 관련 세션 |
|---|---|---|
| [useLinkStatus](api-reference/functions/use-link-status.md) | `04-functions/use-link-status.md` | S3 |

### 미번역 (참조했으나 아직 번역 안 함)

| 문서 | 원문 | 관련 세션 |
|---|---|---|
| template.js | `03-file-conventions/template.md` | S2 |

## 원문 검색

번역본에 없는 내용은 원문에서 직접 찾는다.

```bash
cd labs/01-rsc/node_modules/next/dist/docs/01-app

# 키워드가 나오는 문서 찾기
grep -rl "use cache" .

# 문맥과 함께 보기
grep -rn "revalidateTag" 03-api-reference/ | head
```
