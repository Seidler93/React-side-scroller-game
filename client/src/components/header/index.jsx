import { useGame } from "../../utils/GameContext"

export default function header() {
  const {gameState, setGameState, playerPosition, setPlayerPosition, bullets, setBullets, setPlayerHealth, enemies, playerHealth, setEnemies} = useGame()

  // console.log(gameState);
  return (
    <nav>
      <h2>this is the game header</h2>
      <button onClick={() => setGameState(!gameState)}>Play/Pause</button>
    </nav>
  )
}