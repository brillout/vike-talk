export function LivingAt({ children, flag }: { children: React.ReactNode; flag: string }) {
  return (
    <span style={{ color: '#aaa', marginLeft: 4, fontSize: '0.85em' }}>
      <span style={{ marginRight: 4 }}>{flag}</span>
      {children}
    </span>
  )
}
