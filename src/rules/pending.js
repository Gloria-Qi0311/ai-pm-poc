// SPEC §6 / §7: 待人工确认
//   - suggestedLink: 群聊提到/推断的 VOC↔DEV 关联（任务表里还没挂）
//   - customerConfirmation: DEV 已上线但客户还未确认

export function getPendingConfirmations(data, state = {}) {
  const { dev, chatParsed } = data
  const { confirmedLinks = [], rejectedLinks = [], customerConfirmed = [] } = state
  const out = []

  const existingLinks = new Set(dev.filter(d => d.linkedVoc).map(d => `${d.linkedVoc}|${d.id}`))
  const confirmedKeys = new Set(confirmedLinks.map(l => `${l.voc}|${l.dev}`))
  const rejectedKeys = new Set(rejectedLinks.map(l => `${l.voc}|${l.dev}`))
  const seen = new Set()

  for (const l of chatParsed.links) {
    const k = `${l.voc}|${l.dev}`
    if (existingLinks.has(k) || confirmedKeys.has(k) || rejectedKeys.has(k) || seen.has(k)) continue
    seen.add(k)
    out.push({
      type: 'suggestedLink',
      voc: l.voc,
      dev: l.dev,
      inferred: !!l.inferred,
      evidence: [l.evidence],
    })
  }

  for (const d of dev) {
    if (d.status !== '已上线') continue
    if (customerConfirmed.includes(d.id)) continue
    const noteSays = d.note.includes('待客户确认')
    const sigs = chatParsed.dev.get(d.id) || []
    const chatSig = sigs.find(s => s.signal === 'customerNotConfirmed')
    if (!noteSays && !chatSig) continue
    const evidence = [d.id]
    if (chatSig) evidence.push(chatSig.evidence)
    out.push({
      type: 'customerConfirmation',
      dev: d.id,
      evidence,
    })
  }

  return out
}
