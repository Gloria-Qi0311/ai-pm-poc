// v1: 仅展示。点击展开原文由 #8 的 EvidenceTag 替换。
export default function EvidenceChips({ items }) {
  if (!items || items.length === 0) return null
  return (
    <div style={{ marginTop: 8, fontSize: 12, color: '#6b7280', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 4 }}>
      <span>依据：</span>
      {items.map((id, i) => (
        <code
          key={id + '-' + i}
          style={{
            background: '#f3f4f6',
            padding: '2px 6px',
            borderRadius: 4,
            fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
            fontSize: 11,
          }}
        >
          {id}
        </code>
      ))}
    </div>
  )
}
