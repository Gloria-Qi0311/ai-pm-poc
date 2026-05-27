import EvidenceChips from './EvidenceChips.jsx'

function Tag({ children, color = '#6b7280', bg = '#f3f4f6' }) {
  return (
    <span
      style={{
        color,
        background: bg,
        fontSize: 11,
        fontWeight: 600,
        padding: '2px 6px',
        borderRadius: 4,
      }}
    >
      {children}
    </span>
  )
}

export default function Pending({ pending }) {
  return (
    <section style={{ marginBottom: 24 }}>
      <h2 style={{ fontSize: 15, marginBottom: 10 }}>待人工确认（{pending.length}）</h2>
      {pending.length === 0 ? (
        <p style={{ color: '#6b7280' }}>没有待确认事项。</p>
      ) : (
        <div style={{ display: 'grid', gap: 8 }}>
          {pending.map((p, i) => (
            <div
              key={`${p.type}-${p.dev || ''}-${p.voc || ''}-${i}`}
              style={{
                border: '1px solid #e5e7eb',
                borderRadius: 8,
                padding: 12,
                background: '#fff',
              }}
            >
              {p.type === 'suggestedLink' && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                  <Tag color="#fff" bg="#0891b2">疑似关联{p.inferred ? '（推断）' : ''}</Tag>
                  <code>{p.voc}</code>
                  <span style={{ color: '#6b7280' }}>↔</span>
                  <code>{p.dev}</code>
                </div>
              )}
              {p.type === 'customerConfirmation' && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                  <Tag color="#fff" bg="#7c3aed">待客户确认</Tag>
                  <code>{p.dev}</code>
                </div>
              )}
              <EvidenceChips items={p.evidence} />
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
