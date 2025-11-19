export function CodeBlock({ style, ...props }: any) {
  return (
    <div
      style={{
        fontSize: '16px',
        marginTop: -15,
        ...style,
      }}
      {...props}
    ></div>
  )
}
