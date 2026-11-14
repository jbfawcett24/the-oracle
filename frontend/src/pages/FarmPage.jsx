import { useEffect, useRef, useState } from 'react'
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

const plantedCrop = (horizontalOffset, verticalOffset) => css`
  position: absolute;
  inset: 0;
  display: flex;
  flex-wrap: wrap;
  align-content: flex-start;
  justify-content: flex-start;
  overflow: hidden;
  pointer-events: none;

  ${horizontalOffset ? `margin-left: ${horizontalOffset}px; width: calc(100% - ${horizontalOffset}px);` : ''}
  ${verticalOffset ? `margin-top: ${verticalOffset}px; height: calc(100% - ${verticalOffset}px);` : ''}
`

const plantedTile = css`
  display: block;
  width: var(--crop-tile-width);
  height: var(--crop-tile-height);
  flex: 0 0 var(--crop-tile-width);
  object-fit: contain;
  filter: drop-shadow(1px 2px 1px rgba(42, 25, 9, 0.28));
`

export default function FarmPage() {
  const [draggedCrop, setDraggedCrop] = useState(null)
  const [planted, setPlanted] = useState({})
  const [activePlot, setActivePlot] = useState(null)
  const [plotLayouts, setPlotLayouts] = useState([])
  const plotRefs = useRef([])

  useEffect(() => {
    function updatePlotLayouts() {
      const baseTileWidth = Math.min(44.85, Math.max(23.92, window.innerWidth * 0.0299))
      const bottomField = plotRefs.current[4]
      const bottomRowTileWidth = bottomField && bottomField.clientHeight > 0
        ? (bottomField.clientHeight * 190) / (4 * 207)
        : baseTileWidth
      const tileWidth = Math.min(baseTileWidth, bottomRowTileWidth)
      const tileHeight = tileWidth * (207 / 190)

      setPlotLayouts(plotRefs.current.map((plotElement, index) => {
        if (!plotElement) return { count: 0, columns: 0, tileWidth, tileHeight }

        const horizontalOffset = index === 4 ? 4 : index === 2 ? 5 : index === 3 ? 20 : index === 1 ? 4 : index === 0 ? 15 : 0
        const verticalOffset = index === 0 ? 20 : index === 1 ? 20 : 0
        const availableWidth = plotElement.clientWidth - horizontalOffset
        const availableHeight = plotElement.clientHeight - verticalOffset
        const columns = Math.floor(availableWidth / tileWidth)
        const rows = Math.floor(availableHeight / tileHeight)
        const rowsToRender = index === 4 ? 4 : rows

        return { count: columns * rowsToRender, columns, tileWidth, tileHeight }
      }))
    }

    updatePlotLayouts()
    window.addEventListener('resize', updatePlotLayouts)
    const observer = new ResizeObserver(updatePlotLayouts)
    plotRefs.current.forEach((plotElement) => {
      if (plotElement) observer.observe(plotElement)
    })

    return () => {
      window.removeEventListener('resize', updatePlotLayouts)
      observer.disconnect()
    }
  }, [])

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
              ref={(plotElement) => {
                plotRefs.current[index] = plotElement
              }}
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
                (() => {
                  const layout = plotLayouts[index]

                  if (!layout?.count) return null

                  return (
                <span
                  css={plantedCrop(
                    index === 4 ? 4 : index === 2 ? 5 : index === 3 ? 20 : index === 1 ? 4 : index === 0 ? 15 : 0,
                    index === 0 ? 20 : index === 1 ? 20 : 0,
                  )}
                  title={`${crop.name} planted`}
                  role="img"
                  aria-label={`${crop.name} crop planted across the plot`}
                  style={{
                    '--crop-tile-width': `${layout.tileWidth}px`,
                    '--crop-tile-height': `${layout.tileHeight}px`,
                  }}
                >
                  {Array.from({ length: layout.count }, (_, cropIndex) => (
                    ((index === 4 && cropIndex === layout.count - layout.columns)
                      || (index === 2 && cropIndex === layout.columns - 1)
                      || (index === 3 && cropIndex === layout.count - 1)) ? (
                      <span
                        key={`empty-plot-${index}-${cropIndex}`}
                        css={plantedTile}
                        aria-label="Empty plot space"
                      />
                    ) : (
                      <img
                        key={`${crop.id}-${cropIndex}`}
                        css={plantedTile}
                        src={crop.image}
                        alt=""
                      />
                    )
                  ))}
                </span>
                  )
                })()
              )}
            </div>
          )
        })}
      </section>
    </main>
  )
}
