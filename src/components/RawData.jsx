import { useState } from 'react'
import { voc } from '../data/voc.js'
import { dev } from '../data/dev.js'
import { chat } from '../data/chat.js'

const sectionStyle = {
  background: '#fff',
  border: '1px solid #e5e7eb',
  borderRadius: 8,
  padding: 16,
  marginTop: 20,
}

const tableWrapStyle = {
  overflowX: 'auto',
  marginTop: 10,
  border: '1px solid #e5e7eb',
  borderRadius: 6,
}

const tableStyle = {
  width: '100%',
  borderCollapse: 'collapse',
  fontSize: 12,
  minWidth: 760,
}

const thStyle = {
  textAlign: 'left',
  background: '#f9fafb',
  color: '#4b5563',
  fontWeight: 600,
  padding: '8px 10px',
  borderBottom: '1px solid #e5e7eb',
  whiteSpace: 'nowrap',
}

const tdStyle = {
  padding: '8px 10px',
  borderBottom: '1px solid #f3f4f6',
  verticalAlign: 'top',
}

function DataTable({ columns, rows }) {
  return (
    <div style={tableWrapStyle}>
      <table style={tableStyle}>
        <thead>
          <tr>
            {columns.map(col => (
              <th key={col.key} style={thStyle}>{col.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={row.id || row.time || index}>
              {columns.map(col => (
                <td key={col.key} style={tdStyle}>{row[col.key] || '-'}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default function RawData() {
  const [open, setOpen] = useState(false)

  return (
    <section style={sectionStyle}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        style={{
          width: '100%',
          border: 0,
          background: 'transparent',
          padding: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: 'pointer',
          color: '#111827',
          textAlign: 'left',
        }}
      >
        <span style={{ fontSize: 18, fontWeight: 700 }}>原始数据（mock）</span>
        <span style={{ fontSize: 13, color: '#6b7280' }}>{open ? '收起' : '展开'}</span>
      </button>
      {open && (
        <div style={{ marginTop: 14 }}>
          <h3 style={{ fontSize: 14, margin: '12px 0 0' }}>VOC</h3>
          <DataTable
            rows={voc}
            columns={[
              { key: 'id', label: 'ID' },
              { key: 'customer', label: '客户' },
              { key: 'priority', label: '优先级' },
              { key: 'status', label: '状态' },
              { key: 'owner', label: '负责人' },
              { key: 'content', label: '内容' },
            ]}
          />
          <h3 style={{ fontSize: 14, margin: '16px 0 0' }}>DEV</h3>
          <DataTable
            rows={dev}
            columns={[
              { key: 'id', label: 'ID' },
              { key: 'title', label: '标题' },
              { key: 'linkedVoc', label: '关联 VOC' },
              { key: 'status', label: '研发状态' },
              { key: 'dueDate', label: '预计完成' },
              { key: 'note', label: '备注' },
            ]}
          />
          <h3 style={{ fontSize: 14, margin: '16px 0 0' }}>群聊</h3>
          <DataTable
            rows={chat}
            columns={[
              { key: 'time', label: '时间' },
              { key: 'speaker', label: '发言人' },
              { key: 'text', label: '内容' },
            ]}
          />
        </div>
      )}
    </section>
  )
}
