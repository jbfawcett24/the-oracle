import { useState } from 'react'
import OraclePage from './pages/OraclePage'
import Overlay from './Overlay'

function App() {
  const [screen, setScreen] = useState("oracle") // town, farm, oracle
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
        <Overlay
          month="January"
          screen={screen}
          toOracle={toOracle}
          toFarm={toFarm}
          toTown={toTown}
        >
          <>breasts</>
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
