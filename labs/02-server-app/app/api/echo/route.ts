// Route Handler. 여기 나오는 Request / Response 는
// labs/02-server 의 .mjs 실습에서 만졌던 것과 같은 웹 표준이다.

export async function GET(request: Request) {
  console.log('🟢 GET  — request 는', request.constructor.name)

  const url = new URL(request.url)

  return Response.json({
    method: request.method,
    // req.query 는 없다. URL 로 파싱한다 (S15에서 확인)
    searchParams: Object.fromEntries(url.searchParams),
    pathname: url.pathname,
    headers: Object.fromEntries(request.headers),
  })
}

export async function POST(request: Request) {
  console.log('🟠 POST — bodyUsed(읽기 전):', request.bodyUsed)

  const first = await request.json()
  console.log('🟠 POST — bodyUsed(읽은 후):', request.bodyUsed)

  // 같은 body 를 두 번 읽으면? S15 의 제약이 여기도 적용되는지 확인한다.
  let second: unknown
  try {
    second = await request.json()
  } catch (e) {
    second = `❌ ${(e as Error).constructor.name} — ${(e as Error).message}`
  }

  return Response.json({ first, second })
}
