// Next.js 없이 순수 Node. import 문이 하나도 없다는 점에 주목.

console.log('── Q1. import 없이 쓸 수 있는가 ──')
for (const name of ['Response', 'Request', 'fetch', 'Headers', 'FormData', 'URL']) {
  console.log(`  ${name.padEnd(9)} : ${typeof globalThis[name]}`)
}

const res = new Response(JSON.stringify({ a: 1 }), {
  status: 200,
  headers: { 'content-type': 'application/json' },
})

console.log('\n── Q4. 헤더 대소문자 ──')
console.log('  get("Content-Type") :', res.headers.get('Content-Type'))
console.log('  get("content-type") :', res.headers.get('content-type'))
console.log('  get("CONTENT-TYPE") :', res.headers.get('CONTENT-TYPE'))

console.log('\n── Q2. body 의 정체 ──')
console.log('  res.body 는', res.body?.constructor?.name)
console.log('  bodyUsed (읽기 전) :', res.bodyUsed)

console.log('\n── Q3. 두 번 읽으면 ──')
console.log('  1회차 :', await res.json())
console.log('  bodyUsed (읽은 후) :', res.bodyUsed)
try {
  console.log('  2회차 :', await res.json())
} catch (e) {
  console.log(`  2회차 : ❌ ${e.constructor.name} — ${e.message}`)
}

console.log('\n── 같은 body 를 두 번 읽어야 한다면 ──')
const res2 = new Response('hello')
const copy = res2.clone()
console.log('  원본 :', await res2.text())
console.log('  복제 :', await copy.text())
