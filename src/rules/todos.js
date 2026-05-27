// SPEC §6: VOC 状态=待回复 且 优先级 ∈ {P0,P1} → 今日待办

export function getTodos(data, state = {}) {
  const { voc, dev, chatParsed } = data
  const { repliedTodos = [], postponedTodos = [] } = state
  const todos = []

  for (const v of voc) {
    if (repliedTodos.includes(v.id) || postponedTodos.includes(v.id)) continue
    if (v.status !== '待回复') continue
    if (!['P0', 'P1'].includes(v.priority)) continue

    const evidence = [v.id]
    const chatRefs = chatParsed.chat.filter(c =>
      c.vocIds.includes(v.id) ||
      (c.customers.includes(v.customer) && (c.signals.includes('customerAsking') || c.signals.includes('urgent')))
    )
    for (const c of chatRefs) evidence.push(c.evidence)

    const linkedDev = dev.find(d => d.linkedVoc === v.id)
    let hint
    if (!linkedDev) {
      hint = '该需求目前未排期；先给客户一个明确的下次回复时间，再回头排期。'
    } else if (linkedDev.status === '开发中') {
      hint = `告知客户《${linkedDev.title}》预计 ${linkedDev.dueDate} 提测；同步研发进展。`
    } else if (linkedDev.status === '测试中') {
      hint = `告知客户《${linkedDev.title}》测试中，预计 ${linkedDev.dueDate} 完成验证。`
    } else if (linkedDev.status === '待联调') {
      hint = `告知客户《${linkedDev.title}》待联调（${linkedDev.note}）；确认依赖项后给明确时间。`
    } else if (linkedDev.status === '已上线') {
      hint = `《${linkedDev.title}》已上线，请客户确认验收。`
    } else {
      hint = `${linkedDev.title}：当前 ${linkedDev.status}，预计 ${linkedDev.dueDate}。`
    }
    if (/如果.*希望.*先|临时/.test(v.content)) {
      hint += ' 同时就客户提到的临时方案给出明确答复。'
    }

    todos.push({
      voc: v.id,
      customer: v.customer,
      priority: v.priority,
      content: v.content,
      linkedDev: linkedDev ? linkedDev.id : null,
      evidence,
      hint,
    })
  }

  // 排序：P0 在前
  todos.sort((a, b) => (a.priority === 'P0' ? -1 : 1) - (b.priority === 'P0' ? -1 : 1))
  return todos
}
