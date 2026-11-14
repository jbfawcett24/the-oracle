import { css } from '@emotion/react'
import { useState } from 'react'

const page = css`
  position: relative;
  display: grid;
  place-items: center;
  overflow: hidden;
  width: 100vw;
  height: 100vh;
`

const background = css`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
`

const panel = css`
  position: relative;
  z-index: 1;
  width: min(70vw, 640px);
  aspect-ratio: 1277 / 1192;
`

const panelImage = css`
  display: block;
  width: 100%;
  height: 100%;
  object-fit: contain;
`

const buttonImage = css`
  display: block;
  width: 100%;
  height: auto;
`

const usernameInput = css`
  position: absolute;
  top: 34%;
  left: 50%;
  width: 42%;
  padding: 8px 12px;
  border: 3px solid #332318;
  border-radius: 6px;
  background: #fff1c7;
  color: #332318;
  font: inherit;
  text-align: center;
  transform: translateX(-50%);

  &:focus {
    outline: 3px solid #fff1c7;
    outline-offset: 2px;
  }
`

const newGameButton = css`
  position: absolute;
  top: 18%;
  left: 50%;
  width: 42%;
  padding: 0;
  border: 0;
  background: transparent;
  transform: translateX(-50%);
  cursor: pointer;

  &:hover,
  &:focus-visible {
    filter: brightness(1.12);
  }

  &:focus-visible {
    outline: 3px solid #fff1c7;
    outline-offset: 4px;
  }
`

export default function MenuPage({ setUsername }) {
  const [nameInput, setNameInput] = useState('')

  function startGame() {
    const trimmedName = nameInput.trim()
    if (trimmedName) setUsername(trimmedName)
  }

  return (
    <main css={page}>
      <img css={background} src="/HomePage.webp" alt="" />

      <section css={panel} aria-label="Main menu">
        <img css={panelImage} src="/MenuPanel.webp" alt="" />
        <button type="button" css={newGameButton} onClick={startGame}>
          <img css={buttonImage} src="/NewGameButton.webp" alt="New game" />
        </button>
        <input
          css={usernameInput}
          type="text"
          value={nameInput}
          onChange={(event) => setNameInput(event.target.value)}
          placeholder="Enter your name"
          aria-label="Username"
        />
      </section>
    </main>
  )
}
