// SPEC §5: 群聊关键词/正则解析。无 LLM。

const VOC_RE = /VOC-\d+/g
const DEV_RE = /DEV-\d+/g
const KNOWN_CUSTOMERS = ['奔驰', '沃尔玛', '地铁客户', '政企客户']

const SIGNAL_RULES = [
  { signal: 'mentionedLaunched',    match: t => /已经上线|已上线/.test(t),                                          scope: 'dev' },
  { signal: 'customerNotConfirmed', match: t => /没有客户确认|未确认|还没有.*?客户确认|没有.*?确认记录/.test(t),  scope: 'dev' },
  { signal: 'customerAsking',       match: t => /追问|再问|什么时候|明确上线时间|今天最好回复|能否本周/.test(t),  scope: 'either' },
  { signal: 'dependency',           match: t => /依赖|要等|还要等/.test(t),                                          scope: 'dev' },
  { signal: 'urgent',               match: t => /本周|今天|下班前|这周五|这周/.test(t),                             scope: 'either' },
]

const LINK_HINT_RE = /应该和|是同一个|感觉和.*?有关系|和.*?有关系/

function timeToEvidenceId(time) {
  // '2026-05-16 09:12' -> 'chat@09:12'
  return 'chat@' + time.split(' ')[1]
}

export function parseChat(chatRecords, vocData = [], devData = []) {
  const devSignals = new Map()  // DEV-id -> [{signal, evidence}]
  const vocSignals = new Map()  // VOC-id -> [{signal, evidence}]
  const links = []              // [{voc, dev, evidence, inferred}]
  const enriched = []           // chat rows with extracted metadata

  for (const c of chatRecords) {
    const evidence = timeToEvidenceId(c.time)
    const vocIds = [...new Set(c.text.match(VOC_RE) || [])]
    const devIds = [...new Set(c.text.match(DEV_RE) || [])]
    const customers = KNOWN_CUSTOMERS.filter(name => c.text.includes(name))
    const signals = []

    for (const rule of SIGNAL_RULES) {
      if (!rule.match(c.text)) continue
      signals.push(rule.signal)
      if (rule.scope === 'dev' || rule.scope === 'either') {
        for (const d of devIds) {
          if (!devSignals.has(d)) devSignals.set(d, [])
          devSignals.get(d).push({ signal: rule.signal, evidence })
        }
      }
      if (rule.scope === 'voc' || rule.scope === 'either') {
        for (const v of vocIds) {
          if (!vocSignals.has(v)) vocSignals.set(v, [])
          vocSignals.get(v).push({ signal: rule.signal, evidence })
        }
      }
    }

    const linkMatched = LINK_HINT_RE.test(c.text)
    if (linkMatched) {
      signals.push('linkHint')
      if (vocIds.length && devIds.length) {
        // 显式：同句里 VOC + DEV 都被点名
        for (const v of vocIds) for (const d of devIds) {
          links.push({ voc: v, dev: d, evidence, inferred: false })
        }
      } else if (devIds.length && customers.length && !vocIds.length) {
        // 推断：只点了 DEV + 客户名，关联到该客户尚未挂 DEV 的 VOC
        for (const cust of customers) {
          const unlinkedVocs = vocData.filter(v =>
            v.customer === cust && !devData.some(d => d.linkedVoc === v.id)
          )
          for (const v of unlinkedVocs) for (const d of devIds) {
            links.push({ voc: v.id, dev: d, evidence, inferred: true })
          }
        }
      }
    }

    enriched.push({
      time: c.time,
      speaker: c.speaker,
      text: c.text,
      evidence,
      customers,
      vocIds,
      devIds,
      signals,
    })
  }

  return { dev: devSignals, voc: vocSignals, links, chat: enriched }
}
