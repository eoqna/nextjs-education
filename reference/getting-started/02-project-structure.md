# 프로젝트 구조와 구성

> **원문:** `node_modules/next/dist/docs/01-app/01-getting-started/02-project-structure.md`
> **버전:** Next.js 16.3.1
> **웹:** https://nextjs.org/docs/app/getting-started/project-structure
> **비고:** Pages Router 전용 내용(`<PagesOnly>`)과 다이어그램 이미지는 제외했다.

이 문서는 Next.js의 **모든** 폴더·파일 규약과 프로젝트 구성 권장안을 개괄한다.

## 폴더와 파일 규약

### 최상위 폴더

최상위 폴더는 애플리케이션 코드와 정적 자산을 정리하는 데 쓰인다.

| 폴더 | 역할 |
| --- | --- |
| [`app`](https://nextjs.org/docs/app) | App Router |
| [`pages`](https://nextjs.org/docs/pages/building-your-application/routing) | Pages Router |
| [`public`](https://nextjs.org/docs/app/api-reference/file-conventions/public-folder) | 서빙될 정적 자산 |
| [`src`](https://nextjs.org/docs/app/api-reference/file-conventions/src-folder) | 선택적인 애플리케이션 소스 폴더 |

### 최상위 파일

최상위 파일은 애플리케이션 설정, 의존성 관리, proxy 실행, 모니터링 도구 연동, 환경변수 정의에 쓰인다.

| 파일 | 역할 |
| --- | --- |
| **Next.js** | |
| [`next.config.js`](https://nextjs.org/docs/app/api-reference/config/next-config-js) | Next.js 설정 파일 |
| [`package.json`](https://nextjs.org/docs/app/getting-started/installation#manual-installation) | 프로젝트 의존성과 스크립트 |
| [`instrumentation.ts`](https://nextjs.org/docs/app/guides/instrumentation) | OpenTelemetry 및 계측 파일 |
| [`proxy.ts`](https://nextjs.org/docs/app/api-reference/file-conventions/proxy) | Next.js 요청 proxy |
| [`.env`](https://nextjs.org/docs/app/guides/environment-variables) | 환경변수 (버전 관리에 포함하지 말 것) |
| [`.env.local`](https://nextjs.org/docs/app/guides/environment-variables) | 로컬 환경변수 (버전 관리에 포함하지 말 것) |
| [`.env.production`](https://nextjs.org/docs/app/guides/environment-variables) | 프로덕션 환경변수 (버전 관리에 포함하지 말 것) |
| [`.env.development`](https://nextjs.org/docs/app/guides/environment-variables) | 개발 환경변수 (버전 관리에 포함하지 말 것) |
| [`eslint.config.mjs`](https://nextjs.org/docs/app/api-reference/config/eslint) | ESLint 설정 파일 |
| `.gitignore` | Git이 무시할 파일과 폴더 |
| [`next-env.d.ts`](https://nextjs.org/docs/app/api-reference/config/typescript#next-envdts) | Next.js용 TypeScript 선언 파일 (버전 관리에 포함하지 말 것) |
| `tsconfig.json` | TypeScript 설정 파일 |
| `jsconfig.json` | JavaScript 설정 파일 |

### 라우팅 파일

라우트를 노출하려면 `page`를, 헤더·내비게이션·푸터 같은 공유 UI에는 `layout`을, 스켈레톤에는 `loading`을, 에러 경계에는 `error`를, API에는 `route`를 추가한다.

| 파일 | 확장자 | 역할 |
| --- | --- | --- |
| [`layout`](https://nextjs.org/docs/app/api-reference/file-conventions/layout) | `.js` `.jsx` `.tsx` | 레이아웃 |
| [`page`](https://nextjs.org/docs/app/api-reference/file-conventions/page) | `.js` `.jsx` `.tsx` | 페이지 |
| [`loading`](https://nextjs.org/docs/app/api-reference/file-conventions/loading) | `.js` `.jsx` `.tsx` | 로딩 UI |
| [`not-found`](https://nextjs.org/docs/app/api-reference/file-conventions/not-found) | `.js` `.jsx` `.tsx` | Not found UI |
| [`error`](https://nextjs.org/docs/app/api-reference/file-conventions/error) | `.js` `.jsx` `.tsx` | 에러 UI |
| [`global-error`](https://nextjs.org/docs/app/api-reference/file-conventions/error#global-error) | `.js` `.jsx` `.tsx` | 전역 에러 UI |
| [`route`](https://nextjs.org/docs/app/api-reference/file-conventions/route) | `.js` `.ts` | API 엔드포인트 |
| [`template`](https://nextjs.org/docs/app/api-reference/file-conventions/template) | `.js` `.jsx` `.tsx` | 매번 다시 렌더링되는 레이아웃 |
| [`default`](https://nextjs.org/docs/app/api-reference/file-conventions/default) | `.js` `.jsx` `.tsx` | 병렬 라우트 폴백 페이지 |

### 중첩 라우트

폴더가 URL 세그먼트를 정의한다. 폴더를 중첩하면 세그먼트가 중첩된다. 어느 레벨의 레이아웃이든 자신의 하위 세그먼트를 감싼다. **라우트는 `page` 또는 `route` 파일이 있을 때 비로소 공개된다.**

| 경로 | URL 패턴 | 비고 |
| --- | --- | --- |
| `app/layout.tsx` | — | 루트 레이아웃이 모든 라우트를 감쌈 |
| `app/blog/layout.tsx` | — | `/blog`와 그 하위를 감쌈 |
| `app/page.tsx` | `/` | 공개 라우트 |
| `app/blog/page.tsx` | `/blog` | 공개 라우트 |
| `app/blog/authors/page.tsx` | `/blog/authors` | 공개 라우트 |

### 동적 라우트

대괄호로 세그먼트를 파라미터화한다. 단일 파라미터는 `[segment]`, catch-all은 `[...segment]`, 선택적 catch-all은 `[[...segment]]`를 쓴다. 값은 [`params`](https://nextjs.org/docs/app/api-reference/file-conventions/page#params-optional) prop으로 접근한다.

| 경로 | URL 패턴 |
| --- | --- |
| `app/blog/[slug]/page.tsx` | `/blog/my-first-post` |
| `app/shop/[...slug]/page.tsx` | `/shop/clothing`, `/shop/clothing/shirts` |
| `app/docs/[[...slug]]/page.tsx` | `/docs`, `/docs/layouts-and-pages`, `/docs/api-reference/use-router` |

### 라우트 그룹과 비공개 폴더

[`(group)`](https://nextjs.org/docs/app/api-reference/file-conventions/route-groups#convention) 라우트 그룹으로 URL을 바꾸지 않고 코드를 정리하고, [`_folder`](#비공개-폴더) 비공개 폴더로 라우팅되지 않는 파일을 함께 배치한다.

| 경로 | URL 패턴 | 비고 |
| --- | --- | --- |
| `app/(marketing)/page.tsx` | `/` | 그룹은 URL에서 생략됨 |
| `app/(shop)/cart/page.tsx` | `/cart` | `(shop)` 내부에서 레이아웃 공유 |
| `app/blog/_components/Post.tsx` | — | 라우팅되지 않음. UI 유틸을 두기 안전한 곳 |
| `app/blog/_lib/data.ts` | — | 라우팅되지 않음. 유틸을 두기 안전한 곳 |

### 병렬 라우트와 인터셉트 라우트

슬롯 기반 레이아웃이나 모달 라우팅 같은 특정 UI 패턴에 쓰인다.

부모 레이아웃이 렌더링하는 이름 있는 슬롯에는 `@slot`을 쓴다. URL을 바꾸지 않고 현재 레이아웃 안에서 다른 라우트를 렌더링하려면 인터셉트 패턴을 쓴다. 예를 들어 목록 위에 상세 뷰를 모달로 띄우는 경우다.

| 패턴 | 의미 | 대표 용도 |
| --- | --- | --- |
| [`@folder`](https://nextjs.org/docs/app/api-reference/file-conventions/parallel-routes#slots) | 이름 있는 슬롯 | 사이드바 + 메인 콘텐츠 |
| [`(.)folder`](https://nextjs.org/docs/app/api-reference/file-conventions/intercepting-routes#convention) | 같은 레벨 인터셉트 | 형제 라우트를 모달로 미리보기 |
| [`(..)folder`](https://nextjs.org/docs/app/api-reference/file-conventions/intercepting-routes#convention) | 부모 인터셉트 | 부모의 자식을 오버레이로 열기 |
| [`(..)(..)folder`](https://nextjs.org/docs/app/api-reference/file-conventions/intercepting-routes#convention) | 두 레벨 위 인터셉트 | 깊게 중첩된 오버레이 |
| [`(...)folder`](https://nextjs.org/docs/app/api-reference/file-conventions/intercepting-routes#convention) | 루트에서 인터셉트 | 임의의 라우트를 현재 뷰에 표시 |

### 메타데이터 파일 규약

#### 앱 아이콘

| 파일 | 확장자 | 역할 |
| --- | --- | --- |
| [`favicon`](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/app-icons#favicon) | `.ico` | Favicon 파일 |
| [`icon`](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/app-icons#icon) | `.ico` `.jpg` `.jpeg` `.png` `.svg` | 앱 아이콘 파일 |
| [`icon`](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/app-icons#generate-icons-using-code-js-ts-tsx) | `.js` `.ts` `.tsx` | 코드로 생성한 앱 아이콘 |
| [`apple-icon`](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/app-icons#apple-icon) | `.jpg` `.jpeg` `.png` | Apple 앱 아이콘 파일 |
| [`apple-icon`](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/app-icons#generate-icons-using-code-js-ts-tsx) | `.js` `.ts` `.tsx` | 코드로 생성한 Apple 앱 아이콘 |

#### Open Graph 및 Twitter 이미지

| 파일 | 확장자 | 역할 |
| --- | --- | --- |
| [`opengraph-image`](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/opengraph-image#opengraph-image) | `.jpg` `.jpeg` `.png` `.gif` | Open Graph 이미지 파일 |
| [`opengraph-image`](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/opengraph-image#generate-images-using-code-js-ts-tsx) | `.js` `.ts` `.tsx` | 코드로 생성한 Open Graph 이미지 |
| [`twitter-image`](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/opengraph-image#twitter-image) | `.jpg` `.jpeg` `.png` `.gif` | Twitter 이미지 파일 |
| [`twitter-image`](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/opengraph-image#generate-images-using-code-js-ts-tsx) | `.js` `.ts` `.tsx` | 코드로 생성한 Twitter 이미지 |

#### SEO

| 파일 | 확장자 | 역할 |
| --- | --- | --- |
| [`sitemap`](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap#sitemap-files-xml) | `.xml` | 사이트맵 파일 |
| [`sitemap`](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap#generating-a-sitemap-using-code-js-ts) | `.js` `.ts` | 코드로 생성한 사이트맵 |
| [`robots`](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots#static-robotstxt) | `.txt` | Robots 파일 |
| [`robots`](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots#generate-a-robots-file) | `.js` `.ts` | 코드로 생성한 Robots 파일 |

## 프로젝트 구성하기

Next.js는 프로젝트 파일을 어떻게 정리하고 어디에 둘지에 대해 **특정 방식을 강요하지 않는다.** 다만 정리를 돕는 몇 가지 기능을 제공한다.

### 컴포넌트 계층

특수 파일에 정의된 컴포넌트들은 정해진 계층으로 렌더링된다.

- `layout.js`
- `template.js`
- `error.js` (React 에러 경계)
- `loading.js` (React Suspense 경계)
- `not-found.js` ("not found" UI를 위한 React 에러 경계)
- `page.js` 또는 중첩된 `layout.js`

중첩 라우트에서 이 컴포넌트들은 재귀적으로 렌더링된다. 즉 어떤 라우트 세그먼트의 컴포넌트들은 그 부모 세그먼트의 컴포넌트들 **안에** 중첩된다.

### 코로케이션 (같은 위치에 두기)

`app` 디렉토리에서 중첩된 폴더는 라우트 구조를 정의한다. 각 폴더는 URL 경로의 대응하는 세그먼트에 매핑되는 라우트 세그먼트를 나타낸다.

그러나 라우트 구조가 폴더로 정의되더라도, 라우트 세그먼트에 `page.js`나 `route.js` 파일이 추가되기 전까지 그 라우트는 **공개적으로 접근할 수 없다.**

그리고 라우트가 공개되더라도 클라이언트로 전송되는 것은 `page.js` 또는 `route.js`가 **반환한 콘텐츠**뿐이다.

즉 **프로젝트 파일들을** `app` 디렉토리의 라우트 세그먼트 안에 **안전하게 함께 둘 수 있으며**, 실수로 라우팅되는 일은 없다.

> **알아두면 좋은 것:** `app` 안에 프로젝트 파일을 함께 둘 **수 있지만** 반드시 그래야 하는 것은 **아니다.** 원한다면 [`app` 디렉토리 밖에 둘 수도 있다](#app-밖에-프로젝트-파일-두기).

### 비공개 폴더

폴더 이름 앞에 밑줄을 붙여 비공개 폴더를 만들 수 있다: `_folderName`

이는 해당 폴더가 비공개 구현 세부사항이며 라우팅 시스템이 고려하지 않아야 함을 뜻한다. 따라서 **그 폴더와 모든 하위 폴더가** 라우팅에서 제외된다.

`app` 디렉토리의 파일들은 [기본적으로 안전하게 함께 둘 수 있으므로](#코로케이션-같은-위치에-두기) 코로케이션 자체에 비공개 폴더가 필수는 아니다. 다만 다음 상황에 유용하다.

- UI 로직과 라우팅 로직을 분리할 때
- 프로젝트와 Next.js 생태계 전반에서 내부 파일을 일관되게 정리할 때
- 코드 에디터에서 파일을 정렬하고 묶을 때
- 향후 Next.js 파일 규약과 이름이 충돌할 가능성을 피할 때

> **알아두면 좋은 것:**
>
> - 프레임워크 규약은 아니지만, 비공개 폴더 밖의 파일에도 같은 밑줄 패턴으로 "비공개" 표시를 할 수 있다.
> - 폴더 이름 앞에 `%5F`(밑줄의 URL 인코딩 형태)를 붙이면 밑줄로 시작하는 URL 세그먼트를 만들 수 있다: `%5FfolderName`.
> - 비공개 폴더를 쓰지 않는다면, 예기치 않은 이름 충돌을 막기 위해 Next.js의 [특수 파일 규약](#라우팅-파일)을 알아두는 것이 좋다.

### 라우트 그룹

폴더를 괄호로 감싸 라우트 그룹을 만들 수 있다: `(folderName)`

이는 해당 폴더가 구성 목적이며 라우트의 URL 경로에 **포함되지 않아야** 함을 뜻한다.

라우트 그룹은 다음에 유용하다.

- 사이트 섹션, 목적, 팀별로 라우트를 정리할 때. 예: 마케팅 페이지, 관리자 페이지 등
- 같은 라우트 세그먼트 레벨에서 중첩 레이아웃을 가능하게 할 때
  - [같은 세그먼트에 여러 중첩 레이아웃(여러 루트 레이아웃 포함) 만들기](#여러-루트-레이아웃-만들기)
  - [공통 세그먼트의 일부 라우트에만 레이아웃 적용하기](#특정-세그먼트만-레이아웃에-포함시키기)

### `src` 폴더

Next.js는 애플리케이션 코드(`app` 포함)를 선택적인 [`src` 폴더](https://nextjs.org/docs/app/api-reference/file-conventions/src-folder) 안에 두는 것을 지원한다. 대부분 프로젝트 루트에 위치하는 설정 파일들과 애플리케이션 코드를 분리해준다.

## 예시

아래는 흔한 전략들을 아주 개략적으로 나열한 것이다. 가장 단순한 결론은 **팀과 나에게 맞는 전략을 골라 프로젝트 전반에서 일관되게 지키라**는 것이다.

> **알아두면 좋은 것:** 아래 예시에서 `components`와 `lib` 폴더는 일반화된 예시일 뿐이며, 이름에 프레임워크상의 특별한 의미는 없다. 프로젝트에 따라 `ui`, `utils`, `hooks`, `styles` 등 다른 폴더를 쓸 수 있다.

### `app` 밖에 프로젝트 파일 두기

모든 애플리케이션 코드를 **프로젝트 루트**의 공유 폴더에 두고, `app` 디렉토리는 순수하게 라우팅 목적으로만 사용하는 전략이다.

### `app` 안의 최상위 폴더에 프로젝트 파일 두기

모든 애플리케이션 코드를 **`app` 디렉토리 루트**의 공유 폴더에 두는 전략이다.

### 기능 또는 라우트별로 프로젝트 파일 나누기

전역적으로 공유되는 코드는 `app` 루트에 두고, 더 특정한 코드는 그것을 사용하는 라우트 세그먼트로 **나누어** 두는 전략이다.

### URL 경로에 영향을 주지 않고 라우트 정리하기

URL에 영향을 주지 않고 라우트를 정리하려면 관련 라우트를 묶는 그룹을 만든다. 괄호로 감싼 폴더는 URL에서 생략된다 (예: `(marketing)`, `(shop)`).

`(marketing)`과 `(shop)` 내부의 라우트가 같은 URL 계층을 공유하더라도, 각 폴더 안에 `layout.js` 파일을 추가하여 그룹마다 다른 레이아웃을 만들 수 있다. 이 레이아웃들은 기존 앱 레이아웃 안에 중첩된다.

### 특정 세그먼트만 레이아웃에 포함시키기

특정 라우트만 레이아웃에 포함시키려면 새 라우트 그룹(예: `(shop)`)을 만들고 같은 레이아웃을 공유할 라우트들(예: `account`, `cart`)을 그 그룹으로 옮긴다. 그룹 밖의 라우트(예: `checkout`)는 그 레이아웃을 공유하지 않는다.

### 특정 라우트에만 로딩 스켈레톤 적용하기

[로딩 스켈레톤](https://nextjs.org/docs/app/api-reference/file-conventions/loading)을 `loading.js` 파일로 특정 라우트에만 적용하려면, 새 라우트 그룹(예: `/(overview)`)을 만들고 `loading.tsx`를 그 안으로 옮긴다.

이렇게 하면 `loading.tsx`가 대시보드의 모든 페이지가 아니라 대시보드 → overview 페이지에만 적용되며, URL 경로 구조에는 영향을 주지 않는다.

### 여러 루트 레이아웃 만들기

여러 개의 [루트 레이아웃](https://nextjs.org/docs/app/api-reference/file-conventions/layout#root-layout)을 만들려면 최상위 `layout.js` 파일을 제거하고 각 라우트 그룹 안에 `layout.js` 파일을 추가한다. 완전히 다른 UI나 경험을 가진 섹션으로 애플리케이션을 분할할 때 유용하다. `<html>`과 `<body>` 태그를 각 루트 레이아웃마다 넣어야 한다.

위 예시에서 `(marketing)`과 `(shop)`은 각각 자기만의 루트 레이아웃을 갖는다.
