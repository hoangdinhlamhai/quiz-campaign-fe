import { useEffect, useState, useRef, type ReactNode, type FormEvent } from 'react'

type LockSession = {
  sessionId: string
  campaignId: string
  instructionsHtml: string
  targetUrl: string
  attemptsLeft: number
  expiresAt: number
}

type VerifyResponse = {
  valid: boolean
  attemptsLeft: number
  status: string
}

type Props = {
  contentId: string
  children: ReactNode
  onUnlocked?: () => void
}

const API = import.meta.env.VITE_SENLYZER_API ?? ''

export function SenlyzerLock({ contentId, children, onUnlocked }: Props) {
  const [session, setSession] = useState<LockSession | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [unlocked, setUnlocked] = useState(false)
  const [pass, setPass] = useState('')
  const [verifying, setVerifying] = useState(false)
  const [shake, setShake] = useState(false)
  const [statusMsg, setStatusMsg] = useState<string | null>(null)
  const [copyToast, setCopyToast] = useState<string | null>(null)
  const [switching, setSwitching] = useState(false)
  const [noCampaign, setNoCampaign] = useState(false)
  const unlockedRef = useRef(false)
  const sessionRef = useRef<LockSession | null>(null)
  const instructionsRef = useRef<HTMLDivElement>(null)

  useEffect(() => { unlockedRef.current = unlocked }, [unlocked])
  useEffect(() => { sessionRef.current = session }, [session])

  async function startSession() {
    if (!API) {
      setError('VITE_SENLYZER_API not configured')
      setLoading(false)
      return
    }
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`${API}/api/v1/lock/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contentId }),
      })
      if (!res.ok) {
        if (res.status === 503) {
          const body = await res.json().catch(() => null)
          if (body?.error === 'NO_ACTIVE_CAMPAIGN') {
            setNoCampaign(true)
            setLoading(false)
            return
          }
        }
        throw new Error(`HTTP ${res.status}`)
      }
      const data: LockSession = await res.json()
      setSession(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  async function restartSession() {
    setSwitching(true)
    await new Promise(resolve => setTimeout(resolve, 1500))
    setPass('')
    setStatusMsg(null)
    setSession(null)
    setError(null)
    await startSession()
    setSwitching(false)
  }

  useEffect(() => {
    startSession()
  }, [contentId])

  useEffect(() => {
    return () => {
      if (sessionRef.current && !unlockedRef.current) {
        const payload = JSON.stringify({
          sessionId: sessionRef.current.sessionId,
          eventType: 'abandoned',
        })
        navigator.sendBeacon(
          `${API}/api/v1/events`,
          new Blob([payload], { type: 'text/plain' }),
        )
      }
    }
  }, [])

  function trackEvent(eventType: string, eventData?: object) {
    if (!session) return
    fetch(`${API}/api/v1/events`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId: session.sessionId, eventType, eventData }),
      keepalive: true,
    }).catch(() => {})
  }

  async function handleVerify(e: FormEvent) {
    e.preventDefault()
    if (!session || !/^\d{4}$/.test(pass)) return

    trackEvent('unlock_clicked')
    setVerifying(true)
    setStatusMsg(null)

    try {
      const res = await fetch(`${API}/api/v1/lock/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId: session.sessionId, pass }),
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data: VerifyResponse = await res.json()

      if (data.valid) {
        setUnlocked(true)
        onUnlocked?.()
      } else if (data.status === 'exhausted' || data.status === 'paused' || data.status === 'expired') {
        restartSession()
      } else {
        setSession(s => s ? { ...s, attemptsLeft: data.attemptsLeft } : null)
        setShake(true)
        setTimeout(() => setShake(false), 400)
        setPass('')
        setStatusMsg(`Sai mã. Còn ${data.attemptsLeft} lượt.`)
      }
    } catch {
      setStatusMsg('Lỗi kết nối. Vui lòng thử lại.')
    } finally {
      setVerifying(false)
    }
  }

  useEffect(() => {
    const root = instructionsRef.current
    if (!root) return
    const handler = async (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const btn = target.closest('[data-copy]') as HTMLElement | null
      if (!btn || !root.contains(btn)) return
      e.preventDefault()
      e.stopPropagation()
      const value = btn.getAttribute('data-copy') ?? ''
      try {
        await navigator.clipboard.writeText(value)
        const display = value.length > 30 ? `${value.slice(0, 30)}...` : value
        setCopyToast(`Đã copy: ${display}`)
      } catch {
        setCopyToast('Không thể copy')
      }
    }
    root.addEventListener('click', handler)
    return () => root.removeEventListener('click', handler)
  }, [session?.instructionsHtml])

  useEffect(() => {
    if (!copyToast) return
    const id = window.setTimeout(() => setCopyToast(null), 1800)
    return () => window.clearTimeout(id)
  }, [copyToast])

  const isExpired = session ? Date.now() > session.expiresAt : false
  const isExhausted = session ? session.attemptsLeft <= 0 : false

  if (unlocked) return <>{children}</>
  if (switching) return <div className="senlyzer-lock-loading">Đang chuyển chiến dịch khác...</div>
  if (noCampaign) return <div className="senlyzer-lock-loading">Hiện chưa có nội dung, vui lòng quay lại sau.</div>
  if (loading) return <div className="senlyzer-lock-loading">Đang tải...</div>
  if (error || !session) return <div className="senlyzer-lock-error">Không thể tải. {error}</div>
  if (isExpired) return <div className="senlyzer-lock-loading">Phiên đã hết hạn. Vui lòng refresh trang.</div>

  return (
    <>
      <SenlyzerLockStyles />
      <div className="senlyzer-lock-shell">
        <div className="senlyzer-lock-card">
          <div
            ref={instructionsRef}
            className="senlyzer-lock-instructions"
            dangerouslySetInnerHTML={{ __html: session.instructionsHtml }}
          />

          <div className="senlyzer-lock-actions">
            <form onSubmit={handleVerify} className={`senlyzer-lock-form ${shake ? 'senlyzer-shake' : ''}`}>
              <input
                type="text"
                inputMode="numeric"
                maxLength={4}
                pattern="\d{4}"
                value={pass}
                onChange={e => setPass(e.target.value.replace(/\D/g, ''))}
                placeholder="Nhập mã 4 số"
                className="senlyzer-lock-input"
                disabled={isExhausted || verifying}
              />
              <button
                type="submit"
                disabled={pass.length !== 4 || verifying || isExhausted}
                className="senlyzer-lock-btn-submit"
              >
                {verifying ? 'Đang kiểm tra...' : 'Mở Khoá Ngay!'}
              </button>
            </form>

            {statusMsg && <p className="senlyzer-lock-status">{statusMsg}</p>}
            {!isExhausted && (
              <p className="senlyzer-lock-attempts">Còn {session.attemptsLeft} lượt thử</p>
            )}
          </div>
        </div>
        {copyToast && (
          <div className="senlyzer-lock-toast">{copyToast}</div>
        )}
      </div>
    </>
  )
}

function SenlyzerLockStyles() {
  return (
    <style>{`
      .senlyzer-lock-shell {
        width: 100%;
        max-width: 1080px;
        margin: 0 auto;
        padding: 6rem 1rem 3rem;
      }
      .senlyzer-lock-loading,
      .senlyzer-lock-error {
        padding: 4rem 1rem;
        text-align: center;
        color: #6b7280;
      }
      .senlyzer-lock-error { color: #dc2626; }
      .senlyzer-lock-card {
        background: #ffffff;
        color: #0f172a;
        border-radius: 1rem;
        border: 1px solid hsl(141 40% 85%);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
        padding: 2rem 2.25rem;
        color-scheme: light;
      }
      .senlyzer-lock-instructions,
      .senlyzer-lock-instructions * {
        color: #0f172a;
      }
      .senlyzer-lock-instructions h1 { margin: 1rem 0; font-size: 1.65rem; font-weight: 800; line-height: 1.2; }
      .senlyzer-lock-instructions h2 { margin: 0.9rem 0; font-size: 1.25rem; font-weight: 800; line-height: 1.25; }
      .senlyzer-lock-instructions h3 { margin: 0.8rem 0; font-size: 1.05rem; font-weight: 700; }
      .senlyzer-lock-instructions p { margin: 0.75rem 0; line-height: 1.65; }
      .senlyzer-lock-instructions ul,
      .senlyzer-lock-instructions ol { margin: 0.75rem 0; padding-left: 1.35rem; }
      .senlyzer-lock-instructions ul { list-style: disc; }
      .senlyzer-lock-instructions ol { list-style: decimal; }
      .senlyzer-lock-instructions li { margin: 0.45rem 0; }
      .senlyzer-lock-instructions blockquote {
        margin: 1rem 0;
        border-left: 3px solid hsl(141 74% 42%);
        border-radius: 0.75rem;
        background: hsl(141 74% 42% / 0.1);
        padding: 0.75rem 1rem;
        font-weight: 700;
      }
      .senlyzer-lock-instructions code {
        border-radius: 0.4rem;
        background: rgba(15, 23, 42, 0.08);
        padding: 0.1rem 0.35rem;
        font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
      }
      .senlyzer-lock-instructions img {
        display: block;
        max-width: 100%;
        height: auto;
        margin: 1rem 0;
        border: 1px solid hsl(141 40% 85%);
        border-radius: 1rem;
        box-shadow: 0 18px 40px rgba(15, 23, 42, 0.12);
      }
      .senlyzer-lock-instructions strong { font-weight: 700; }
      .senlyzer-lock-instructions .copy-block {
        display: inline-flex;
        align-items: center;
        gap: 0.4rem;
        padding: 0.15rem 0.45rem 0.15rem 0.65rem;
        border-radius: 0.5rem;
        background: hsl(141 74% 42% / 0.12);
        border: 1px solid hsl(141 74% 42% / 0.32);
        font-weight: 600;
        color: hsl(141 74% 32%);
        vertical-align: middle;
        line-height: 1.4;
      }
      .senlyzer-lock-instructions .copy-block .copy-block-text { font-size: 0.875rem; }
      .senlyzer-lock-instructions .copy-block .copy-btn {
        display: inline-flex;
        align-items: center;
        padding: 0.1rem 0.45rem;
        border-radius: 0.35rem;
        background: rgba(15, 23, 42, 0.06);
        font-size: 0.7rem;
        color: hsl(141 74% 32%);
        cursor: pointer;
        border: 0;
        font-weight: 600;
        letter-spacing: 0.02em;
        transition: background 120ms ease;
      }
      .senlyzer-lock-instructions .copy-block .copy-btn:hover {
        background: rgba(15, 23, 42, 0.12);
      }
      .senlyzer-lock-toast {
        position: fixed;
        bottom: 1.5rem;
        left: 50%;
        transform: translateX(-50%);
        background: #0f172a;
        color: #ffffff;
        padding: 0.6rem 1rem;
        border-radius: 0.75rem;
        font-size: 0.8rem;
        font-weight: 600;
        box-shadow: 0 12px 30px rgba(0, 0, 0, 0.3);
        z-index: 9999;
        pointer-events: none;
      }
      .senlyzer-lock-actions {
        margin-top: 1.5rem;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.75rem;
      }
      .senlyzer-lock-form {
        width: 100%;
        max-width: 28rem;
        display: flex;
        flex-direction: column;
        gap: 0.6rem;
      }
      .senlyzer-lock-input {
        width: 100%;
        padding: 0.85rem 1rem;
        text-align: center;
        font-family: ui-monospace, monospace;
        font-size: 1.15rem;
        letter-spacing: 0.35em;
        font-weight: 600;
        background: #f8fafc;
        color: #0f172a;
        border: 1px solid hsl(141 30% 80%);
        border-radius: 0.75rem;
        outline: none;
        transition: border-color 120ms ease, box-shadow 120ms ease;
      }
      .senlyzer-lock-input::placeholder { letter-spacing: 0.05em; color: #94a3b8; }
      .senlyzer-lock-input:focus {
        border-color: hsl(141 74% 42%);
        box-shadow: 0 0 0 3px hsl(141 74% 42% / 0.18);
      }
      .senlyzer-lock-input:disabled { opacity: 0.6; cursor: not-allowed; }
      .senlyzer-lock-btn-submit {
        width: 100%;
        padding: 0.85rem 1rem;
        background: hsl(141 74% 38%);
        color: #ffffff;
        font-weight: 700;
        font-size: 0.95rem;
        border: 0;
        border-radius: 0.75rem;
        cursor: pointer;
        transition: background 120ms ease, opacity 120ms ease;
      }
      .senlyzer-lock-btn-submit:hover:not(:disabled) { background: hsl(141 74% 32%); }
      .senlyzer-lock-btn-submit:disabled { opacity: 0.45; cursor: not-allowed; }
      .senlyzer-lock-status {
        margin-top: 0.5rem;
        font-size: 0.8rem;
        color: #dc2626;
        text-align: center;
      }
      .senlyzer-lock-attempts {
        margin-top: 0.25rem;
        font-size: 0.75rem;
        color: #64748b;
        text-align: center;
      }
      @keyframes senlyzer-shake-kf {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-6px); }
        75% { transform: translateX(6px); }
      }
      .senlyzer-shake { animation: senlyzer-shake-kf 0.4s ease-in-out; }
    `}</style>
  )
}
