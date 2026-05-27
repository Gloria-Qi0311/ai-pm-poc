export default function Summary({ summary }) {
  return (
    <section
      style={{
        background: '#fef3c7',
        border: '1px solid #fcd34d',
        borderRadius: 8,
        padding: 14,
        marginBottom: 20,
      }}
    >
      <h2 style={{ margin: '0 0 6px 0', fontSize: 15, color: '#92400e' }}>今日摘要</h2>
      <p style={{ margin: 0, color: '#78350f' }}>{summary}</p>
    </section>
  )
}
