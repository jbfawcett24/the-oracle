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
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 8px;
  width: 180px;
  padding: 8px;

  img {
    display: block;
    width: 110px;
    height: 110px;
    object-fit: contain;
  }

  label {
    color: #332318;
    font-weight: 700;
  }

  input {
    width: 60px;
    margin-left: 6px;
    padding: 4px;
    border: 2px solid #332318;
    border-radius: 4px;
    background: #fff3d1;
    color: #332318;
    font: inherit;
    text-align: center;
  }

  button {
    padding: 6px 12px;
    border: 2px solid #332318;
    border-radius: 4px;
    background: #c58a4a;
    color: #fff3d1;
    cursor: pointer;
    font: inherit;
    font-weight: 700;
  }

  button:hover {
    background: #ad7137;
  }
`

export default function FarmItemPopup({
  item,
  items,
  onSelect,
  onClose,
  quantitySelector = false,
  maxQuantity = 1,
}) {
  const popupRef = useRef(null)
  const [quantity, setQuantity] = useState(1)

  const safeMaxQuantity = Math.max(1, maxQuantity)

  function updateQuantity(value) {
    const nextQuantity = Number(value) || 1
    setQuantity(Math.min(safeMaxQuantity, Math.max(1, nextQuantity)))
  }

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
          <label>
            Amount
            <input
              type="number"
              min="1"
              max={safeMaxQuantity}
              value={quantity}
              onChange={(event) => updateQuantity(event.target.value)}
            />
          </label>
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
