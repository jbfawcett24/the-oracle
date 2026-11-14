import { useEffect, useState } from 'react'
import OraclePage from './pages/OraclePage'
import './App.css'
import FarmPage from './pages/FarmPage'
import MenuPage from './pages/MenuPage'
import Overlay from './Overlay'
import Village from './pages/village/Village'
import dialogue from '../dialogue.json'

const npcDescriptions = {
  Jarnathan: 'The mayor of the town. He relies on the Oracle for nearly everything, often forgets to think for himself, and tends to wander in his speaking, jumping from topic to topic.',
  Meredeth: "The oldest villager in town. She believes that the Oracle will soon be capable of doing the farmer's job, tends the gardens in her retirement, speaks in a calm, sedate manner, and tends to ramble.",
  Herm: 'A young writer who is relatively new to town, just five years into town. When he arrived, he had no relationships, so the Oracle is essentially his closest friend. He is very excitable when he talks.',
}
function App() {
  const [screen, setScreen] = useState("farm") // town, farm, oracle
  const [chatHistory, setChatHistory] = useState([])
  const [playerFacts, setPlayerFacts] = useState([])
  const [planted, setPlanted] = useState({})
  const [username, setUsername] = useState(null)
  const [resources, setResources] = useState({ water: 0, fertilizer: 0 })
  const [currentMonthIndex, setCurrentMonthIndex] = useState(0)
  const [gameState, setGameState] = useState([{
    monthName: "January",
    monthlyIssue: "You need to choose what to plant.",
    monthlySolution: ["Plant potatoes", "potatoes"],
    itemsNeeded: "seeds",
    corruption: "",
    dialogue: dialogue.dialogue,
    replacedNpcs: [],
  },
  {
    monthName: "February",
    monthlyIssue: "The plants need water!",
    monthlySolution: ["Use 5 units of water", 5],
    itemsNeeded: "water",
    corruption: 0.125,
    cropStage: 1,
    dialogue: dialogue.dialogue,
    replacedNpcs: [],
  },
  {
    monthName: "March",
    monthlyIssue: "Your plants are dying, they need fertilizer",
    monthlySolution: ["Use 4 units of fertilizer", 4],
    itemsNeeded: "fertilizer",
    corruption: 0.25,
    cropStage: 2,
    dialogue: dialogue.dialogue,
    replacedNpcs: [],
  },
  {
    monthName: "April",
    monthlyIssue: "Your plants are dying, they need Water!",
    monthlySolution: ["Use 7 units of Water", 7],
    itemsNeeded: "water",
    corruption: 0.375,
    cropStage: 3,
    dialogue: dialogue.dialogue,
    replacedNpcs: ["Jarnathan"],
  },
  {
    monthName: "May",
    monthlyIssue: "Your plants are dying, they need fertilizer",
    monthlySolution: ["Use 2 units of fertilizer", 2],
    itemsNeeded: "fertilizer",
    corruption: 0.5,
    cropStage: 4,
    dialogue: dialogue.dialogue,
    replacedNpcs: ["Jarnathan", "Meredeth"],
  },
  {
    monthName: "June",
    monthlyIssue: "Your plants are dying, they need water!",
    monthlySolution: ["Use 8 units of fertilizer", 8],
    itemsNeeded: "water",
    corruption: 0.625,
    cropStage: 5,
    dialogue: dialogue.dialogue,
    replacedNpcs: ["Jarnathan", "Meredeth", "Herm"],
  },

  ])

  const currentMonth = gameState[currentMonthIndex] ?? gameState[0]
  const nextMonthProblem = gameState[currentMonthIndex + 1]?.monthlyIssue

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

  if (username === null) {
    return <MenuPage setUsername={setUsername} />
  }


  switch (screen) {
    case ("town"):
      return (
        <Overlay
          month={currentMonth.monthName}gameState
          screen={screen}
          toOracle={toOracle}
          toFarm={toFarm}
          toTown={toTown}
          canAdvanceMonth={isMonthComplete && currentMonthIndex < gameState.length - 1}
          nextMonthProblem={nextMonthProblem}
          toNextMonth={toNextMonth}
        >
          <>
            <Village
              currentMonth={currentMonth.monthName}
              gameState={currentMonth}
              npcDescriptions={npcDescriptions}
              playerFacts={playerFacts}
              username={username}
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
          nextMonthProblem={nextMonthProblem}
          toNextMonth={toNextMonth}
        >
          <FarmPage
            planted={planted}
            setPlanted={setPlanted}
            cropStage={currentMonth.cropStage}
            monthState={currentMonth}
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
