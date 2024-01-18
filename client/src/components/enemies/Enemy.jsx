import { useEffect, } from 'react';
import { useGame } from '../../utils/GameContext';

export default function Enemy({ id, position, height, width, handlePlayerCollision, itemClass, health }) {
  const {playerPosition, setPlayerPosition, bullets, setBullets, setPlayerHealth, enemies, playerHealth, setEnemies} = useGame()

  useEffect(() => {
    // Check if enemy is dead
    health <= 0 && handleDeath()
    const enemyRect = {
      left: position.x,
      right: position.x + width, 
      top: position.y + height, 
      bottom: position.y, 
    };
    // Enemy chase player
    moveTowardsPlayer();
    // Check for collision using the ref
    handlePlayerCollision(id, enemyRect, playerCollision);
  }, [id, playerPosition]);

  // Function to happen when colliding with player
  const playerCollision = () => {
    setPlayerHealth(prevPlayerHealth => prevPlayerHealth - 20)
    console.log(playerHealth - 1);
  }

  const handleDeath = () => {
    setEnemies((prevEnemies) => {
      let newEnemies = prevEnemies.filter(enemy => enemy.id !== id)
      return [...newEnemies]
    })
  }

  const moveTowardsPlayer = () => {
    const angle = Math.atan2(playerPosition.y - position.y, playerPosition.x - position.x);
    const speed = 3; // Enemy speed

    const deltaX = speed * Math.cos(angle);
    const deltaY = speed * Math.sin(angle);

    // Update the enemy's position based on the calculated delta
    setEnemies(prevEnemies => {
      return prevEnemies.map(enemy =>
        enemy.id === id
          ? { ...enemy, position: { x: enemy.position.x + deltaX, y: enemy.position.y + deltaY } }
          : enemy
      );
    });
  };

  return <div id={id} className={itemClass} style={{ left: position.x, bottom: position.y , width: width, height: height}}></div>;
};

