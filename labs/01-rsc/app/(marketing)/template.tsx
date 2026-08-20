import Counter from '@/app/_components/Counter'

export default function MarketingTemplate({
  children,
}: {
  children: React.ReactNode
}) {
  console.log('🟣 MarketingTemplate 실행')

  return (
    <div style={{ border: '2px dashed purple', padding: 12, margin: 12 }}>
      <p>
        MarketingTemplate <Counter label="Template" />
      </p>
      {children}
    </div>
  )
}
