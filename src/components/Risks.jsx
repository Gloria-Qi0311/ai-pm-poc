import EvidenceChips from './EvidenceChips.jsx'

const TYPE_STYLE = {
  '已上线未确认': { color: '#fff', background: '#7c3aed' },
  '上线承诺风险': { color: '#fff', background: '#dc2626' },
  '联调依赖风险': { color: '#fff', background: '#ea580c' },
  '延期风险':     { color: '#fff', background: '#b45309' },
}

function TypeBadge({ type }) {
  const style = TYPE_STYLE[type] || { color: '#fff', background: '#6b7280' }
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
      {type}
    </span>
  )
}

export default function Risks({ risks }) {
  return (
    <section style={{ marginBottom: 24 }}>
      <h2 style={{ fontSize: 15, marginBottom: 10 }}>风险（{risks.length}）</h2>
      {risks.length === 0 ? (
        <p style={{ color: '#6b7280' }}>暂无识别到的风险。</p>
      ) : (
        <div style={{ display: 'grid', gap: 8 }}>
          {risks.map((r, i) => (
            <div
              key={`${r.type}-${r.dev}-${i}`}
              style={{
                border: '1px solid #e5e7eb',
                borderRadius: 8,
                padding: 12,
                background: '#fff',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, flexWrap: 'wrap' }}>
                <TypeBadge type={r.type} />
                <code style={{ fontFamily: 'ui-monospace, monospace' }}>{r.dev}</code>
                {r.dependsOn && (
                  <span style={{ fontSize: 12, color: '#6b7280' }}>
                    依赖 <code>{r.dependsOn}</code>
                  </span>
                )}
              </div>
              <div style={{ fontSize: 13, color: '#374151' }}>{r.action}</div>
              <EvidenceChips items={r.evidence} />
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
