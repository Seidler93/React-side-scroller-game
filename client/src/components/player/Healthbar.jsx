import { useGame } from "../../utils/GameContext"
import './player.css'

export default function Healthbar({}) {
  const { 
    playerHealth, setPlayerHealth, 
    maxPlayerHealth, setMaxPlayerHealth
  } = useGame()

  const healthPercentage = (playerHealth / maxPlayerHealth) * 100;

  return (
    <div className="health-bar">
      <div className="health-bar-outer">
        <div
          className="health-bar-inner"
          style={{ width: `${healthPercentage}%` }}
        ></div>
      </div>
    </div>
  )
}