// S15 에서 찾은 해법(clone)이 Route Handler 에서도 통하는지 확인한다.

export async function POST(request: Request) {
  // 읽기 전에 복제해둔다
  const forLogging = request.clone()

  const logged = await forLogging.json()
  console.log('🔵 검증용으로 먼저 읽음:', logged, '/ 원본 bodyUsed:', request.bodyUsed)

  const body = await request.json()
  console.log('🔵 핸들러가 읽음:', body)

  return Response.json({ logged, body, ok: true })
}
