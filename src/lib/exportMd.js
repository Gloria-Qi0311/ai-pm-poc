// #10: 把当前 compute() 结果序列化成 markdown。内容应该和界面一致（含依据 id）。
export function exportMd({ today, todos, risks, pending, summary }) {
  const lines = []
  const evidenceStr = arr => arr.map(e => `\`${e}\``).join('、')

  lines.push(`# PM 每日跟进清单 — ${today}`)
  lines.push('')
  lines.push('## 今日摘要')
  lines.push('')
  lines.push(summary)
  lines.push('')

  lines.push(`## 今日待办（${todos.length}）`)
  lines.push('')
  if (todos.length === 0) {
    lines.push('_无 P0/P1 待回复事项_')
  } else {
    for (const t of todos) {
      lines.push(`### ${t.customer} — \`${t.voc}\` (${t.priority})`)
      lines.push('')
      lines.push(`> ${t.content}`)
      lines.push('') // 隔开 blockquote，否则下一行会被 lazy continuation 吃进引用块
      if (t.linkedDev) {
        lines.push(`关联：\`${t.linkedDev}\``)
        lines.push('')
      }
      lines.push(`**建议回复要点**：${t.hint}`)
      lines.push('')
      lines.push(`**依据**：${evidenceStr(t.evidence)}`)
      lines.push('')
    }
  }

  lines.push(`## 风险（${risks.length}）`)
  lines.push('')
  if (risks.length === 0) {
    lines.push('_暂无识别风险_')
  } else {
    for (const r of risks) {
      const deps = r.dependsOn ? `（依赖 \`${r.dependsOn}\`）` : ''
      lines.push(`### ${r.type} — \`${r.dev}\`${deps}`)
      lines.push(r.action)
      lines.push('')
      lines.push(`**依据**：${evidenceStr(r.evidence)}`)
      lines.push('')
    }
  }

  lines.push(`## 待人工确认（${pending.length}）`)
  lines.push('')
  if (pending.length === 0) {
    lines.push('_无待确认事项_')
  } else {
    for (const p of pending) {
      if (p.type === 'suggestedLink') {
        lines.push(`### 疑似关联 \`${p.voc}\` ↔ \`${p.dev}\`${p.inferred ? '（推断）' : ''}`)
      } else if (p.type === 'customerConfirmation') {
        lines.push(`### 待客户确认 \`${p.dev}\``)
      }
      lines.push(`**依据**：${evidenceStr(p.evidence)}`)
      lines.push('')
    }
  }

  lines.push('---')
  lines.push(`_由 PM 每日跟进助手 (v1 PoC) 生成 · ${today}_`)

  return lines.join('\n')
}
