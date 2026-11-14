import { css } from '@emotion/react'
import Villager from "./Villager"

const page = css`
    position: fixed;
    inset: 0;
    overflow: hidden;
    width: 100vw;
    height: 100vh;
    background: #5c371c;
`

const villageFrame = css`
    position: relative;
    width: 100%;
    height: 100%;
`

const villageImage = css`
    display: block;
    width: 100%;
    height: 100%;
    object-fit: fill;
`

export default function Village({ currentMonth, gameState, npcDescriptions, playerFacts }) {
    return(
        <main css={page}>
            <section css={villageFrame}>
                <img css={villageImage} src="/Village.webp" alt="Pixel-art village" />
                <Villager 
                    name={"Jarnathan"}
                    currentMonth={currentMonth}
                    gameState={gameState}
                    npcDescriptions={npcDescriptions}
                    playerFacts={playerFacts}
                >

                </Villager>
                <Villager 
                    name={"Meredeth"}
                    currentMonth={currentMonth}
                    gameState={gameState}
                    npcDescriptions={npcDescriptions}
                    playerFacts={playerFacts}
                    >

                </Villager>
                <Villager 
                    name={"Herm"}
                    currentMonth={currentMonth}
                    gameState={gameState}
                    npcDescriptions={npcDescriptions}
                    playerFacts={playerFacts}
                    >

                </Villager>
            </section>
        </main>
    )
}
