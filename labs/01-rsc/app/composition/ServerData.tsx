// 지시어 없음. 어디서 import 되느냐에 따라 운명이 갈린다.
export default async function ServerData() {
  console.log('🔴 ServerData 실행')

  const secret = process.env.MY_SECRET ?? '(MY_SECRET 없음)'

  return (
    <p style={{ background: '#ffe', padding: 8 }}>
      ServerData 가 읽은 값: <strong>{secret}</strong>
    </p>
  )
}
