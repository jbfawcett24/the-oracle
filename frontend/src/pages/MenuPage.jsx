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

const title = css`
  position: absolute;
  z-index: 1;
  top: 5vh;
  left: 50%;
  width: min(70vw, 700px);
  height: auto;
  transform: translateX(-50%);
`

const panel = css`
  position: relative;
  z-index: 1;
  width: min(70vw, 350px);
  aspect-ratio: 1277 / 894;
  transform: translateY(10vh);
`

const panelImage = css`
  display: block;
  width: 100%;
  height: 100%;
  object-fit: fill;
`

const buttonImage = css`
  display: block;
  width: 100%;
  height: auto;
`

const usernameInput = css`
  position: absolute;
  top: 60%;
  left: 50%;
  width: 70%;
  padding: 8px 12px;
  border: 3px solid #332318;
  border-radius: 6px;
  background: #fff1c7;
  color: #332318;
  font: inherit;
  text-align: center;
  transition: box-shadow 500ms ease;
  transform: translateX(-50%);

  &:focus {
    outline: 3px solid #fff1c7;
    outline-offset: 2px;
  }
`

const newGameButton = css`
  position: absolute;
  top: 20%;
  left: 50%;
  width: 75%;
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
  const [nameError, setNameError] = useState(false)

  function startGame() {
    const trimmedName = nameInput.trim()
    if (!trimmedName) {
      setNameError(true)
      window.setTimeout(() => setNameError(false), 500)
      return
    }

    setUsername(trimmedName)
  }

  return (
    <main css={page}>
      <img css={background} src="/HomePage.webp" alt="" />
      <img css={title} src="/Title.webp" alt="Game title" />

      <section css={panel} aria-label="Main menu">
        <img css={panelImage} src="/MenuPanel.webp" alt="" />
        <button type="button" css={newGameButton} onClick={startGame}>
          <img css={buttonImage} src="/NewGameButton.webp" alt="New game" />
        </button>
        <input
          css={usernameInput}
          style={{
            boxShadow: nameError
              ? '0 0 14px 4px rgba(220, 35, 35, 0.9)'
              : '0 0 0 0 rgba(220, 35, 35, 0)',
          }}
          type="text"
          value={nameInput}
          onChange={(event) => {
            setNameInput(event.target.value)
            setNameError(false)
          }}
          placeholder="Enter your name"
          aria-label="Username"
        />
      </section>
    </main>
  )
}
