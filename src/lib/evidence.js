import { voc } from '../data/voc.js'
import { dev } from '../data/dev.js'
import { chat } from '../data/chat.js'

export function resolveEvidence(id) {
  if (typeof id !== 'string') return null
  if (id.startsWith('VOC-')) {
    const record = voc.find(v => v.id === id)
    return record ? { kind: 'voc', id, record } : null
  }
  if (id.startsWith('DEV-')) {
    const record = dev.find(d => d.id === id)
    return record ? { kind: 'dev', id, record } : null
  }
  if (id.startsWith('chat@')) {
    const time = id.slice('chat@'.length)
    const record = chat.find(c => c.time.endsWith(time))
    return record ? { kind: 'chat', id, record } : null
  }
  return null
}

export function evidenceText(id) {
  const r = resolveEvidence(id)
  if (!r) return `[未找到: ${id}]`
  if (r.kind === 'voc') return `${r.record.id} ${r.record.customer}（${r.record.priority}, ${r.record.status}）：${r.record.content}`
  if (r.kind === 'dev') return `${r.record.id} ${r.record.title}（${r.record.status}, due ${r.record.dueDate}）：${r.record.note}`
  if (r.kind === 'chat') return `${r.record.time} ${r.record.speaker}：${r.record.text}`
  return `[未知类型: ${id}]`
}
