// SPEC §7: 摘要段（模板拼接，无 LLM）

export function getSummary({ todos, risks, pending }) {
  const byCust = {}
  for (const t of todos) byCust[t.customer] = (byCust[t.customer] || 0) + 1
  const todoStr = Object.entries(byCust).map(([c, n]) => `${c}×${n}`).join('、') || '无'

  const promiseRiskDevs = risks.filter(r => r.type === '上线承诺风险').map(r => r.dev)
  const depRiskDevs = risks.filter(r => r.type === '联调依赖风险').map(r => r.dev)
  const launchedNotConfirmed = risks.filter(r => r.type === '已上线未确认').map(r => r.dev)
  const overdue = risks.filter(r => r.type === '延期风险').map(r => r.dev)
  const suggestedLinks = pending.filter(p => p.type === 'suggestedLink')

  const devRiskIds = [...new Set([...promiseRiskDevs, ...depRiskDevs])]

  const parts = [`今天有 ${todos.length} 条 P0/P1 客户待回复（${todoStr}）`]
  if (devRiskIds.length) {
    parts.push(`${devRiskIds.length} 个研发任务有上线承诺/联调依赖风险（${devRiskIds.join('、')}）`)
  }
  if (launchedNotConfirmed.length) {
    parts.push(`${launchedNotConfirmed.length} 个功能已上线待客户确认（${launchedNotConfirmed.join('、')}）`)
  }
  if (overdue.length) {
    parts.push(`${overdue.length} 个任务已过预计完成时间（${overdue.join('、')}）`)
  }
  if (suggestedLinks.length) {
    parts.push(`${suggestedLinks.length} 条 VOC 疑似缺关联`)
  }
  return parts.join('；') + '。'
}
