// 把 parseChat 抽出来的信号挂到 VOC/DEV 记录上。纯 merge，不做业务判断。
export function enrich(data, chatParsed) {
  const voc = data.voc.map(v => ({
    ...v,
    chatSignals: chatParsed.voc.get(v.id) || [],
  }))
  const dev = data.dev.map(d => ({
    ...d,
    chatSignals: chatParsed.dev.get(d.id) || [],
  }))
  return { voc, dev, chat: data.chat }
}
