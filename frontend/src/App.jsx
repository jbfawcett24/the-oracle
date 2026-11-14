import { useState } from 'react'
import OraclePage from './pages/OraclePage'
import './App.css'

function App() {
  // setScreen will be used when the other screens are added.
  // eslint-disable-next-line no-unused-vars
  const [screen, setScreen] = useState("oracle") // town, farm, oracle
  const [chatHistory, setChatHistory] = useState([])
  const [playerFacts, setPlayerFacts] = useState([])
  const [corruption, setCorruption] = useState(0)


  switch (screen) {
    case ("town"):
      return (
        <>
          boobs
        </>
      )

    case ("farm"):
      return (
        <>
          breasts
        </>
      )

    case ("oracle"):
      return (
        <OraclePage
          history={chatHistory}
          setHistory={setChatHistory}
          playerFacts={playerFacts}
          setPlayerFacts={setPlayerFacts}
          corruption={corruption}
          setCorruption={setCorruption}
        />
      )

    default:
      return (
        <>
          beans
        </>
      )
  }
}

export default App
