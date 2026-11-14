import { useState } from 'react'
import OraclePage from './pages/OraclePage'
import './App.css'

function App() {
  const [screen, setScreen] = useState("oracle") // town, farm, oracle

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
        <OraclePage />
      )

    default:
      return (
        <>
          beans
        </>
      )
  }

  return (
    <>

    </>
  )
}

export default App
