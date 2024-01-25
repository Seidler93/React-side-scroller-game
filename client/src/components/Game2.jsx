import { useEffect, useState, useRef } from 'react';
import { useGame } from '../utils/GameContext';
import './game.css'
import Canvas from './Canvas';

const Game = () => {
  const { 
    gameState, setGameState, 
    level, setLevel, 
    playerPosition, setPlayerPosition, 
    projectiles, setProjectiles, 
    obstacles, setObstacles, 
    enemies, setEnemies, 
    playerHealth, setPlayerHealth 
  } = useGame()

  const [changeX, setChangeX] = useState(0)
  const [changeY, setChangeY] = useState(0)

  // Temporary starter obstacles
  const preplacedObstacles = [
    { id: 1, position: {x: 100, y: 500}, width: 100, height: 250, health: 100, class: 'obstacle' },
    { id: 2, position: {x: 1200, y: 300}, width: 150, height: 150, health: 100, class: 'obstacle' },
    { id: 3, position: {x: 900, y: 100}, width: 150, height: 150, health: 100, class: 'obstacle' },
  ];

  // Temporary starter enemies
  const preplacedEnemies = [
    { id: 1, position: {x: 200, y: 400}, width: 50, height: 50, health: 100, class: 'enemy' },
    { id: 2, position: {x: 400, y: 400}, width: 50, height: 50, health: 100, class: 'enemy' },
    { id: 3, position: {x: 600, y: 100}, width: 50, height: 50, health: 100, class: 'enemy' },
  ];

  // Set global enemies and obstacles to the starter enemies
  useEffect(() => {
    setEnemies(preplacedEnemies)
    setObstacles(preplacedObstacles)
  }, []);

  let xInput = [];
  let yInput = [];

  const handleKeyDown = (e) => {
    if ((e.key === 'w' || e.key === 's') && yInput.indexOf(e.key) === -1) {
      yInput.push(e.key);
    }

    if ((e.key === 'a' || e.key === 'd') && xInput.indexOf(e.key) === -1) {
      xInput.push(e.key);
    }
  };

  const handleKeyUp = (e) => {
    if (e.key === 'w' || e.key === 's') {
      yInput.splice(yInput.indexOf(e.key), 1);
    }

    if (e.key === 'a' || e.key === 'd') {
      xInput.splice(xInput.indexOf(e.key), 1);
    }
  };

  const updatePlayerMovement = () => {
    setPlayerPosition((prevPlayerPosition) => {
      let newX = prevPlayerPosition.x;
      let newY = prevPlayerPosition.y;
      return { x: newX, y: newY };
    });

    if (xInput.indexOf('d') > -1) {
      setChangeX(1);
    } else if (xInput.indexOf('a') > -1) {
      setChangeX(-1);
    } else {
      setChangeX(0)
    }

    if (yInput.indexOf('w') > -1) {
      setChangeY(-1);
    } else if (yInput.indexOf('s') > -1) {
      setChangeY(1);
    } else {
      setChangeY(0)
    }
  };

  // Handling Collision
  useEffect(() => {
    // Create player rectangle to compare to obstacles
    const playerRect = {
      left: playerPosition.x,
      right: playerPosition.x + 20.5,
      top: playerPosition.y,
      bottom: playerPosition.y + 20.5,
    };

    // Initialize collision variable
    let hasCollision = false

    // Update obstacles
    setObstacles((prevObstacles) => {
      // Check for collisions with all obstacles
      for (let i = 0; i < obstacles.length; i++) {
        let obstacle = obstacles[i];

        // Create boundary for obstacle
        let obstacleRect = {
          left: obstacle.position.x - changeX,
          right: obstacle.position.x + obstacle.width - changeX,
          top: obstacle.position.y - changeY,
          bottom: obstacle.position.y + obstacle.height - changeY,
        };

        // Check if the player is colliding with the object
        if (
          playerRect.right > obstacleRect.left &&
          playerRect.left < obstacleRect.right &&
          playerRect.bottom > obstacleRect.top &&
          playerRect.top < obstacleRect.bottom
        ) {
          // Collision detected
          hasCollision = true;
          break;
        }
      }

       // If no collision, update other obstacles positions
      if (!hasCollision) {
        return prevObstacles.map((obstacle) => ({
          ...obstacle,
          position: {
            x: obstacle.position.x - changeX,
            y: obstacle.position.y - changeY,
          },
        }));
      } else {
        return prevObstacles
      }
    });

    // Update enemy positions
    setEnemies((prevEnemies) => {
      // Check for collisions with all enemies
      for (let i = 0; i < enemies.length; i++) {
        let enemy = enemies[i];

        // Create boundary for obstacle
        let enemyRect = {
          left: enemy.position.x - changeX,
          right: enemy.position.x + enemy.width - changeX,
          top: enemy.position.y - changeY,
          bottom: enemy.position.y + enemy.height - changeY,
        };

        // Check if the player is colliding with the object
        if (
          playerRect.right > enemyRect.left &&
          playerRect.left < enemyRect.right &&
          playerRect.bottom > enemyRect.top &&
          playerRect.top < enemyRect.bottom
        ) {
          // Collision detected
          playerCollision()
        }
      }

      // If no collision, update other obstacles positions
      if (!hasCollision) {
        return prevEnemies.map((enemy) => ({
          ...enemy,
          position: {
            x: enemy.position.x - changeX,
            y: enemy.position.y - changeY,
          },
        }))
      } else {
        return prevEnemies
      }
    });

    // Update projectiles positions
    if (!hasCollision) {
      setProjectiles((prevProjectiles) => {
        return prevProjectiles.map((projectile) => ({
          ...projectile,
          position: {
            x: projectile.position.x - changeX,
            y: projectile.position.y - changeY,
          },
        }))
      });
    }
  }, [changeX, changeY, playerPosition])

  function checkProjectileCollision() {
    for (let i = 0; i < projectiles.length; i++) {
      let projectile = projectiles[i];

      // Create boundary for projectile
      let projectileRect = {
        left: projectile.position.x,
        right: projectile.position.x + projectile.width,
        top: projectile.position.y,
        bottom: projectile.position.y + projectile.height,
      };

      for (let i = 0; i < enemies.length; i++) {
        let enemy = enemies[i];

        // Create boundary for enemy
        let enemyRect = {
          left: enemy.position.x,
          right: enemy.position.x + enemy.width,
          top: enemy.position.y,
          bottom: enemy.position.y + enemy.height,
        };

        // Check if the projectile is colliding with the enemy
        if (
          projectileRect.right > enemyRect.left &&
          projectileRect.left < enemyRect.right &&
          projectileRect.bottom > enemyRect.top &&
          projectileRect.top < enemyRect.bottom
        ) {
          // Collision detected
          enemyHit(projectile, enemy)
          break
        }
      }

      for (let i = 0; i < obstacles.length; i++) {
        let obstacle = obstacles[i];

        // Create boundary for enemy
        let obstacleRect = {
          left: obstacle.position.x,
          right: obstacle.position.x + obstacle.width,
          top: obstacle.position.y,
          bottom: obstacle.position.y + obstacle.height,
        };

        // Check if the projectile is colliding with the enemy
        if (
          projectileRect.right > obstacleRect.left &&
          projectileRect.left < obstacleRect.right &&
          projectileRect.bottom > obstacleRect.top &&
          projectileRect.top < obstacleRect.bottom
        ) {
          // Collision detected
          obstacleHit(projectile)
          break
        }
      }
    }
  }

  function enemyHit(projectile, enemy) {
    setProjectiles((prevProjectiles) => {
      let newProjectiles = prevProjectiles.filter(proj => proj.id !== projectile.id);
      return [...newProjectiles];
    });

    setEnemies((prevEnemies) => {
      let newEnemies = prevEnemies.filter(enm => enm.id !== enemy.id)
      console.log(enemy.health - 25);
      return [...newEnemies, {...enemy, health: (enemy.health - 25)}]
    })
  }

  function obstacleHit(projectile) {
    setProjectiles((prevpPojectiles) => {
      let newProjectiles = prevpPojectiles.filter(proj => proj.id !== projectile.id)
      return [...newProjectiles]
    })
  }

  const handleMouseDown = (e) => {
    if (e.button === 0) {
      // Get the mouse position relative to the viewport
      const mouseX = e.clientX - window.innerWidth / 2;
      const mouseY = (e.clientY - window.innerHeight / 2);
  
      // Calculate the angle and distance between player and mouse
      const angle = Math.atan2(mouseY, mouseX);
  
      // Spawn a bullet at the player's position
      const newProjectile = {
        id: Math.floor(Math.random() * Date.now()),
        position: { x: playerPosition.x, y: playerPosition.y },
        target: { x: playerPosition.x + mouseX, y: playerPosition.y + mouseY },
        angle: angle,
        distance: 10, // Bullet speed
        time: 0, // Bullet life time variable
        width: 10,
        height: 5,
        class: 'bullet'
      };
  
      setProjectiles((prevProjectiles) => [...prevProjectiles, newProjectile]);
    }
  };

  useEffect(() => {
    setProjectiles((prevProjectiles) => {
      if (!prevProjectiles) {
        return []; // Return an empty array if prevProjectiles is undefined or null
      }

      let newProjectiles = [];
      for (let i = 0; i < prevProjectiles.length; i++) {
        // Get the properties of the current projectile
        const { position, angle, distance, time } = prevProjectiles[i];
  
        // Update projectile position based on angle and distance
        const projectileX = position.x + distance * Math.cos(angle);
        const projectileY = position.y + distance * Math.sin(angle);
  
        // Update time interval by 1
        const newTime = time + 1

        // Create a new projectile object with updated position
        const updatedProjectile = { ...prevProjectiles[i], position: { x: projectileX, y: projectileY }, time: newTime };
        
        // Add the updated projectile to the newProjectiles array if it's time hasn't run out
        if (newTime < 300) {
          newProjectiles = [...newProjectiles, updatedProjectile];
        }
      }
      return newProjectiles;
    });
  }, [playerPosition]);
  
  useEffect(() => {
    checkProjectileCollision()
  }, [projectiles])

  useEffect(() => {
    for (let i = 0; i < enemies.length; i++) {
      let enemy = enemies[i];
      // Check if enemy is dead
      enemy.health <= 0 && handleDeath(enemy)
      // Enemy chase player
      moveTowardsPlayer(enemy);
    }
  }, [playerPosition]);

  // Function to happen when colliding with player
  const playerCollision = () => {
    setPlayerHealth(prevPlayerHealth => prevPlayerHealth - 20)
    console.log(playerHealth - 1);
  }

  const handleDeath = (enemy) => {
    setEnemies((prevEnemies) => {
      let newEnemies = prevEnemies.filter(enm => enm.id !== enemy.id)
      return [...newEnemies]
    })
  }

  const moveTowardsPlayer = (enemy) => {
    const angle = Math.atan2(playerPosition.y - enemy.position.y, playerPosition.x - enemy.position.x);
    const speed = .5; // Enemy speed

    const deltaX = speed * Math.cos(angle);
    const deltaY = speed * Math.sin(angle);

    // Update the enemy's position based on the calculated delta
    setEnemies(prevEnemies => {
      return prevEnemies.map(thisEnemy =>
        thisEnemy.id === enemy.id
          ? { ...thisEnemy, position: { x: thisEnemy.position.x + deltaX, y: thisEnemy.position.y + deltaY } }
          : thisEnemy
      );
    });
  };
  
  useEffect(() => {
    if (gameState) {
      // Only run game-related logic when the game is not paused
      window.addEventListener('keydown', handleKeyDown);
      window.addEventListener('keyup', handleKeyUp);
      window.addEventListener('mousedown', handleMouseDown);

      const interval = setInterval(() => {
        updatePlayerMovement();
      }, 4);

      return () => {
        window.removeEventListener('keydown', handleKeyDown);
        window.removeEventListener('keyup', handleKeyUp);
        window.removeEventListener('mousedown', handleMouseDown);
        clearInterval(interval);
      };
    }
  }, [gameState]);

  return (
    <Canvas
      playerPosition={playerPosition}
      obstacles={obstacles}
      enemies={enemies}
      projectiles={projectiles}
    />
  );
};

export default Game;

