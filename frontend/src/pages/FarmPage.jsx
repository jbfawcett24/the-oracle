import { useState } from 'react'
import { css } from '@emotion/react'

const crops = [
  { id: 'carrot', name: 'Carrot', packet: '/Carrot_Packet.webp', image: '/Carrot.webp' },
  { id: 'potato', name: 'Potato', packet: '/Potato_Packet.webp', image: '/Potatoes.webp' },
  { id: 'wheat', name: 'Wheat', packet: '/Wheat_Packet.webp', image: '/Wheat.webp' },
]

// Percentage positions match the five tilled fields in the widened Farm.webp.
const plotAreas = [
  { left: 25, top: 13, width: 18, height: 25 },
  { left: 44, top: 13, width: 15, height: 25 },
  { left: 25, top: 41, width: 20, height: 23 },
  { left: 46, top: 41, width: 28, height: 23 },
  { left: 25, top: 66, width: 50, height: 21 },
]

const page = css`
  position: fixed;
  inset: 0;
  overflow: hidden;
  width: 100vw;
  height: 100vh;
  color: #332318;
  background: #5c371c;
`

const packetShelf = css`
  position: absolute;
  z-index: 2;
  top: 50%;
  left: clamp(8px, 2vw, 28px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: clamp(4px, 1.2vh, 14px);
  transform: translateY(-50%);
`

const packetCard = css`
  display: block;
  width: clamp(52px, 8vw, 94px);
  padding: 0;
  border: 0;
  background: transparent;
  cursor: grab;
  user-select: none;
  transition: transform 160ms ease, filter 160ms ease;

  &:hover,
  &:focus-visible {
    filter: brightness(1.12) drop-shadow(0 6px 5px rgba(53, 29, 12, 0.4));
    transform: translateY(3px) scale(1.04);
    outline: none;
  }

  &:active {
    cursor: grabbing;
    transform: scale(0.98);
  }
`

const packetImage = css`
  display: block;
  width: 100%;
  height: clamp(76px, 13vh, 132px);
  object-fit: contain;
  filter: drop-shadow(2px 4px 3px rgba(71, 40, 17, 0.45));
`

const farmFrame = css`
  position: relative;
  overflow: hidden;
  width: 100%;
  height: 100%;
`

const farmImage = css`
  display: block;
  width: 100%;
  height: 100%;
  object-fit: fill;
`

const plot = (area, isDragTarget, hasCrop) => css`
  position: absolute;
  left: ${area.left}%;
  top: ${area.top}%;
  width: ${area.width}%;
  height: ${area.height}%;
  box-sizing: border-box;
  border: 2px dashed ${isDragTarget ? '#ffe6a1' : 'transparent'};
  border-radius: 8px;
  background: ${isDragTarget ? 'rgba(255, 231, 147, 0.26)' : 'transparent'};
  transition: background 150ms ease, border-color 150ms ease;
  pointer-events: auto;

  ${hasCrop ? 'background: rgba(71, 38, 19, 0.12);' : ''}
`

const plantedCrop = css`
  position: absolute;
  inset: 5% 7%;
  display: grid;
  place-items: center;
  pointer-events: none;

  img {
    width: min(42%, 96px);
    height: min(62%, 110px);
    object-fit: contain;
    filter: drop-shadow(2px 4px 2px rgba(42, 25, 9, 0.32));
  }
`

export default function FarmPage() {
  const [draggedCrop, setDraggedCrop] = useState(null)
  const [planted, setPlanted] = useState({})
  const [activePlot, setActivePlot] = useState(null)

  function startDragging(event, crop) {
    setDraggedCrop(crop)
    event.dataTransfer.effectAllowed = 'copy'
    event.dataTransfer.setData('text/plain', crop.id)
  }

  function dropCrop(event, plotIndex) {
    event.preventDefault()
    if (planted[plotIndex]) return

    const cropId = event.dataTransfer.getData('text/plain') || draggedCrop?.id
    const crop = crops.find((item) => item.id === cropId)

    if (crop) setPlanted((current) => ({ ...current, [plotIndex]: crop }))
    setActivePlot(null)
    setDraggedCrop(null)
  }

  return (
    <main css={page}>
      <section aria-label="Seed packets" css={packetShelf}>
        {crops.map((crop) => (
          <div
            key={crop.id}
            css={packetCard}
            draggable
            role="button"
            tabIndex={0}
            aria-label={`Drag ${crop.name} seeds to a plot`}
            onDragStart={(event) => startDragging(event, crop)}
            onDragEnd={() => {
              setDraggedCrop(null)
              setActivePlot(null)
            }}
          >
            <img css={packetImage} src={crop.packet} alt={`${crop.name} seed packet`} />
          </div>
        ))}
      </section>

      <section aria-label="Farm plots" css={farmFrame}>
        <img css={farmImage} src="/Farm.webp" alt="Pixel-art farm with tilled plots" />
        {plotAreas.map((area, index) => {
          const crop = planted[index]
          return (
            <div
              key={index}
              css={plot(area, activePlot === index && Boolean(draggedCrop), Boolean(crop))}
              onDragEnter={(event) => {
                event.preventDefault()
                if (!crop) setActivePlot(index)
              }}
              onDragOver={(event) => {
                event.preventDefault()
                event.dataTransfer.dropEffect = crop ? 'none' : 'copy'
              }}
              onDragLeave={() => setActivePlot(null)}
              onDrop={(event) => dropCrop(event, index)}
              aria-label={crop ? `${crop.name} planted` : 'Empty farm plot'}
            >
              {crop && (
                <span css={plantedCrop} title={`${crop.name} planted`}>
                  <img src={crop.image} alt={`${crop.name} crop`} />
                </span>
              )}
            </div>
          )
        })}
      </section>
    </main>
  )
}
