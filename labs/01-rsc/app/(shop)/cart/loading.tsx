export default function CartLoading() {
  console.log('⏳ CartLoading 실행')

  return (
    <div style={{ border: '3px dotted gray', padding: 16, margin: 12 }}>
      <h2>⏳ loading.tsx</h2>
      <p>cart 데이터를 불러오는 중…</p>
    </div>
  )
}
