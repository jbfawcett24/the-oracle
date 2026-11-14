/** @jsxImportSource @emotion/react */

import { css, Global } from "@emotion/react"
import { useState } from "react"
import { createPortal } from "react-dom"
import TypewriterText from "../../components/TypewriterText"

const characterImages = {
  Jarnathan: "/Johnathan.webp",
  Meredeth: "/Meredith.webp",
  Herm: "/Herm.webp",
}

const dialogButton = {
  padding: "0.5rem 0.8rem",
  border: "2px solid #2b1a12",
  borderRadius: "4px",
  backgroundColor: "#c58a4a",
  color: "#fff3d1",
  fontFamily: "Georgia, 'Times New Roman', serif",
  fontSize: "0.95rem",
  fontWeight: "700",
  cursor: "pointer",
  boxShadow: "2px 2px 0 #2b1a12",
  transition: "transform 100ms ease, background-color 100ms ease, box-shadow 100ms ease",
  ":hover": {
    backgroundColor: "#ad7137",
  },
  ":active": {
    transform: "translate(2px, 2px)",
    boxShadow: "none",
  },
}

export default function DialogBox({ talkingTree, characterName, onClose }) {
  const [currentNodeId, setCurrentNodeId] = useState("start")
  const currentNode = talkingTree?.[currentNodeId]

  if (!currentNode) {
    return null
  }

  function chooseDialogue(choice) {
    setCurrentNodeId(choice.next)
  }

  const dialog = (
    <div
      onClick={(event) => event.stopPropagation()}
      css={{
        position: "fixed",
        zIndex: 20,
        left: "50%",
        bottom: "1rem",
        width: "min(760px, calc(100vw - 2rem))",
        transform: "translateX(-50%)",
        padding: "1.25rem",
        fontFamily: "'Geist Pixel', sans-serif",
        border: "4px solid #2b1a12",
        borderRadius: "8px",
        color: "white",
        boxShadow: "4px 4px 0 rgba(0, 0, 0, 0.35)",
        isolation: "isolate",
        "&::before": {
          content: '""',
          position: "absolute",
          zIndex: -1,
          top: "-25px",
          right: "-25px",
          bottom: "-25px",
          left: "-25px",
          borderRadius: "8px",
          backgroundImage: "url('/DialogueBox.webp')",
          backgroundSize: "100% 100%",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        },
      }}
    >
      <div
        aria-label={`${characterName} sprite`}
        css={{
          position: "absolute",
          right: "1rem",
          bottom: "calc(100% - 60px)",
          width: "200px",
          height: "250px",
          zIndex: -2,
          backgroundImage: `url('${characterImages[characterName]}')`,
          backgroundSize: "contain",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />

      <h2>{characterName}</h2>
      <p css={{ margin: "0.5rem 0 1rem" }}>
        <TypewriterText
          key={`${currentNodeId}-${currentNode.text}`}
          text={currentNode.text}
        />
      </p>

      <div css={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
        {currentNode.choices?.length > 0 ? (
          currentNode.choices.map((choice) => (
            <button
              key={`${choice.next}-${choice.text}`}
              css={dialogButton}
              onClick={() => chooseDialogue(choice)}
            >
              {choice.text}
            </button>
          ))
        ) : (
          <button css={dialogButton} onClick={onClose}>
            End conversation
          </button>
        )}
      </div>
    </div>
  )

  return (
    <>
      <Global
        styles={css`
                    @import url('https://fonts.googleapis.com/css2?family=Geist+Pixel&display=swap');
                `}
      />
      {createPortal(dialog, document.body)}
    </>
  )
}
