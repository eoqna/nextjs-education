console.log('── 응답: 쿠키 3개 설정 ──')
const headers = new Headers()
headers.append('Set-Cookie', 'session=abc123; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=3600')
headers.append('Set-Cookie', 'theme=dark; Path=/')
headers.append('Set-Cookie', 'lang=ko; Path=/')

console.log('\n  get("set-cookie") — 하나로 합쳐진다:')
console.log('   ', headers.get('set-cookie'))

console.log('\n  getSetCookie() — 배열로 제대로 나온다:')
for (const c of headers.getSetCookie()) console.log('    -', c)

console.log('\n── 요청: 브라우저가 보낼 때 ──')
const req = new Request('https://example.com', {
  headers: { cookie: 'session=abc123; theme=dark; lang=ko' },
})
console.log('  Cookie 헤더 (1개):', req.headers.get('cookie'))

const parsed = Object.fromEntries(
  req.headers.get('cookie').split('; ').map((c) => {
    const i = c.indexOf('=')
    return [c.slice(0, i), c.slice(i + 1)]
  })
)
console.log('  파싱 결과:', parsed)

console.log('\n── 비대칭 정리 ──')
console.log('  응답 → Set-Cookie 헤더 N개. 속성(HttpOnly 등) 포함')
console.log('  요청 → Cookie 헤더 1개. 이름=값 만. 속성은 오지 않는다')

console.log('\n── 서버는 HttpOnly 여부를 알 수 있는가? ──')
console.log('  요청에 온 값:', req.headers.get('cookie'))
console.log('  → 속성이 없다. 서버는 이 쿠키가 HttpOnly인지 Secure인지 알 수 없다.')
console.log('  → 속성은 브라우저에게 주는 지시일 뿐, 브라우저가 지킨다.')
