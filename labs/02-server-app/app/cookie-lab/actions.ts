'use server'

import { cookies } from 'next/headers'

export async function setThemeAction(theme: string) {
  const c = await cookies()
  c.set('theme', theme, { path: '/' })
  console.log('🟢 Server Action 에서 쿠키 설정:', theme)
  return { ok: true, theme }
}

export async function clearThemeAction() {
  const c = await cookies()
  c.delete('theme')
  console.log('🟢 Server Action 에서 쿠키 삭제')
  return { ok: true }
}
