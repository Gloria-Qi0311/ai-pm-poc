// 把规则层拼起来 — UI 和 verify.js 共用，避免逻辑漂移。
import { voc } from './data/voc.js'
import { dev } from './data/dev.js'
import { chat } from './data/chat.js'
import { parseChat } from './rules/parseChat.js'
import { enrich } from './rules/enrich.js'
import { getTodos } from './rules/todos.js'
import { getRisks } from './rules/risks.js'
import { getPendingConfirmations } from './rules/pending.js'
import { getSummary } from './rules/summary.js'

export function compute(state) {
  const chatParsed = parseChat(chat, voc, dev)
  const enriched = enrich({ voc, dev, chat }, chatParsed)
  const fullData = { ...enriched, chatParsed }
  const todos = getTodos(fullData, state)
  const risks = getRisks(fullData, state)
  const pending = getPendingConfirmations(fullData, state)
  const summary = getSummary({ todos, risks, pending })
  return { todos, risks, pending, summary }
}
