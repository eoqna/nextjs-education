import Counter from '@/app/_components/Counter'

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  console.log('🟢 MarketingLayout 실행')

  return (
    <section style={{ border: '2px solid green', padding: 12, margin: 12 }}>
      <p>
        MarketingLayout <Counter label="Layout" />
      </p>
      {children}
    </section>
  )
}
