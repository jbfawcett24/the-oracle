import { useState } from 'react'
import OraclePage from './pages/OraclePage'
import './App.css'
import FarmPage from './pages/FarmPage'

function App() {
  // setScreen will be used when the other screens are added.
  // eslint-disable-next-line no-unused-vars
  const [screen, setScreen] = useState("farm") // town, farm, oracle
  const [chatHistory, setChatHistory] = useState([])
  const [playerFacts, setPlayerFacts] = useState([])
  const [corruption, setCorruption] = useState(0)


  const toOracle = () => setScreen('oracle')
  const toFarm = () => setScreen('farm')
  const toTown = () => setScreen('town')


  switch (screen) {
    case ("town"):
      return (
        <Overlay
          month="January"
          screen={screen}
          toOracle={toOracle}
          toFarm={toFarm}
          toTown={toTown}
        >
          <>boobs</>
        </Overlay>
      )

    case ("farm"):
      return (
        <>
          <FarmPage />
        </>
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
