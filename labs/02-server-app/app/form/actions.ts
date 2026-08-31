'use server'

export type FormState = {
  message: string
  ok: boolean
}

const titles: string[] = []

// <form action={...}> 로 호출되면 인자로 무엇이 오는지 확인한다.
export async function createPost(formData: FormData) {
  console.log('🟢 createPost — 인자의 정체:', formData.constructor.name)
  console.log('🟢 내용:', Object.fromEntries(formData))

  const title = formData.get('title')
  if (typeof title === 'string' && title.trim()) titles.push(title)

  return { ok: true }
}

// useActionState 용 — 첫 인자로 이전 상태가 온다
export async function createPostWithState(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  console.log('🟡 이전 상태:', prevState)

  const title = String(formData.get('title') ?? '').trim()

  // 서버 검증. 일부러 느리게 해서 pending 상태를 볼 수 있게 한다.
  await new Promise((r) => setTimeout(r, 1500))

  if (!title) return { ok: false, message: '제목을 입력하세요' }
  if (title.length < 3) return { ok: false, message: '제목은 3자 이상' }

  titles.push(title)
  return { ok: true, message: `저장됨 — 현재 ${titles.length}개` }
}

export async function getTitles() {
  return titles
}
