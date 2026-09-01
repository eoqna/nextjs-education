'use server'

import { redirect, notFound, unstable_rethrow } from 'next/navigation'

// 1. redirect 만 호출 — 다음 줄이 실행되는가?
export async function redirectOk() {
  console.log('① redirect 호출 직전')
  redirect('/flow/done')
  console.log('② redirect 다음 줄 — 이게 찍히면 예외가 아니다')
}

// 2. try/catch 로 감쌌을 때
export async function redirectInTryCatch() {
  try {
    console.log('③ try 블록 진입')
    redirect('/flow/done')
  } catch (e) {
    console.log('④ catch 가 무언가를 잡았다:', (e as Error).message)
    console.log('   에러의 정체:', (e as Error).constructor.name)
    return { error: '저장에 실패했습니다' }
  }
}

// 3. unstable_rethrow 로 고친 버전
export async function redirectWithRethrow() {
  try {
    console.log('⑤ try 블록 진입 (rethrow 버전)')
    redirect('/flow/done')
  } catch (e) {
    unstable_rethrow(e) // 프레임워크 내부 예외면 다시 던진다
    console.log('⑥ 진짜 에러만 여기 온다')
    return { error: '저장에 실패했습니다' }
  }
}

// 4. notFound 도 같은 방식인가?
export async function notFoundAction() {
  console.log('⑦ notFound 호출 직전')
  notFound()
  console.log('⑧ notFound 다음 줄')
}
