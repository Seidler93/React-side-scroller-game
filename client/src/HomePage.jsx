import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useGame } from './utils/GameContext';

export default function HomePage() {
  const { 
    level, setLevel, 
    playerPosition, setPlayerPosition, 
    projectiles, setProjectiles, 
    obstacles, setObstacles, 
    enemies, setEnemies, 
    playerHealth, setPlayerHealth,
    maxPlayerHealth, setMaxPlayerHealth,
    gameOver, setGameOver, 
    gameStats, setGameStats 
  } = useGame()

  const navigate = useNavigate();

  function play() {
    setGameOver(false)
    setGameStats({
      kills: 0,
    })
    setPlayerHealth(10000)
    setMaxPlayerHealth(10000)
    navigate(`/game`);
  }

  return (
    <>
      <h1>HomePage</h1>
      <button onClick={() => play()} className='btn btn-primary'>Play</button>
    </>
  )
}