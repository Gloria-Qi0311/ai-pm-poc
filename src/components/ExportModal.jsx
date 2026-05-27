import { useEffect, useRef, useState } from 'react'

export default function ExportModal({ markdown, today, onClose }) {
  const textareaRef = useRef(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (textareaRef.current) textareaRef.current.select()
  }, [])

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(markdown)
    } catch {
      textareaRef.current?.select()
      document.execCommand('copy')
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  const handleDownload = () => {
    const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `pm-daily-${today}.md`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.4)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 50,
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: '#fff',
          borderRadius: 8,
          padding: 16,
          width: 'min(720px, 90vw)',
          maxHeight: '85vh',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 12 }}>
          <h3 style={{ margin: 0, fontSize: 16, flex: 1 }}>导出今日清单（markdown）</h3>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              fontSize: 20,
              cursor: 'pointer',
              color: '#6b7280',
            }}
            aria-label="关闭"
          >
            ×
          </button>
        </div>
        <textarea
          ref={textareaRef}
          value={markdown}
          readOnly
          style={{
            flex: 1,
            minHeight: 320,
            padding: 12,
            fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
            fontSize: 12,
            border: '1px solid #d1d5db',
            borderRadius: 6,
            resize: 'vertical',
            background: '#f9fafb',
          }}
        />
        <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
          <button
            onClick={handleCopy}
            style={{
              fontSize: 13,
              padding: '6px 14px',
              background: '#2563eb',
              color: '#fff',
              border: '1px solid #2563eb',
              borderRadius: 4,
              cursor: 'pointer',
            }}
          >
            {copied ? '已复制 ✓' : '复制到剪贴板'}
          </button>
          <button
            onClick={handleDownload}
            style={{
              fontSize: 13,
              padding: '6px 14px',
              background: '#fff',
              color: '#374151',
              border: '1px solid #d1d5db',
              borderRadius: 4,
              cursor: 'pointer',
            }}
          >
            下载 .md
          </button>
          <button
            onClick={onClose}
            style={{
              fontSize: 13,
              padding: '6px 14px',
              background: '#fff',
              color: '#374151',
              border: '1px solid #d1d5db',
              borderRadius: 4,
              cursor: 'pointer',
              marginLeft: 'auto',
            }}
          >
            关闭
          </button>
        </div>
      </div>
    </div>
  )
}
