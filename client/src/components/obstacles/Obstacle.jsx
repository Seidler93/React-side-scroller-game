import './obstacle.css'
import { useGame } from '../../utils/GameContext'
import { useEffect } from 'react';

export default function Obstacle({ id, position, height, width, handleCollision, itemClass, }) {
  const {playerPosition, setPlayerPosition, bullets, setBullets, enemies, setEnemies, obstacles, setObstacles } = useGame()

  useEffect(() => {
    const interval = setInterval(() => {
      const obstacleRect = {
        left: position.x,
        right: position.x + width, 
        top: position.y + height, 
        bottom: position.y, 
      };
      // Check for collision using the ref
      handleCollision(id, obstacleRect);
    }, 8); // Adjust the interval as needed

    return () => {
      clearInterval(interval);
    };
  }, [id, handleCollision]);

  return (
    <>
      <div id={id} className={itemClass} style={{ left: position.x, bottom: position.y, width: width, height: height}}></div>
    </>
  )
}