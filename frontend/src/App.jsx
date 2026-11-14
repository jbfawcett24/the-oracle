import { useState } from 'react'
import OraclePage from './pages/OraclePage'
import './App.css'
import FarmPage from './pages/FarmPage'
import Overlay from './Overlay'
import Village from './pages/village/Village'

function App() {
  // setScreen will be used when the other screens are added.
  // eslint-disable-next-line no-unused-vars
  const [screen, setScreen] = useState("farm") // town, farm, oracle
  const [chatHistory, setChatHistory] = useState([])
  const [playerFacts, setPlayerFacts] = useState([])
  const [corruption, setCorruption] = useState(0)
  const [planted, setPlanted] = useState({})
  const [gameState, setGameState] = useState({
      monthName: "January",
      monthlyIssue: "",
      monthlySolution: "",
      itemsNeeded: "",
      corruption: "",
      dialogue: {
        January: {
            Jarnathan: {
                start: {
                    id: "start",
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
                    id: "townName",
                    text: "Oh, uhm. I'm not sure actually! I mostly forgot. I'm sure you could ask the Oracle though!",
                    next: "whatIsOracle",
                    choices: []
                }
            }
        }
      }
    }
  )

  function updateGameState(key, value){
    setGameState(previousState =>({
      ...previousState,
      [key]: value,
    }))
  }


  const toOracle = () => setScreen('oracle')
  const toFarm = () => setScreen('farm')
  const toTown = () => setScreen('town')


  switch (screen) {
    case ("town"):
      return (
        <Overlay
          month={gameState.monthName}
          screen={screen}
          toOracle={toOracle}
          toFarm={toFarm}
          toTown={toTown}
        >
          <>
            <Village
              currentMonth={gameState.monthName}
              gameState={gameState}
            >
              
            </Village>
          </>
        </Overlay>
      )

    case ("farm"):
      return (
        <Overlay
          month="January"
          screen={screen}
          toOracle={toOracle}
          toFarm={toFarm}
          toTown={toTown}
        >
          <FarmPage
            planted={planted}
            setPlanted={setPlanted} />
        </Overlay>
      )

    case ("oracle"):
      return (
        <OraclePage
          toFarm={toFarm}
          toTown={toTown}
          history={chatHistory}
          setHistory={setChatHistory}
          playerFacts={playerFacts}
          setPlayerFacts={setPlayerFacts}
          corruption={corruption}
          setCorruption={setCorruption}
        />
      )

    default:
      return (<>beans</>)
  }
}

export default App
