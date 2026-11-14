import { useEffect, useRef, useState } from 'react'
import { css } from '@emotion/react'
import FarmItemPopup from '../components/FarmItemPopup'

const crops = [
  { id: 'carrot', name: 'Carrot', packet: '/Carrot_Packet.webp', sprite: '/CarrotAssets.webp' },
  { id: 'potato', name: 'Potato', packet: '/Potato_Packet.webp', sprite: '/PotatoAssets.webp' },
  { id: 'wheat', name: 'Wheat', packet: '/Wheat_Packet.webp', sprite: '/WheatAssets.webp' },
]

const resources = {
  water: [{ id: 'water', name: 'Water', image: '/Water.webp' }],
  fertilizer: [{ id: 'fertilizer', name: 'Fertilizer', image: '/Fertilizer.webp' }],
}

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

const plot = (area) => css`
  position: absolute;
  left: ${area.left}%;
  top: ${area.top}%;
  width: ${area.width}%;
  height: ${area.height}%;
  box-sizing: border-box;
  border: 2px dashed transparent;
  border-radius: 8px;
  background: transparent;
  transition: background 150ms ease, border-color 150ms ease;
  pointer-events: auto;
  cursor: pointer;

  &:focus-visible {
    outline: none;
  }
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
  background-repeat: no-repeat;
  background-size: 400% 200%;
  filter: drop-shadow(1px 2px 1px rgba(42, 25, 9, 0.28));
`

export default function FarmPage({
  planted,
  setPlanted,
  cropStage = 0,
  monthState,
  setResources,
}) {
  const [selectedPlot, setSelectedPlot] = useState(null)
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

  const isResourceMonth = monthState?.itemsNeeded !== 'seeds'
  const availableItems = isResourceMonth
    ? resources[monthState?.itemsNeeded] ?? []
    : crops

  function selectItem(item, amount = 1) {
    if (selectedPlot === null) return

    if (isResourceMonth) {
      setResources((currentResources) => ({
        ...currentResources,
        [item.id]: (currentResources[item.id] ?? 0) + amount,
      }))
    } else {
      setPlanted(() => Object.fromEntries(
        plotAreas.map((_, index) => [index, item]),
      ))
    }
    setSelectedPlot(null)
  }

  const activeCropStage = monthState?.cropStage ?? cropStage
  const normalizedCropStage = Math.max(0, Math.min(7, Number(activeCropStage) || 0))
  const cropStagePosition = `${(normalizedCropStage % 4) * (100 / 3)}% ${Math.floor(normalizedCropStage / 4) * 100}%`

  return (
    <main css={page}>
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
              css={plot(area)}
              role="button"
              tabIndex={0}
              onClick={() => {
                if (crop && !isResourceMonth) return

                setSelectedPlot((currentPlot) => (
                  currentPlot === index ? null : index
                ))
              }}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault()
                  if (!crop || isResourceMonth) setSelectedPlot(index)
                }
              }}
              aria-label={crop ? `${crop.name} planted` : 'Empty farm plot'}
            >
              {selectedPlot === index && (!crop || isResourceMonth) && (
                <FarmItemPopup
                  item={crop}
                  items={availableItems}
                  quantitySelector={isResourceMonth}
                  onSelect={selectItem}
                  onClose={() => setSelectedPlot(null)}
                />
              )}

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
                          <span
                            key={`${crop.id}-${cropIndex}`}
                            css={plantedTile}
                            style={{
                              backgroundImage: `url(${crop.sprite})`,
                              backgroundPosition: cropStagePosition,
                            }}
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
