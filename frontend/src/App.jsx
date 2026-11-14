import { useEffect, useState } from 'react'
import OraclePage from './pages/OraclePage'
import './App.css'
import FarmPage from './pages/FarmPage'
import Overlay from './Overlay'
import Village from './pages/village/Village'

function App() {
  const [screen, setScreen] = useState("farm") // town, farm, oracle
  const [chatHistory, setChatHistory] = useState([])
  const [playerFacts, setPlayerFacts] = useState([])
  const [planted, setPlanted] = useState({})
  const [resources, setResources] = useState({ water: 0, fertilizer: 0 })
  const [currentMonthIndex, setCurrentMonthIndex] = useState(0)
  const [gameState, setGameState] = useState([{
    monthName: "January",
    monthlyIssue: "You need to choose what to plant.",
    monthlySolution: ["Plant potatoes", "potatoes"],
    itemsNeeded: "seeds",
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
  },
  {
    monthName: "February",
    monthlyIssue: "The plants need water!",
    monthlySolution: ["Use 5 units of water", 5],
    itemsNeeded: "water",
    corruption: 0.125,
    cropStage: 1,
    dialogue: {

    }
  },
  {
    monthName: "March",
    monthlyIssue: "Your plants are dying, they need fertilizer",
    monthlySolution: ["Use 4 units of water", 4],
    itemsNeeded: "fertilizer",
    corruption: 0.25,
    cropStage: 2,
    dialogue: {

    }
  },

  ])

  const currentMonth = gameState[currentMonthIndex] ?? gameState[0]

  const requiredItem = currentMonth?.monthlySolution?.[1]

  function normalizeItemName(value) {
    const normalizedName = String(value ?? '').toLowerCase().trim()
    const aliases = {
      potatoes: 'potato',
    }

    return aliases[normalizedName] ?? normalizedName.replace(/s$/, '')
  }

  const plantedCrops = Object.values(planted).filter(Boolean)
  const isCropRequirementComplete = typeof requiredItem === 'string'
    && plantedCrops.some((crop) => (
      normalizeItemName(crop.id) === normalizeItemName(requiredItem)
      || normalizeItemName(crop.name) === normalizeItemName(requiredItem)
    ))
  const isResourceRequirementComplete = typeof requiredItem === 'number'
    && (resources[currentMonth.itemsNeeded] ?? 0) >= requiredItem
  const isMonthComplete = isCropRequirementComplete || isResourceRequirementComplete

  useEffect(() => {
    console.log('[month completion]', {
      month: currentMonth?.monthName,
      requiredItem,
      plantedCropIds: plantedCrops.map((crop) => crop.id),
      resources,
      isMonthComplete,
      canAdvanceMonth: isMonthComplete && currentMonthIndex < gameState.length - 1,
    })
  }, [currentMonth, currentMonthIndex, gameState.length, isMonthComplete, planted, plantedCrops, requiredItem, resources])

  function updateGameState(key, value) {
    setGameState(previousState => previousState.map((monthState, index) => (
      index === currentMonthIndex
        ? { ...monthState, [key]: value }
        : monthState
    )))
  }


  const toOracle = () => setScreen('oracle')
  const toFarm = () => setScreen('farm')
  const toTown = () => setScreen('town')

  function toNextMonth() {
    if (!isMonthComplete || currentMonthIndex >= gameState.length - 1) {
      console.log('[month completion] next month blocked', {
        isMonthComplete,
        currentMonthIndex,
        monthCount: gameState.length,
      })
      return
    }

    console.log('[month completion] advancing month', currentMonthIndex + 1)
    setCurrentMonthIndex((monthIndex) => monthIndex + 1)
    setChatHistory([])
    setResources({ water: 0, fertilizer: 0 })
    setScreen('farm')
  }


  switch (screen) {
    case ("town"):
      return (
        <Overlay
          month={currentMonth.monthName}
          screen={screen}
          toOracle={toOracle}
          toFarm={toFarm}
          toTown={toTown}
          canAdvanceMonth={isMonthComplete && currentMonthIndex < gameState.length - 1}
          toNextMonth={toNextMonth}
        >
          <>
            <Village
              currentMonth={currentMonth.monthName}
              gameState={currentMonth}
            >

            </Village>
          </>
        </Overlay>
      )

    case ("farm"):
      return (
        <Overlay
          month={currentMonth.monthName}
          screen={screen}
          toOracle={toOracle}
          toFarm={toFarm}
          toTown={toTown}
          canAdvanceMonth={isMonthComplete && currentMonthIndex < gameState.length - 1}
          toNextMonth={toNextMonth}
        >
          <FarmPage
            planted={planted}
            setPlanted={setPlanted}
            cropStage={currentMonth.cropStage}
            monthState={currentMonth}
            resources={resources}
            setResources={setResources}
          />
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
          currentMonth={currentMonth}
          currentMonthIndex={currentMonthIndex}
          setCurrentMonthIndex={setCurrentMonthIndex}
          updateGameState={updateGameState}
        />
      )

    default:
      return (<>beans</>)
  }
}

export default App
