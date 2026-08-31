'use server'

// 파일 전체에 'use server'. 여기서 export 되는 함수들은
// 클라이언트에서 호출 가능한 엔드포인트로 노출된다.

const posts: { id: number; title: string }[] = []
let nextId = 1

export async function createPost(title: string) {
  console.log('🟢 createPost 실행 — 서버에서만 보이는 로그:', title)
  posts.push({ id: nextId++, title })
  return { ok: true, count: posts.length }
}

export async function listPosts() {
  console.log('🟡 listPosts 실행')
  return posts
}

export async function deleteAll() {
  console.log('🔴 deleteAll 실행')
  posts.length = 0
  return { ok: true, count: 0 }
}

// Q5 확인용 — 반환값에 함수를 넣으면?
export async function returnsFunction() {
  console.log('🟣 returnsFunction 실행')
  return {
    ok: true,
    retry: () => console.log('이 함수가 클라이언트로 갈 수 있을까'),
  }
}
