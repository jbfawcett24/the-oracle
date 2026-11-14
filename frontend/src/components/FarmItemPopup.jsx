import { css } from '@emotion/react'
import { useEffect, useRef, useState } from 'react'

const popup = css`
  position: fixed;
  z-index: 5;
  top: 50%;
  left: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  width: min(518px, 90vw);
  padding: 36px;
  border: 0;
  border-radius: 36px;
  background: url('/Scroll.webp') center / 100% 100% no-repeat;
  box-shadow: 0 5px 12px rgba(42, 25, 9, 0.4);
  transform: translate(-50%, -50%);
  pointer-events: auto;
  cursor: default;
`

const closeButton = css`
  position: absolute;
  top: 18px;
  right: -5px;
  display: grid;
  place-items: center;
  width: 60px;
  padding: 0;
  border: 0;
  background: transparent;
  cursor: pointer;

  &:focus-visible {
    outline: 2px solid #332318;
    outline-offset: 2px;
  }

  &:hover img,
  &:focus-visible img {
    filter: brightness(1.15);
  }

  img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
`

const option = css`
  display: grid;
  place-items: center;
  width: 140px;
  padding: 6px;
  border: 3px solid transparent;
  border-radius: 18px;
  background: transparent;
  cursor: pointer;
  transform: translateY(10px);

  &:nth-of-type(2) {
    transform: translateY(20.5px);
  }

  &:nth-of-type(3) {
    transform: translateY(20.5px);
  }

  &:nth-of-type(4) {
    transform: translateY(2.5px);
  }

  &:hover,
  &:focus-visible {
    outline: none;
  }

  &:hover img,
  &:focus-visible img {
    filter: brightness(1.22) saturate(1.1) drop-shadow(3px 5px 4px rgba(42, 25, 9, 0.45));
  }

  img {
    display: block;
    width: 60px;
    height: 136px;
    object-fit: contain;
    filter: drop-shadow(3px 5px 4px rgba(42, 25, 9, 0.45));
  }
`

const resourceOption = css`
  display: grid;
  align-items: center;
  grid-template-columns: 60px auto auto;
  grid-template-rows: auto auto;
  gap: 8px;
  width: auto;
  padding: 8px;

  > img {
    display: block;
    width: 60px;
    height: 136px;
    object-fit: contain;
    grid-column: 1;
    grid-row: 1;
    transform: translateY(20px);
  }

  .quantity-controls {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    grid-column: 2;
    grid-row: 1;
    transform: translateY(25px);
  }

  .quantity-buttons {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .quantity-controls button {
    display: grid;
    place-items: center;
    width: 42px;
    height: 34px;
    padding: 0;
    border: 0;
    background: transparent;
    cursor: pointer;
  }

  .quantity-controls button:hover img,
  .quantity-controls button:focus-visible img {
    filter: brightness(1.15);
  }

  .quantity-controls button:focus-visible {
    outline: 2px solid #332318;
    outline-offset: 2px;
  }

  > button {
    grid-column: 3;
    grid-row: 1 / 3;
    transform: translateX(35px);
    padding: 6px 12px;
    border: 2px solid #332318;
    border-radius: 4px;
    background: #c58a4a;
    color: #fff3d1;
    cursor: pointer;
    font: inherit;
    font-weight: 700;
  }

  > button:hover {
    background: #ad7137;
  }

  .quantity-controls img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: contain;
  }

  .quantity-value {
    min-width: 2ch;
    color: #332318;
    font: inherit;
    font-weight: 700;
    text-align: center;
  }
`

export default function FarmItemPopup({
  item,
  items,
  onSelect,
  onClose,
  quantitySelector = false,
  }) {
  const popupRef = useRef(null)
  const [quantity, setQuantity] = useState(1)

  useEffect(() => {
    function handlePointerDown(event) {
      if (!popupRef.current?.contains(event.target)) {
        onClose()
      }
    }

    document.addEventListener('pointerdown', handlePointerDown)
    return () => document.removeEventListener('pointerdown', handlePointerDown)
  }, [onClose])

  return (
    <div
      ref={popupRef}
      css={popup}
      aria-label="Choose a crop"
      onClick={(event) => event.stopPropagation()}
    >
      <button
        type="button"
        css={closeButton}
        onClick={onClose}
        aria-label="Close crop selection"
      >
        <img src="../../public/ButtonClose.webp" alt="" />
      </button>

      {items.map((seed) => quantitySelector ? (
        <div key={seed.id} css={resourceOption}>
          <img src={seed.image} alt={seed.name} />
          <div className="quantity-controls" aria-label="Amount">
            <span className="quantity-value" aria-live="polite">{quantity}</span>
            <div className="quantity-buttons">
              <button
                type="button"
                onClick={() => setQuantity((currentQuantity) => currentQuantity + 1)}
                aria-label="Add amount"
              >
                <img src="/AddButton.webp" alt="" />
              </button>
              <button
                type="button"
                onClick={() => setQuantity((currentQuantity) => Math.max(1, currentQuantity - 1))}
                aria-label="Subtract amount"
              >
                <img src="/SubtractButton.webp" alt="" />
              </button>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onSelect(seed, quantity)}
          >
            Use amount
          </button>
        </div>
      ) : (
        <button
          key={seed.id}
          type="button"
          css={option}
          onClick={() => onSelect(seed)}
          aria-label={`Plant ${seed.name}`}
          aria-pressed={item?.id === seed.id}
        >
          <img
            src={seed.packet ?? seed.image}
            alt={seed.packet ? `${seed.name} seed packet` : seed.name}
          />
        </button>
      ))}
    </div>
  )
}
