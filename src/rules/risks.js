// SPEC §6: 风险类型
//   - 已上线未确认：DEV 状态=已上线 且 (备注含"待客户确认" 或 群聊命中 customerNotConfirmed)
//   - 上线承诺风险：客户在群聊里追问 → 客户的开放 P0/P1 VOC → 关联 DEV(+依赖链上的 DEV) 未上线
//   - 联调依赖风险：DEV 备注含"依赖DEV-xxx" 且被依赖方未上线
//   - 延期风险：dueDate < today 且未上线（兜底）

import { TODAY } from '../state.js'

function traceDependencies(devItem, allDev, seen = new Set()) {
  const out = []
  const deps = [...devItem.note.matchAll(/依赖\s*(DEV-\d+)/g)].map(m => m[1])
  for (const depId of deps) {
    if (seen.has(depId)) continue
    seen.add(depId)
    const dep = allDev.find(d => d.id === depId)
    if (!dep) continue
    out.push(dep)
    out.push(...traceDependencies(dep, allDev, seen))
  }
  return out
}

export function getRisks(data, state = {}) {
  const { voc, dev, chatParsed } = data
  const { customerConfirmed = [] } = state
  const risks = []

  // 1. 已上线未确认
  for (const d of dev) {
    if (customerConfirmed.includes(d.id)) continue
    if (d.status !== '已上线') continue
    const noteSays = d.note.includes('待客户确认')
    const sigs = chatParsed.dev.get(d.id) || []
    const chatSays = sigs.some(s => s.signal === 'customerNotConfirmed' || s.signal === 'mentionedLaunched')
    if (!noteSays && !chatSays) continue
    const evidence = [d.id]
    for (const s of sigs) {
      if ((s.signal === 'mentionedLaunched' || s.signal === 'customerNotConfirmed') && !evidence.includes(s.evidence)) {
        evidence.push(s.evidence)
      }
    }
    risks.push({
      type: '已上线未确认',
      dev: d.id,
      evidence,
      action: '联系客户确认是否已收到/验收，更新状态。',
    })
  }

  // 2. 上线承诺风险
  const promiseRiskMap = new Map() // dev id -> Set(evidence)
  for (const c of chatParsed.chat) {
    if (!c.signals.includes('customerAsking') && !c.signals.includes('urgent')) continue
    const directVocs = c.vocIds.map(id => voc.find(v => v.id === id)).filter(Boolean)
    const indirectVocs = []
    for (const cust of c.customers) {
      for (const v of voc) {
        if (v.customer === cust && v.status === '待回复' && ['P0', 'P1'].includes(v.priority)) {
          indirectVocs.push(v)
        }
      }
    }
    const allVocs = [...new Map([...directVocs, ...indirectVocs].map(v => [v.id, v])).values()]
    for (const v of allVocs) {
      const linked = dev.filter(d => d.linkedVoc === v.id && d.status !== '已上线')
      for (const d of linked) {
        if (!promiseRiskMap.has(d.id)) promiseRiskMap.set(d.id, new Set())
        promiseRiskMap.get(d.id).add(v.id)
        promiseRiskMap.get(d.id).add(c.evidence)
        for (const dep of traceDependencies(d, dev)) {
          if (dep.status === '已上线') continue
          if (!promiseRiskMap.has(dep.id)) promiseRiskMap.set(dep.id, new Set())
          promiseRiskMap.get(dep.id).add(v.id)
          promiseRiskMap.get(dep.id).add(c.evidence)
        }
      }
    }
  }
  for (const [devId, evSet] of promiseRiskMap) {
    risks.push({
      type: '上线承诺风险',
      dev: devId,
      evidence: [devId, ...evSet],
      action: '在客户承诺时间前同步明确上线时间或风险。',
    })
  }

  // 3. 联调依赖风险
  for (const d of dev) {
    const m = d.note.match(/依赖\s*(DEV-\d+)/)
    if (!m) continue
    const depId = m[1]
    const dep = dev.find(x => x.id === depId)
    if (!dep || dep.status === '已上线') continue
    const evidence = [d.id]
    const sigs = chatParsed.dev.get(d.id) || []
    for (const s of sigs) {
      if (s.signal === 'dependency' && !evidence.includes(s.evidence)) {
        evidence.push(s.evidence)
      }
    }
    risks.push({
      type: '联调依赖风险',
      dev: d.id,
      dependsOn: depId,
      evidence,
      action: `跟进 ${depId} 进度，必要时调整 ${d.id} 排期。`,
    })
  }

  // 4. 延期风险（兜底）
  for (const d of dev) {
    if (d.status === '已上线') continue
    if (d.dueDate >= TODAY) continue
    risks.push({
      type: '延期风险',
      dev: d.id,
      evidence: [d.id],
      action: `已过预计完成时间（${d.dueDate}），核对排期并通知相关方。`,
    })
  }

  return risks
}
