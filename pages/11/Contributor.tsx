export { Contributor }

function Contributor({ name, user, id }: { name: string; user: string; id: number }) {
  return (
    <div style={{ marginTop: 10, fontSize: '0.8em' }}>
      <img
        src={`https://avatars.githubusercontent.com/u/${id}?v=4&size=200`}
        style={{ height: 50, borderRadius: 7, verticalAlign: 'middle' }}
      />
      <span style={{ verticalAlign: 'middle', fontWeight: 500, paddingLeft: 20 }}>{name}</span>
      <span style={{ verticalAlign: 'middle', padding: 5 }}> · </span>
      <span style={{ verticalAlign: 'middle', color: '#888' }}>{user}</span>
    </div>
  )
}
