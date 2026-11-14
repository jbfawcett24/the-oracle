import { css } from '@emotion/react'

const arrowRotations = {
  left: 180,
  up: -90,
  right: 0,
  down: 90,
}

export default function ArrowButton({ onClick, direction = 'up', text }) {
  const rotation = arrowRotations[String(direction).toLowerCase()] ?? 0

  return (
    <button
      type="button"
      onClick={() => onClick?.()}
      aria-label={text}
      title={text}
      css={css`
        align-items: center;
        background: transparent;
        border: 0;
        cursor: pointer;
        display: inline-flex;
        justify-content: center;
        min-height: 4rem;
        min-width: 4rem;
        overflow: visible;
        padding: 0.5rem;
        pointer-events: auto;
        position: relative;
        z-index: 2;

        &:hover {
          background: transparent;
        }

        &:hover > .arrow-button__label {
          opacity: 1;
          transform: translate(-50%, 0);
          visibility: visible;
        }
      `}
    >
      <img
        src="/Button_Frame.webp"
        alt=""
        aria-hidden="true"
        css={css`
          height: 100%;
          left: 0;
          object-fit: contain;
          pointer-events: none;
          position: absolute;
          top: 0;
          width: 100%;
          z-index: 0;
        `}
      />

      <span
        aria-hidden="true"
        css={css`
          display: block;
          height: 2.25rem;
          position: relative;
          transform: rotate(${rotation}deg);
          width: 2.25rem;
          z-index: 1;
        `}
      >
        <img
          src="/Button_Arrow.webp"
          alt=""
          css={css`
            display: block;
            height: 100%;
            object-fit: contain;
            width: 100%;
          `}
        />
      </span>

      <span
        className="arrow-button__label"
        role="tooltip"
        css={css`
          background: #111;
          bottom: calc(100% + 0.5rem);
          color: white;
          left: 50%;
          max-width: 14rem;
          opacity: 0;
          padding: 0.35rem 0.6rem;
          pointer-events: none;
          position: absolute;
          transform: translate(-50%, -0.25rem);
          transition: opacity 150ms ease, transform 150ms ease;
          visibility: hidden;
          white-space: nowrap;
          z-index: 3;
        `}
      >
        {text}
      </span>
    </button>
  )
}
