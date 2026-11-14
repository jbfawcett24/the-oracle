/** @jsxImportSource @emotion/react */

import { css, Global } from "@emotion/react"
import { useCallback, useEffect, useState } from "react"
import { createPortal } from "react-dom"
import TypewriterText from "../../components/TypewriterText"

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  (import.meta.env.DEV ? "http://localhost:8787/api" : "/api")
const NPC_API_URL = `${API_BASE_URL.replace(/\/$/, "")}/npc`

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

export default function DialogBox({
  talkingTree,
  characterName,
  isReplaced = false,
  npcDescription = "",
  playerFacts = [],
  staticMessage = "",
  hideSprite = false,
  onClose,
  username
}) {
  const [currentNodeId, setCurrentNodeId] = useState("start")
  const [npcMessage, setNpcMessage] = useState("")
  const [npcOptions, setNpcOptions] = useState([])
  const [npcHistory, setNpcHistory] = useState([])
  const [npcDepth, setNpcDepth] = useState(0)
  const [isLoading, setIsLoading] = useState(isReplaced)
  const [npcError, setNpcError] = useState("")
  const currentNode = talkingTree?.[currentNodeId]

  const sendNpcMessage = useCallback(async (playerMessage, history, depth) => {
    setIsLoading(true)
    setNpcError("")

    try {
      const response = await fetch(NPC_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          npcDescription,
          message: playerMessage,
          history,
          depth,
          playerFacts,
        }),
      })
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || `Request failed with status ${response.status}`)
      }

      setNpcMessage(data.message || "")
      setNpcOptions(Array.isArray(data.options) ? data.options : [])
      setNpcDepth(Number.isInteger(data.depth) ? data.depth : depth + 1)
      setNpcHistory([
        ...history,
        { role: "user", content: playerMessage },
        { role: "assistant", content: data.message || "" },
      ])
    } catch (error) {
      setNpcError(error.message || "Unable to reach the NPC.")
    } finally {
      setIsLoading(false)
    }
  }, [npcDescription, playerFacts])

  useEffect(() => {
    if (!isReplaced) return undefined

    const request = window.setTimeout(() => {
      sendNpcMessage("The player approaches you and greets you.", [], 0)
    }, 0)

    return () => window.clearTimeout(request)
  }, [isReplaced, sendNpcMessage])

  if (!staticMessage && !isReplaced && !currentNode) {
    return null
  }

  function chooseDialogue(choice) {
    setCurrentNodeId(choice.next)
  }

  function chooseNpcOption(option) {
    if (!isLoading) sendNpcMessage(option, npcHistory, npcDepth)
  }

  const displayedNpcText = isLoading && !npcMessage ? "..." : npcError || npcMessage

  function replaceUsername(text) {
    if (typeof text !== "string") {
      return text;
    }

    return text.replace(/\{\{username\}\}/g, username ?? "");
  }
  const resolvedText = currentNode
    ? replaceUsername(currentNode.text)
    : "";

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
      {!hideSprite && <div
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
      />}

      <h2>{characterName}</h2>
      <p css={{ margin: "0.5rem 0 1rem" }}>
        {staticMessage ? (
          <TypewriterText key={staticMessage} text={staticMessage} />
        ) : isReplaced ? (
          <TypewriterText
            key={`${npcDepth}-${displayedNpcText}`}
            text={displayedNpcText}
          />
        ) : (
          <TypewriterText
            key={`${currentNodeId}-${currentNode.text}`}
            text={resolvedText}
          />
        )}
      </p>

      <div css={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
        {!staticMessage && (isReplaced ? npcOptions : currentNode.choices)?.length > 0 ? (
          (isReplaced ? npcOptions : currentNode.choices).map((choice) => (
            <button
              key={isReplaced ? choice : `${choice.next}-${choice.text}`}
              css={dialogButton}
              disabled={isReplaced && isLoading}
              onClick={() => isReplaced ? chooseNpcOption(choice) : chooseDialogue(choice)}
            >
              {isReplaced ? choice : replaceUsername(choice.text)}
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
