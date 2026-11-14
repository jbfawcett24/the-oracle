/** @jsxImportSource @emotion/react */

import { useState } from "react"
import DialogBox from "./DialogBox"



export default function Villager({ name, currentMonth, gameState, npcDescriptions, playerFacts, username }) {
  const [isTalking, setIsTalking] = useState(false)

  const talkingTree = gameState?.dialogue?.[currentMonth]?.[name]
  const isReplaced = gameState?.replacedNpcs?.includes(name)

  function handleClick() {
    setIsTalking(true)
  }

  const dialogBox = isTalking && (talkingTree || isReplaced) ? (
    <DialogBox
      key={`${currentMonth}-${name}`}
      talkingTree={talkingTree}
      characterName={name}
      isReplaced={isReplaced}
      npcDescription={npcDescriptions?.[name]}
      playerFacts={playerFacts}
      onClose={() => setIsTalking(false)}
      username={username}
    />
  ) : null

  switch (name) {
    case "Jarnathan":
      return (
        <div
          onClick={handleClick}
          css={{
            cursor: "pointer",
            height: "175px",
            width: "75px",
            position: "absolute",
            top: "40vh",
            left: "30vw",
            backgroundImage: "url('/Johnathan.webp')",
            backgroundSize: "100% auto",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
            filter: "drop-shadow(10px 8px 3px rgba(42, 25, 9, 0.45))"
          }}>
          {dialogBox}
        </div>
      )

    case "Meredeth":

      return (
        <div
          onClick={handleClick}
          css={{
            cursor: "pointer",
            height: "150px",
            width: "75px",
            position: "absolute",
            top: "75vh",
            left: "48vw",
            backgroundImage: "url('/Meredith.webp')",
            backgroundSize: "100% auto",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
            filter: "drop-shadow(10px 8px 3px rgba(42, 25, 9, 0.45))"
          }}>
          {dialogBox}
        </div>
      )
    case "Herm":
      return (
        <div
          onClick={handleClick}
          css={{
            cursor: "pointer",
            height: "150px",
            width: "75px",
            position: "absolute",
            top: "40vh",
            right: "29vw",
            backgroundImage: "url('/Herm.webp')",
            backgroundSize: "100% auto",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
            filter: "drop-shadow(10px 8px 3px rgba(42, 25, 9, 0.45))"
          }}>
          {dialogBox}

        </div>
      )
    default:
      break;
  }
}
