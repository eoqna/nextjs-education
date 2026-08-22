export default function LayoutThatThrows({
  children,
}: {
  children: React.ReactNode
}) {
  throw new Error('💥 layout.tsx 에서 던진 에러')

  // eslint-disable-next-line no-unreachable
  return <div>{children}</div>
}
