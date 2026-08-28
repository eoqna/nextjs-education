const req = new Request('https://example.com/api/users?page=2&sort=name', {
  method: 'POST',
  headers: { 'content-type': 'application/json', 'x-custom': 'hi' },
  body: JSON.stringify({ name: 'kim' }),
})

console.log('── Q1. req.url ──')
console.log('  ', req.url)
console.log('   method:', req.method)

console.log('\n── Q2. 쿼리 파라미터 꺼내기 ──')
console.log('   req.query 는?', req.query)
const url = new URL(req.url)
console.log('   new URL(req.url).pathname     :', url.pathname)
console.log('   ...searchParams.get("page")   :', url.searchParams.get('page'))
console.log('   ...searchParams 전체          :', Object.fromEntries(url.searchParams))
console.log('   headers 전체                  :', Object.fromEntries(req.headers))

console.log('\n── Q3. GET + body ──')
try {
  new Request('https://example.com', { method: 'GET', body: 'hi' })
  console.log('   에러 없이 생성됨')
} catch (e) {
  console.log(`   ❌ ${e.constructor.name} — ${e.message}`)
}

console.log('\n── Q4. 미들웨어가 읽은 뒤 핸들러가 또 읽으면 ──')

async function middleware(request) {
  const body = await request.json()
  console.log('   [미들웨어] 읽음:', body, '/ bodyUsed:', request.bodyUsed)
  return request
}

async function handler(request) {
  try {
    const body = await request.json()
    console.log('   [핸들러] 읽음:', body)
  } catch (e) {
    console.log(`   [핸들러] ❌ ${e.constructor.name} — ${e.message}`)
  }
}

const req2 = new Request('https://example.com', {
  method: 'POST',
  body: JSON.stringify({ name: 'kim' }),
})
await handler(await middleware(req2))

console.log('\n── Q5. clone() 으로 고치면 ──')

async function middlewareFixed(request) {
  const body = await request.clone().json()   // 복제본을 읽는다
  console.log('   [미들웨어] 읽음:', body, '/ 원본 bodyUsed:', request.bodyUsed)
  return request
}

const req3 = new Request('https://example.com', {
  method: 'POST',
  body: JSON.stringify({ name: 'kim' }),
})
await handler(await middlewareFixed(req3))
