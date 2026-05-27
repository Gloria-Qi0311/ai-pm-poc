// 共用按钮 —— 之前 Todos / Pending 各有一份 ActionButton，合并到这里。
const VARIANTS = {
  default: { bg: '#fff',    color: '#374151', border: '#d1d5db' },
  primary: { bg: '#2563eb', color: '#fff',    border: '#2563eb' },
  danger:  { bg: '#fff',    color: '#dc2626', border: '#fca5a5' },
}

export default function Button({ children, onClick, variant = 'default', style, ...rest }) {
  const v = VARIANTS[variant] || VARIANTS.default
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        fontSize: 12,
        padding: '4px 10px',
        background: v.bg,
        color: v.color,
        border: `1px solid ${v.border}`,
        borderRadius: 4,
        cursor: 'pointer',
        ...style,
      }}
      {...rest}
    >
      {children}
    </button>
  )
}
