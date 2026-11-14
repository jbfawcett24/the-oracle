/** @jsxImportSource @emotion/react */

import { useState } from "react"
import DialogBox from "./DialogBox"



export default function Villager({ name, currentMonth, gameState }){
    const [isTalking, setIsTalking] = useState(false)

    const talkingTree = gameState?.dialogue?.[currentMonth]?.[name]

    function handleClick(){
        setIsTalking(true)
    }

    const dialogBox = isTalking && talkingTree ? (
        <DialogBox
            key={`${currentMonth}-${name}`}
            talkingTree={talkingTree}
            characterName={name}
            onClose={() => setIsTalking(false)}
        />
    ) : null

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
                    {dialogBox}
                </div>
            )
    
        case "Meredeth":

            return(
                <div
                    onClick={handleClick}
                    css={{
                        height: "100px",
                        width: "50px",
                        border: "solid black 2px",
                        position: "absolute",
                        top: "75vh",
                        left: "48vw",
                        backgroundColor: "red"
                    }}>
                    {dialogBox}
                </div>
            )
        case "Herm":
            return(
                <div
                    onClick={handleClick}
                    css={{
                        height: "100px",
                        width: "50px",
                        border: "solid black 2px",
                        position: "absolute",
                        top: "40vh",
                        right: "25vw",
                        backgroundColor: "red"
                    }}>
                    {dialogBox}

                </div>
            )
        default:
            break;
    }
}
