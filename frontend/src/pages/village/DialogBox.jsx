/** @jsxImportSource @emotion/react */

import { useState } from "react"
import { createPortal } from "react-dom"
import TypewriterText from "../../components/TypewriterText"

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
                backgroundColor: "#f4d49a",
                color: "#2b1a12",
                boxShadow: "4px 4px 0 rgba(0, 0, 0, 0.35)",
            }}
        >
            <div
                aria-label={`${characterName} sprite`}
                css={{
                    position: "absolute",
                    right: "1rem",
                    bottom: "calc(100% + 0.5rem)",
                    width: "96px",
                    height: "96px",
                    border: "3px solid #2b1a12",
                    backgroundColor: "red",
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
