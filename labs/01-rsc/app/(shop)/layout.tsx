export default function ShopLayout({
  children,
}: {
  children: React.ReactNode
}) {
  console.log('🟠 ShopLayout 실행')

  return (
    <section style={{ border: '2px solid orange', padding: 12, margin: 12 }}>
      <p>ShopLayout</p>
      {children}
    </section>
  )
}
