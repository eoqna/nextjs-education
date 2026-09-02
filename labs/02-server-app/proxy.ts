import { NextRequest, NextResponse } from 'next/server'

// matcher 로 /security 경로만 보호한다 — 아주 흔한 패턴
export const config = {
  matcher: ['/security/:path*'],
}

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const isAction = request.headers.has('next-action')
  const role = request.cookies.get('role')?.value ?? 'guest'

  console.log(
    `🚧 proxy — ${request.method} ${pathname} role=${role}${isAction ? ' [Action]' : ''}`
  )

  if (role !== 'admin') {
    console.log('🚧 proxy 차단!')
    return NextResponse.json({ error: 'proxy 가 막았다' }, { status: 403 })
  }

  return NextResponse.next()
}
