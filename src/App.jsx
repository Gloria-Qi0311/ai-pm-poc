import { useState } from 'react'
import { compute } from './compose.js'
import { initialState, TODAY } from './state.js'
import Summary from './components/Summary.jsx'
import Todos from './components/Todos.jsx'
import Risks from './components/Risks.jsx'
import Pending from './components/Pending.jsx'

export default function App() {
  // v1: state 暂为只读，#9 接入 useReducer 后才有人工确认按钮。
  const [state] = useState(initialState)
  const { todos, risks, pending, summary } = compute(state)

  return (
    <div
      style={{
        maxWidth: 960,
        margin: '0 auto',
        padding: '24px 16px',
        fontFamily: 'system-ui, -apple-system, "Segoe UI", sans-serif',
        color: '#222',
        lineHeight: 1.6,
        background: '#fafafa',
        minHeight: '100vh',
      }}
    >
      <header style={{ borderBottom: '1px solid #e5e7eb', paddingBottom: 12, marginBottom: 20 }}>
        <h1 style={{ margin: 0, fontSize: 22 }}>PM 每日跟进助手</h1>
        <div style={{ color: '#6b7280', fontSize: 13 }}>今日 {TODAY}</div>
      </header>
      <Summary summary={summary} />
      <Todos todos={todos} />
      <Risks risks={risks} />
      <Pending pending={pending} />
      <footer style={{ marginTop: 32, paddingTop: 12, borderTop: '1px solid #e5e7eb', fontSize: 12, color: '#9ca3af' }}>
        v1 · 仅展示。点击展开依据原文（#8）、人工确认按钮（#9）、导出 markdown（#10）见后续 PR。
      </footer>
    </div>
  )
}
