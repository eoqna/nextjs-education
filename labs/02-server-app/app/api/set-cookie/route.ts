import { cookies } from 'next/headers'

export async function GET(request: Request) {
  const theme = new URL(request.url).searchParams.get('theme') ?? 'dark'
  const c = await cookies()
  c.set('theme', theme, { path: '/' })
  console.log('🔵 Route Handler 에서 쿠키 설정:', theme)
  return Response.json({ ok: true, theme, from: 'route handler' })
}
