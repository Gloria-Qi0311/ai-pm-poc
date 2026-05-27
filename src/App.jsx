import { useReducer } from 'react'
import { compute } from './compose.js'
import { initialState, reducer, TODAY } from './state.js'
import Summary from './components/Summary.jsx'
import Todos from './components/Todos.jsx'
import Risks from './components/Risks.jsx'
import Pending from './components/Pending.jsx'

export default function App() {
  const [state, dispatch] = useReducer(reducer, initialState)
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
      <header
        style={{
          borderBottom: '1px solid #e5e7eb',
          paddingBottom: 12,
          marginBottom: 20,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
        }}
      >
        <div>
          <h1 style={{ margin: 0, fontSize: 22 }}>PM 每日跟进助手</h1>
          <div style={{ color: '#6b7280', fontSize: 13 }}>今日 {TODAY}</div>
        </div>
        <button
          onClick={() => dispatch({ type: 'RESET' })}
          style={{
            fontSize: 12,
            padding: '4px 10px',
            background: '#fff',
            border: '1px solid #d1d5db',
            borderRadius: 4,
            cursor: 'pointer',
            color: '#374151',
          }}
        >
          重置
        </button>
      </header>
      <Summary summary={summary} />
      <Todos todos={todos} dispatch={dispatch} />
      <Risks risks={risks} />
      <Pending pending={pending} dispatch={dispatch} />
      <footer
        style={{
          marginTop: 32,
          paddingTop: 12,
          borderTop: '1px solid #e5e7eb',
          fontSize: 12,
          color: '#9ca3af',
        }}
      >
        v1 · 点击依据 chip 展开原文。人工确认/已回复改本地 state，刷新会丢。导出 markdown 见 #10。
      </footer>
    </div>
  )
}
