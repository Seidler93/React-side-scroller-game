import './projectile.css';
import { useGame } from '../../utils/GameContext';
import { useEffect } from 'react';

export default function Projectile({ id, position, target, height, width, itemClass }) {
  const { playerPosition, setPlayerPosition, bullets, setBullets, setPlayerHealth, handleCollision, projectiles, setProjectiles, enemies, setEnemies } = useGame();

  // Function to happen when colliding with player
  const onCollision = (enemy) => {
    setProjectiles((prevProjectiles) => {
      let newProjectiles = prevProjectiles.filter(proj => proj.id !== id);
      return [...newProjectiles];
    });
    setEnemies((prevEnemies) => {
      let newEnemies = prevEnemies.filter(enm => enm.id !== enemy.id)
      console.log(enemy.health - 25);
      return [...newEnemies, {...enemy, health: (enemy.health - 25)}]
    })
  };

  useEffect(() => {
    const projectileRect = {
      left: position.x,
      right: position.x + width,
      top: position.y + height,
      bottom: position.y,
    };

    for (let i = 0; i < enemies.length; i++) {
      const enemy = enemies[i];

      const enemyRect = {
        left: enemy.position.x,
        right: enemy.position.x + enemy.width,
        top: enemy.position.y + enemy.height,
        bottom: enemy.position.y,
      };

      if (
        projectileRect.right >= enemyRect.left &&
        projectileRect.left <= enemyRect.right &&
        projectileRect.bottom <= enemyRect.top &&
        projectileRect.top >= enemyRect.bottom
      ) {
        onCollision(enemy);
      }
    }
  }, [id, position, width, height, enemies, setProjectiles]);

  return <div className={itemClass} style={{ left: position.x, bottom: position.y, height: height, width: width }}></div>;
}
