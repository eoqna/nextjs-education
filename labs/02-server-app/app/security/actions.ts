'use server'

import { cookies } from 'next/headers'

// 흉내용 데이터
let users = ['kim', 'lee', 'park', 'choi']

export async function getUsers() {
  return users
}

export async function getRole() {
  const c = await cookies()
  return c.get('role')?.value ?? 'guest'
}

// ❌ 취약한 버전 — 권한 체크가 없다.
//    화면에서 관리자에게만 버튼을 보여주는 것으로 "보호"했다고 착각한 경우.
export async function deleteAllUsers() {
  console.log('💀 deleteAllUsers 실행됨 — 권한 확인 없이')
  const before = users.length
  users = []
  return { ok: true, deleted: before }
}

// ✅ 안전한 버전 — 액션 내부에서 직접 확인한다.
export async function deleteAllUsersSafe() {
  const role = await getRole()
  console.log('🔒 deleteAllUsersSafe — 요청자 role:', role)

  if (role !== 'admin') {
    console.log('🔒 거부됨')
    return { ok: false, error: '권한 없음' }
  }

  const before = users.length
  users = []
  return { ok: true, deleted: before }
}

export async function resetUsers() {
  users = ['kim', 'lee', 'park', 'choi']
  return { ok: true }
}

// 실험 편의용 — role 쿠키를 바꾼다
export async function setRole(role: string) {
  const c = await cookies()
  c.set('role', role, { path: '/' })
  return { ok: true, role }
}
