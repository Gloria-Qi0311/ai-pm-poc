// 全局 state — v1 仅前端内存，刷新会丢，是预期行为。
export const initialState = {
  confirmedLinks: [],     // [{voc, dev}]
  rejectedLinks: [],      // [{voc, dev}]
  customerConfirmed: [],  // [devId]
  repliedTodos: [],       // [vocId]
  postponedTodos: [],     // [vocId]
}

export const TODAY = '2026-05-16'
