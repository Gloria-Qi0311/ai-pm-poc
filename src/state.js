// 全局 state — v1 仅前端内存，刷新会丢，是预期行为。
export const initialState = {
  confirmedLinks: [],     // [{voc, dev}]
  rejectedLinks: [],      // [{voc, dev}]
  customerConfirmed: [],  // [devId]
  repliedTodos: [],       // [vocId]
  postponedTodos: [],     // [vocId]
}

export const TODAY = '2026-05-16'

// #9: reducer 集中处理人工确认。
// 所有 action 统一使用 action.payload（之前 CONFIRM_CUSTOMER / REPLY_TODO / POSTPONE_TODO
// 各自用 action.dev / action.voc，形状不一致，自检 #14 提出后统一）。
export function reducer(state, action) {
  switch (action.type) {
    case 'CONFIRM_LINK':
      return { ...state, confirmedLinks: [...state.confirmedLinks, action.payload] }
    case 'REJECT_LINK':
      return { ...state, rejectedLinks: [...state.rejectedLinks, action.payload] }
    case 'CONFIRM_CUSTOMER':
      return { ...state, customerConfirmed: [...state.customerConfirmed, action.payload] }
    case 'REPLY_TODO':
      return { ...state, repliedTodos: [...state.repliedTodos, action.payload] }
    case 'POSTPONE_TODO':
      return { ...state, postponedTodos: [...state.postponedTodos, action.payload] }
    case 'RESET':
      return initialState
    default:
      return state
  }
}
