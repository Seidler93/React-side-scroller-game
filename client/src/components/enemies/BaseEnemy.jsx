import { useEffect, } from 'react';
import { useGame } from '../../utils/GameContext';

export default function Enemy({ id, position, height, width, handlePlayerCollision, itemClass }) {
  const {playerPosition, setPlayerPosition, bullets, setBullets, setPlayerHealth} = useGame()

  useEffect(() => {
    const interval = setInterval(() => {
      const enemyRect = {
        left: position.x,
        right: position.x + width, 
        top: position.y + height, 
        bottom: position.y, 
      };
      // Check for collision using the ref
      handlePlayerCollision(id, enemyRect, playerCollision);
    }, 8); // Adjust the interval as needed

    return () => {
      clearInterval(interval);
    };
  }, [id, handlePlayerCollision]);

  // Function to happen when colliding with player
  const playerCollision = () => {
    setPlayerHealth(prevPlayerHealth => prevPlayerHealth - 20)
  }

  return <div id={id} className={itemClass} style={{ left: position.x, bottom: position.y , width: width, height: height}}></div>;
};

