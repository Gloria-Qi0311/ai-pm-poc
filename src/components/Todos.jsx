import EvidenceChips from './EvidenceChips.jsx'

const PRIORITY_STYLE = {
  P0: { color: '#fff', background: '#dc2626' },
  P1: { color: '#fff', background: '#ea580c' },
  P2: { color: '#fff', background: '#65a30d' },
}

function PriorityBadge({ priority }) {
  const style = PRIORITY_STYLE[priority] || { color: '#fff', background: '#6b7280' }
  return (
    <span
      style={{
        ...style,
        fontSize: 11,
        fontWeight: 600,
        padding: '2px 6px',
        borderRadius: 4,
      }}
    >
      {priority}
    </span>
  )
}

export default function Todos({ todos }) {
  return (
    <section style={{ marginBottom: 24 }}>
      <h2 style={{ fontSize: 15, marginBottom: 10 }}>今日待办（{todos.length}）</h2>
      {todos.length === 0 ? (
        <p style={{ color: '#6b7280' }}>没有 P0/P1 待回复事项。</p>
      ) : (
        <div style={{ display: 'grid', gap: 10 }}>
          {todos.map(t => (
            <div
              key={t.voc}
              style={{
                border: '1px solid #e5e7eb',
                borderRadius: 8,
                padding: 12,
                background: '#fff',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <PriorityBadge priority={t.priority} />
                <strong>{t.customer}</strong>
                {t.linkedDev && (
                  <span style={{ fontSize: 12, color: '#6b7280' }}>
                    关联 <code>{t.linkedDev}</code>
                  </span>
                )}
              </div>
              <div style={{ marginBottom: 8 }}>{t.content}</div>
              <div
                style={{
                  fontSize: 13,
                  color: '#374151',
                  background: '#f9fafb',
                  padding: 8,
                  borderRadius: 6,
                  borderLeft: '3px solid #3b82f6',
                }}
              >
                <span style={{ color: '#6b7280', marginRight: 4 }}>建议回复要点：</span>
                {t.hint}
              </div>
              <EvidenceChips items={t.evidence} />
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
