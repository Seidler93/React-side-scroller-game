import './enemy.css'
import { useGame } from '../../utils/GameContext'
import { useEffect } from 'react';
import Enemy from './Enemy';

export default function Enemies() {
  const {level, setLevel, playerPosition, setPlayerPosition, enemies, setEnemies, setPlayerHealth} = useGame()

  // Temporary starter enemies
  const preplacedEnemies = [
    { id: 1, position: {x: 200, y: 0}, width: 50, height: 50, health: 100, class: 'enemy' },
    { id: 2, position: {x: 400, y: 0}, width: 50, height: 50, health: 100, class: 'enemy' },
    { id: 3, position: {x: 600, y: 100}, width: 50, height: 50, health: 100, class: 'enemy' },
  ];

  // Set global enemies to the starter enemies
  useEffect(() => {
    setEnemies(preplacedEnemies)
  }, []);

  // Handling collision between enemy and obstacle
  const handlePlayerCollision = (id, enemyRect, playerCollision) => {
    const playerRect = {
      left: playerPosition.x,
      right: playerPosition.x + 50,
      top: playerPosition.y + 50,
      bottom: playerPosition.y,
    };

    // Collision detection
    if (
      playerRect.right >= enemyRect.left &&
      playerRect.left <= enemyRect.right &&
      playerRect.bottom <= enemyRect.top &&
      playerRect.top >= enemyRect.bottom
    ) {
      return playerCollision()
    }
  };

  

  return (
    <>
      {enemies.length > 0 && enemies.map((enemy) => (
        <Enemy health={enemy.health} itemClass={enemy.class} key={enemy.id} id={enemy.id} position={enemy.position} width={enemy.width} height={enemy.height} handlePlayerCollision={handlePlayerCollision}/>
      ))}
    </>
  )
}