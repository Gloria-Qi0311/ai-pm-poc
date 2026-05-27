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
// 所有 action 都是把新条目 append 进 state 对应数组，保持简单。
export function reducer(state, action) {
  switch (action.type) {
    case 'CONFIRM_LINK':
      return { ...state, confirmedLinks: [...state.confirmedLinks, action.payload] }
    case 'REJECT_LINK':
      return { ...state, rejectedLinks: [...state.rejectedLinks, action.payload] }
    case 'CONFIRM_CUSTOMER':
      return { ...state, customerConfirmed: [...state.customerConfirmed, action.dev] }
    case 'REPLY_TODO':
      return { ...state, repliedTodos: [...state.repliedTodos, action.voc] }
    case 'POSTPONE_TODO':
      return { ...state, postponedTodos: [...state.postponedTodos, action.voc] }
    case 'RESET':
      return initialState
    default:
      return state
  }
}
