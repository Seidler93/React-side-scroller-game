import './obstacle.css'
import { useGame } from '../../utils/GameContext'
import { useEffect } from 'react';

export default function Obstacle({ id, position, height, width, handleCollision, itemClass, }) {
  const {playerPosition, setPlayerPosition, bullets, enemies, setEnemies, obstacles, setObstacles } = useGame()

  useEffect(() => {
    const obstacleRect = {
      left: position.x,
      right: position.x + width, 
      top: position.y + height, 
      bottom: position.y, 
    };
    handleCollision(id, obstacleRect);
  }, [id, playerPosition]);

  return (
    <>
      <div id={id} className={itemClass} style={{ left: position.x, bottom: position.y, width: width, height: height}}></div>
    </>
  )
}