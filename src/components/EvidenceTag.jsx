// #8: 依据 chip 点击展开看原文。同一行内同时只展开一条，再次点击或换一条会切换。
import { useState } from 'react'
import { evidenceText } from '../lib/evidence.js'

export default function EvidenceTag({ items }) {
  const [openId, setOpenId] = useState(null)
  if (!items || items.length === 0) return null

  return (
    <div style={{ marginTop: 8 }}>
      <div
        style={{
          fontSize: 12,
          color: '#6b7280',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: 4,
        }}
      >
        <span>依据：</span>
        {items.map((id, i) => {
          const isOpen = openId === id
          return (
            <code
              key={id + '-' + i}
              onClick={() => setOpenId(isOpen ? null : id)}
              title="点击展开/收起原文"
              style={{
                background: isOpen ? '#dbeafe' : '#f3f4f6',
                color: isOpen ? '#1e3a8a' : '#374151',
                padding: '2px 6px',
                borderRadius: 4,
                fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
                fontSize: 11,
                cursor: 'pointer',
                userSelect: 'none',
                border: isOpen ? '1px solid #93c5fd' : '1px solid transparent',
              }}
            >
              {id}
            </code>
          )
        })}
      </div>
      {openId && (
        <div
          style={{
            marginTop: 6,
            padding: 10,
            background: '#eff6ff',
            border: '1px solid #bfdbfe',
            borderRadius: 6,
            fontSize: 13,
            color: '#1e3a8a',
            lineHeight: 1.5,
          }}
        >
          <div style={{ fontSize: 10, color: '#6b7280', marginBottom: 4 }}>{openId}</div>
          {evidenceText(openId)}
        </div>
      )}
    </div>
  )
}
