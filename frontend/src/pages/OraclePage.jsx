import { useState } from 'react'
import { css } from '@emotion/react'
import ArrowButton from '../components/ArrowButton'

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  (import.meta.env.DEV ? 'http://localhost:3001/api' : '/api')
const API_URL = `${API_BASE_URL.replace(/\/$/, '')}/oracle`

export default function OraclePage({
  history,
  setHistory,
  playerFacts,
  setPlayerFacts,
  currentMonth,
  toTown,
  toFarm
}) {
  const [message, setMessage] = useState('')
  const solution = Array.isArray(currentMonth?.monthlySolution)
    ? currentMonth.monthlySolution[0]
    : currentMonth?.monthlySolution || ''
  const [isSending, setIsSending] = useState(false)
  const [error, setError] = useState('')
  const [temporaryOracleMessage, setTemporaryOracleMessage] = useState(null)

  async function sendMessage(event) {
    event.preventDefault()

    const trimmedMessage = message.trim()
    if (!trimmedMessage || isSending) return

    const monthCorruption = Number(currentMonth?.corruption) || 0
    setIsSending(true)
    setError('')
    setTemporaryOracleMessage(null)

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: trimmedMessage,
          solution,
          history,
          playerFacts,
          corruption: monthCorruption,
          currentMonth: currentMonth.monthName
        }),
      })

      if (response.status === 502) {
        const responseText = await response.text()
        let data

        try {
          data = JSON.parse(responseText)
        } catch {
          data = { message: responseText }
        }

        setTemporaryOracleMessage(getOracleMessage(data))
        return
      }

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`)
      }

      const data = await response.json()
      const oracleMessage = getOracleMessage(data)
      const nextHistory = [
        ...history,
        { role: 'user', content: trimmedMessage },
        { role: 'assistant', content: oracleMessage },
      ]

      setHistory(nextHistory)

      if (Array.isArray(data.extractedFacts)) {
        setPlayerFacts((currentFacts) => [
          ...new Set([...currentFacts, ...data.extractedFacts]),
        ])
      }

      setMessage('')
    } catch (requestError) {
      setError(requestError.message || 'Unable to reach the Oracle.')
    } finally {
      setIsSending(false)
    }
  }

  function getOracleMessage(data) {
    if (typeof data === 'string') return data
    if (typeof data.message === 'string') return data.message
    if (typeof data.response === 'string') return data.response
    if (typeof data.reply === 'string') return data.reply
    if (typeof data.error === 'string') return data.error
    return JSON.stringify(data)
  }

  const latestOracleEntry = [...history]
    .reverse()
    .find((entry) => entry.role === 'assistant')
  const latestOracleMessage = temporaryOracleMessage ?? latestOracleEntry?.content

  return (
    <main
      css={css`
        background: url('/TheOracle.webp') center center / cover no-repeat;
        color: #f4f1e8;
        min-height: 100dvh;
        overflow: hidden;
        position: relative;
      `}
    >
      <div
        css={css`
          display: flex;
          justify-content: space-around;
          position: relative;
          z-index: 3;
        `}
      >
        <ArrowButton direction="up" text="farm" onClick={toFarm} />
        <ArrowButton direction="up" text="town" onClick={toTown} />
      </div>

      <div
        aria-hidden="true"
        css={css`
          background: linear-gradient(
            to top,
            rgba(31, 33, 35, 0.94) 0%,
            rgba(42, 44, 46, 0.78) 20%,
            rgba(52, 53, 54, 0.48) 55%,
            rgba(52, 53, 54, 0.16) 82%,
            rgba(52, 53, 54, 0) 100%
          );
          bottom: 0;
          height: 62%;
          left: 0;
          pointer-events: none;
          position: absolute;
          width: 100%;
          z-index: 1;
        `}
      />

      <section
        aria-live="polite"
        css={css`
          bottom: 26%;
          left: 50%;
          max-width: min(42rem, 80vw);
          position: absolute;
          text-align: center;
          transform: translateX(-50%);
          width: 100%;
          z-index: 2;
        `}
      >
        {latestOracleMessage && (
          <p
            key={latestOracleMessage}
            css={css`
              animation: oracle-solidify 1.8s ease-out both;
              font-size: clamp(1.1rem, 2.5vw, 1.7rem);
              line-height: 1.45;
              text-shadow: 0 2px 5px rgba(0, 0, 0, 0.85);

              @keyframes oracle-solidify {
                from {
                  filter: blur(0.8rem);
                  opacity: 0;
                  transform: translateY(0.75rem) scale(1.04);
                }

                to {
                  filter: blur(0);
                  opacity: 1;
                  transform: translateY(0) scale(1);
                }
              }

              @media (prefers-reduced-motion: reduce) {
                animation: none;
              }
            `}
          >
            {latestOracleMessage}
          </p>
        )}
      </section>

      <form
        onSubmit={sendMessage}
        css={css`
          align-items: center;
          bottom: 1.25rem;
          display: flex;
          gap: 0.5rem;
          justify-content: center;
          left: 50%;
          position: absolute;
          transform: translateX(-50%);
          width: min(42rem, calc(100% - 2rem));
          z-index: 2;
        `}
      >
        <label
          htmlFor="oracle-message"
          css={css`
            clip: rect(0, 0, 0, 0);
            height: 1px;
            overflow: hidden;
            position: absolute;
            white-space: nowrap;
            width: 1px;
          `}
        >
          Ask the Oracle
        </label>
        <input
          id="oracle-message"
          autoComplete="off"
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          disabled={isSending}
          placeholder="Ask the Oracle..."
          css={css`
            background: rgba(18, 19, 20, 0.82);
            border: 1px solid rgba(244, 241, 232, 0.65);
            border-radius: 0.25rem;
            color: inherit;
            font: inherit;
            min-width: 0;
            padding: 0.75rem 1rem;
            width: 100%;

            &::placeholder {
              color: rgba(244, 241, 232, 0.7);
            }

            &:focus {
              border-color: #f4f1e8;
              outline: 2px solid rgba(244, 241, 232, 0.3);
              outline-offset: 2px;
            }
          `}
        />
        <button
          type="submit"
          disabled={isSending || !message.trim()}
          css={css`
            background: #f4f1e8;
            border: 0;
            border-radius: 0.25rem;
            color: #1f2123;
            cursor: pointer;
            font: inherit;
            padding: 0.75rem 1rem;
            white-space: nowrap;

            &:disabled {
              cursor: not-allowed;
              opacity: 0.55;
            }
          `}
        >
          {isSending ? 'Sending...' : 'Speak'}
        </button>
      </form>

      {error && (
        <p
          role="alert"
          css={css`
            bottom: 5.5rem;
            color: #ffd4d4;
            left: 50%;
            position: absolute;
            text-align: center;
            transform: translateX(-50%);
            width: min(42rem, calc(100% - 2rem));
            z-index: 2;
          `}
        >
          {error}
        </p>
      )}
    </main>
  )
}
