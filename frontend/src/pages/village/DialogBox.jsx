/** @jsxImportSource @emotion/react */

import { useState } from "react"
import { createPortal } from "react-dom"
import TypewriterText from "../../components/TypewriterText"

const characterImages = {
    Jarnathan: "/Johnathan.webp",
    Meredeth: "/Meredith.webp",
    Herm: "/Herm.webp",
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
                border: "4px solid #2b1a12",
                borderRadius: "8px",
                color: "#2b1a12",
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
                    bottom: "calc(40% + 0.5rem)",
                    width: "200px",
                    height: "250px",
                    zIndex: -2,
                    backgroundImage: `url('${characterImages[characterName]}')`,
                    backgroundSize: "contain",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                }}
            />

            <strong>{characterName}</strong>
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
                            onClick={() => chooseDialogue(choice)}
                        >
                            {choice.text}
                        </button>
                    ))
                ) : (
                    <button onClick={onClose}>End conversation</button>
                )}
            </div>
        </div>
    )

    return createPortal(dialog, document.body)
}
