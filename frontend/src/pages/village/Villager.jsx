

export default function Villager({ name }){
    const m1Dialogue = {
        "Jarnathan": {
            start: {
                text: "Oh hello! You must be new around here. My name's Jarnathan, and I'm the mayor of this small village. Have you been to see the Oracle yet? It's one of the best things about our town!",
                choices: [
                    {
                        text: "What's the name of this town?",
                        next: "townName"
                    },
                    {
                        text: `Hello Jarnathan! My name is ${"name of user"}`,
                        next: "userName"
                    },
                    {
                        text: "What's the Oracle?",
                        next: "whatIsOracle"
                    }
                ]

            },
            townName: {
                text: "Oh, uhm. I'm not sure actually! I mostly forgot. I'm sure you could ask the Oracle though!"
            }
        }
    }



    switch (name) {
        case "Jarnathan":
            return(
                <div
                    css={{
                        hei
                    }}>

                </div>
            )
    
        case "Meredeth":

            break;
        case "Herm":

            break;
        default:
            break;
    }
}