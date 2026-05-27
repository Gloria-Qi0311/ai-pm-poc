// 验收脚本：跑 SPEC §8 七条验收。
// 用法：node verify.js（或 npm run verify）
import { compute } from './src/compose.js'
import { resolveEvidence } from './src/lib/evidence.js'
import { initialState } from './src/state.js'

let pass = 0, fail = 0
function check(label, ok, detail) {
  if (ok) { console.log(`  ✓ ${label}`); pass++ }
  else { console.log(`  ✗ ${label}${detail ? '\n      ' + detail : ''}`); fail++ }
}
function section(name) { console.log(`\n[${name}]`) }

// === 初始 state（无人工确认） ===
const r0 = compute({ ...initialState })

section('SPEC §8.1 — 今日待办')
const todoVocs = r0.todos.map(t => t.voc)
check('含 VOC-005 (沃尔玛 P0)', todoVocs.includes('VOC-005'), `actual: [${todoVocs.join(', ')}]`)
check('含 VOC-007 (奔驰 P1)', todoVocs.includes('VOC-007'), `actual: [${todoVocs.join(', ')}]`)
check('含 VOC-008 (地铁 P1)', todoVocs.includes('VOC-008'), `actual: [${todoVocs.join(', ')}]`)

section('SPEC §8.2 — 风险')
const launchedNotConfirmed = r0.risks.filter(r => r.type === '已上线未确认').map(r => r.dev)
check('已上线未确认 含 DEV-104', launchedNotConfirmed.includes('DEV-104'),
  `actual: [${launchedNotConfirmed.join(', ')}]`)
const promiseRisks = r0.risks.filter(r => r.type === '上线承诺风险').map(r => r.dev)
check('上线承诺风险 含 DEV-101', promiseRisks.includes('DEV-101'),
  `actual: [${promiseRisks.join(', ')}]`)
const depRisks = r0.risks.filter(r => r.type === '联调依赖风险').map(r => r.dev)
check('联调依赖风险 含 DEV-106', depRisks.includes('DEV-106'),
  `actual: [${depRisks.join(', ')}]`)

section('SPEC §8.3 — 待人工确认')
const suggested = r0.pending.filter(p => p.type === 'suggestedLink')
check('含 VOC-003 ↔ DEV-103',
  suggested.some(p => p.voc === 'VOC-003' && p.dev === 'DEV-103'),
  `actual: [${suggested.map(p => `${p.voc}↔${p.dev}`).join(', ')}]`)
check('含 VOC-006 ↔ DEV-105',
  suggested.some(p => p.voc === 'VOC-006' && p.dev === 'DEV-105'),
  `actual: [${suggested.map(p => `${p.voc}↔${p.dev}`).join(', ')}]`)

section('SPEC §8.4 — 所有结论都能 resolve 依据原文')
const allEvidence = [
  ...r0.todos.flatMap(t => t.evidence),
  ...r0.risks.flatMap(r => r.evidence),
  ...r0.pending.flatMap(p => p.evidence),
]
const unresolved = allEvidence.filter(e => !resolveEvidence(e))
check('所有 evidence id 都能 resolve', unresolved.length === 0,
  unresolved.length ? `未解析: ${unresolved.join(', ')}` : '')

section('SPEC §8.5 — 确认 VOC-003↔DEV-103 后该项不再出现')
const r1 = compute({ ...initialState, confirmedLinks: [{ voc: 'VOC-003', dev: 'DEV-103' }] })
const stillSuggested = r1.pending.filter(p => p.type === 'suggestedLink' && p.voc === 'VOC-003' && p.dev === 'DEV-103')
check('疑似关联不再含 VOC-003↔DEV-103', stillSuggested.length === 0)

section('SPEC §8.6 — 客户确认 DEV-104 后不再出现')
const r2 = compute({ ...initialState, customerConfirmed: ['DEV-104'] })
const stillLaunched = r2.risks.filter(r => r.type === '已上线未确认' && r.dev === 'DEV-104')
check('"已上线未确认" 不再含 DEV-104', stillLaunched.length === 0)
const stillCustomerConfirm = r2.pending.filter(p => p.type === 'customerConfirmation' && p.dev === 'DEV-104')
check('"待客户确认" 不再含 DEV-104', stillCustomerConfirm.length === 0)

console.log('\n[Summary 文案]')
console.log(' ', r0.summary)

console.log(`\n${pass} passed, ${fail} failed`)
process.exit(fail === 0 ? 0 : 1)
