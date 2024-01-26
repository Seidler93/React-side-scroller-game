import { useGame } from "../utils/GameContext"
import { useNavigate } from 'react-router-dom';
import { motion } from "framer-motion";
import { Link } from 'react-router-dom';

export default function GameOverScreen() {
  const { 
    level, setLevel, 
    playerPosition, setPlayerPosition, 
    projectiles, setProjectiles, 
    obstacles, setObstacles, 
    enemies, setEnemies, 
    playerHealth, setPlayerHealth,
    gameOver, setGameOver, 
    gameStats, setGameStats 
  } = useGame()

  function playAgain() {
    window.location.reload()  
  }

  const fadeInAndScale = {
    hidden: { opacity: 0},
    visible: { opacity: 0.75, transition: { duration: 1 }  },
  };

  return (
    <motion.div
      className="game-over d-flex flex-column justify-content-around align-items-center"
      initial="hidden"
      animate="visible"
      variants={fadeInAndScale}
    >
      <h3 className="text-danger">GAME OVER</h3>
      <h4 className="text-white">Total kills: {gameStats.kills}</h4>
      <Link className="btn btn-primary text-white" to="/">
        Home
      </Link>
      <button onClick={() => playAgain()} className="btn btn-primary text-white">Play Again</button>
    </motion.div>
  )
}