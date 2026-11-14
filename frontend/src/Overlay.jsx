import { css, Global } from '@emotion/react'

function titleCase(value) {
  return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase()
}

export default function Overlay({ toOracle, toTown, toFarm, screen, month, children }) {
  return (
    <>
      <Global
        styles={css`
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body { background: white; color: black; font-family: sans-serif; }
          button {
            background: white;
            border: 1px solid black;
            color: black;
            cursor: pointer;
            font: inherit;
            padding: 0.35rem 0.75rem;
          }
          button:hover { background: #f0f0f0; }
        `}
      />

      <div
        css={css`
          left: 0;
          padding: 1rem;
          position: fixed;
          right: 0;
          top: 0;
          z-index: 10;
          width: 100vw;
          height: 100vh;
          pointer-events: none;
        `}
      >
        <header
          css={css`
            position: relative;
            width: min(46vw, 460px);
            margin: 0 auto 1rem;
            color: #5a3018;
            font-family: Georgia, 'Times New Roman', serif;
            text-align: center;
          `}
        >
          <img
            src="/Info_Scroll.webp"
            alt="Information scroll"
            css={css`
              display: block;
              width: 100%;
              height: auto;
            `}
          />
          <h1
            css={css`
              position: absolute;
              top: 27%;
              left: 12%;
              width: 76%;
              color: inherit;
              font-size: clamp(1.2rem, 2.9vw, 2.2rem);
              font-weight: 700;
              line-height: 1;
              text-shadow: 1px 1px 0 rgba(255, 226, 164, 0.5);
            `}
          >
            {month}
          </h1>
          <p
            css={css`
              position: absolute;
              top: 61%;
              left: 12%;
              width: 76%;
              color: inherit;
              font-size: calc(clamp(0.79rem, 1.26vw, 1rem) + 5px);
              font-weight: 700;
              line-height: 1;
              text-shadow: 1px 1px 0 rgba(255, 226, 164, 0.5);
            `}
          >
            {titleCase(screen)}
          </p>
        </header>

        <nav
          aria-label="Screen navigation"
          css={css`
            align-items: center;
            display: flex;
            justify-content: center;
            margin: 0 auto;
            position: relative;
          `}
        >
          {screen !== 'farm' && (
            <button
              type="button"
              onClick={toFarm}
              aria-label="Go to Farm"
              css={css`
                left: 0;
                position: fixed;
                top: 50%;
                transform: translateY(-50%);
                pointer-events: auto;
              `}
            >
              ←
            </button>
          )}

          {screen !== 'town' && (
            <button
              type="button"
              onClick={toTown}
              aria-label="Go to Town"
              css={css`
                position: fixed;
                right: 0;
                top: 50%;
                transform: translateY(-50%);
                pointer-events: auto;
              `}
            >
              →
            </button>
          )}

          <button
            type="button"
            onClick={toOracle}
            aria-label="Go to Oracle"
            css={css`
              bottom: 0;
              left: 50%;
              position: fixed;
              transform: translateX(-50%);
              pointer-events: auto;
            `}
          >
            ↓
          </button>
        </nav>
      </div>

      <div
        css={css`
          position: relative;
          z-index: 0;
        `}
      >
        {children}
      </div>
    </>
  )
}
