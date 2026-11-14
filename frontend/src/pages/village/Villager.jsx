/** @jsxImportSource @emotion/react */

import { useState, useEffect } from "react"



export default function Villager({ name, currentMonth }){
    const [currentNodeId, setCurrentNodeId] = useState("start")
    const [isTalking, setIsTalking] = useState(false)

    const currentNode = 
        dialogue[currentMonth]?.[name]?.[currentNodeId]

    useEffect(() => {
        setCurrentNodeId("start");
        setIsTalking(false);
    }, [currentMonth, name]);

    function handleClick(){
        setCurrentNodeId("start")
        setIsTalking(true)
    }

    function chooseDialogue(choiceID){
        console.log(choiceID)
        setCurrentNodeId(choiceID.next)
    }

    function CreateDialogueBox(){
        if (!isTalking || !currentNode){
            return null
        }
        return(
            <>
                <div>
                    <p>{currentNode.text}</p>

                    {currentNode.choices.length > 0 ? (
                    currentNode.choices.map(choice => (
                        <button
                        key={choice.id}
                        onClick={() => chooseDialogue(choice)}
                        >
                        {choice.text}
                        </button>
                    ))
                    ) : (
                    <button onClick={() => setIsTalking(false)}>
                        End conversation
                    </button>
                    )}
                </div>
            </>

        )
    }

    function handleHover() {

    }

    switch (name) {
        case "Jarnathan":
            return(
                <div
                    onClick={handleClick}
                    css={{
                        height: "100px",
                        width: "50px",
                        border: "solid black 2px",
                        position: "absolute",
                        top: "40vh",
                        left: "25vw",
                        backgroundColor: "red"
                    }}>
                    <CreateDialogueBox />
                </div>
            )
    
        case "Meredeth":

            return(
                <div
                    css={{
                        height: "100px",
                        width: "50px",
                        border: "solid black 2px",
                        position: "absolute",
                        top: "75vh",
                        left: "48vw",
                        backgroundColor: "red"
                    }}>
                    <CreateDialogueBox />
                </div>
            )
        case "Herm":
            return(
                <div
                    css={{
                        height: "100px",
                        width: "50px",
                        border: "solid black 2px",
                        position: "absolute",
                        top: "40vh",
                        right: "25vw",
                        backgroundColor: "red"
                    }}>
                    <CreateDialogueBox />

                </div>
            )
        default:
            break;
    }
}