import { useState } from 'react'
import { css } from '@emotion/react'

const API_URL = 'http://localhost:3001/api/oracle'

export default function OraclePage({
  history,
  setHistory,
  playerFacts,
  setPlayerFacts,
  corruption,
  setCorruption,
  toTown,
  toFarm
}) {
  const [message, setMessage] = useState('')
  const [solution] = useState('use 4 units of fertilizer')
  const [isSending, setIsSending] = useState(false)
  const [error, setError] = useState('')

  async function sendMessage(event) {
    event.preventDefault()

    const trimmedMessage = message.trim()
    if (!trimmedMessage || isSending) return

    const nextCorruption = Math.min(1, corruption + 0.1)
    setIsSending(true)
    setError('')

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: trimmedMessage,
          solution,
          history,
          playerFacts,
          corruption: nextCorruption,
        }),
      })

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

      setCorruption(Math.min(1, data.corruption ?? nextCorruption))
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
    if (typeof data.message === 'string') return data.message
    if (typeof data.response === 'string') return data.response
    if (typeof data.reply === 'string') return data.reply
    return JSON.stringify(data)
  }

  return (
    <main>
      <div
        css={css`
          display: flex;
          justify-content: space-around;
        `}
      >
        <button onClick={toFarm}>↑</button>
        <button onClick={toTown}>↑</button>
      </div>
      <h1>The Oracle</h1>

      <section aria-live="polite">
        {history.map((entry, index) => (
          <p key={entry.id ?? index}>
            <strong>{entry.role === 'user' ? 'You' : 'Oracle'}:</strong>{' '}
            {entry.content}
          </p>
        ))}
      </section>

      <p>Corruption: {corruption}</p>

      <form onSubmit={sendMessage}>
        <label htmlFor="oracle-message">Ask the Oracle</label>
        <input
          id="oracle-message"
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          disabled={isSending}
        />
        <button type="submit" disabled={isSending || !message.trim()}>
          {isSending ? 'Sending...' : 'Send'}
        </button>
      </form>

      {error && <p role="alert">{error}</p>}
    </main>
  )
}
