export default async function Slow({ sec, name }: { sec: number; name: string }) {
  await new Promise((r) => setTimeout(r, sec * 1000))
  return (
    <p style={{ padding: 8, background: '#efe', margin: 4 }}>
      ✅ {name} — {sec}초 걸림 (완료: {new Date().toISOString().slice(17, 23)})
    </p>
  )
}
