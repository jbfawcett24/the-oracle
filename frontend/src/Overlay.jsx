import { useEffect, useState } from 'react'
import { css, Global } from '@emotion/react'
import ArrowButton from './components/ArrowButton'

function titleCase(value) {
  return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase()
}

export default function Overlay({
  toOracle,
  toTown,
  toFarm,
  screen,
  month,
  canAdvanceMonth,
  nextMonthProblem,
  initialProblem,
  onInitialProblemClose,
  toNextMonth,
  children,
}) {
  const [problemPopup, setProblemPopup] = useState(initialProblem ?? null)

  function closeProblemPopup() {
    setProblemPopup(null)
    onInitialProblemClose?.()
  }

  function handleNextMonth() {
    toNextMonth()
    setProblemPopup(nextMonthProblem)
  }

  useEffect(() => {
    function handleKeyDown(event) {
      const navigation = {
        ArrowLeft: screen !== 'farm' ? toFarm : null,
        ArrowRight: screen !== 'town' ? toTown : null,
        ArrowDown: toOracle,
      }
      const destination = navigation[event.key]

      if (!destination) return

      event.preventDefault()
      destination()
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [screen, toFarm, toOracle, toTown])

  return (
    <>
      <Global
        styles={css`
          @import url('https://fonts.googleapis.com/css2?family=Geist+Pixel&display=swap');
        `}
      />
      <div
        css={css`
          left: 0;
          font-family: 'Geist Pixel', sans-serif;
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
            <div
              css={css`
                position: fixed;
                left: 20px;
                top: 50%;
                transform: translateY(-50%);
                pointer-events: auto;
              `}
            >
              <ArrowButton
                direction='left'
                text="farm"
                onClick={toFarm}
              />
            </div>
          )}

          {screen !== 'town' && (
            <div
              css={css`
                position: fixed;
                right: 0;
                top: 50%;
                transform: translateY(-50%);
                pointer-events: auto;
              `}
            >
              <ArrowButton direction="right" text="town" onClick={toTown} />
            </div>
          )}

          <div
            css={css`
              bottom: 0;
              left: 50%;
              position: fixed;
              transform: translateX(-50%);
              pointer-events: auto;
            `}
          >
            <ArrowButton direction="down" text="oracle" onClick={toOracle} />
          </div>

          {canAdvanceMonth && (
            <button
              type="button"
              onClick={handleNextMonth}
              css={css`
                bottom: 1rem;
                right: 1rem;
                background: #f4d49a;
                border: 3px solid #5a3018;
                border-radius: 6px;
                box-shadow: 3px 3px 0 rgba(42, 25, 9, 0.45);
                color: #5a3018;
                cursor: pointer;
                font-family: inherit;
                font-size: 1rem;
                font-weight: 700;
                padding: 0.75rem 1rem;
                pointer-events: auto;
                position: fixed;
                z-index: 100;

                &:hover {
                  background: #ffe2a4;
                }

                &:active {
                  box-shadow: 1px 1px 0 rgba(42, 25, 9, 0.45);
                  transform: translate(2px, 2px);
                }
              `}
            >
              Next month
            </button>
          )}
        </nav>
      </div>

      {problemPopup && (
        <div
          role="presentation"
          onClick={closeProblemPopup}
          css={css`
            position: fixed;
            inset: 0;
            z-index: 200;
            display: grid;
            place-items: center;
            background: rgba(42, 25, 9, 0.45);
            pointer-events: auto;
          `}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="new-month-problem"
            onClick={(event) => event.stopPropagation()}
            css={css`
              position: relative;
              width: min(32rem, calc(100vw - 2rem));
              padding: 3.5rem 2.5rem 2.5rem;
              border: 4px solid #5a3018;
              border-radius: 12px;
              background: #f4d49a;
              box-shadow: 6px 6px 0 rgba(42, 25, 9, 0.45);
              color: #5a3018;
              text-align: center;
              pointer-events: auto;
            `}
          >
            <button
              type="button"
              onClick={closeProblemPopup}
              aria-label="Close problem"
              css={css`
                position: absolute;
                top: 0.5rem;
                right: 0.75rem;
                border: 0;
                background: transparent;
                color: #5a3018;
                cursor: pointer;
                font: inherit;
                font-size: 1.75rem;
                font-weight: 700;
              `}
            >
              ×
            </button>
            <h2
              id="new-month-problem"
              css={css`
                margin-bottom: 1rem;
                font-size: clamp(1.25rem, 4vw, 1.8rem);
              `}
            >
              {month} problem
            </h2>
            <p
              css={css`
                font-size: clamp(1rem, 3vw, 1.25rem);
                font-weight: 700;
                line-height: 1.4;
              `}
            >
              {problemPopup}
            </p>
          </section>
        </div>
      )}

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
