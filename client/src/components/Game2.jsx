// import React, { useEffect, useState, useRef } from 'react';
// import Player from './player/Player';
// import Bullet from './projectiles/Projectile';
// import Enemies from './enemies/Enemies';
// import { useGame } from '../utils/GameContext';
// import Obstacles from './obstacles/Obstacles';
// import Projectiles from './projectiles/Projectiles';
// import './game.css'
// import Canvas from './Canvas';

// const Game = () => {
//   const { gameState, setGameState, level, setLevel, playerPosition, setPlayerPosition, projectiles, setProjectiles, obstacles, setObstacles, enemies, setEnemies } = useGame()

//   // Temporary starter obstacles
//   const preplacedObstacles = [
//     { id: 1, position: {x: 100, y: 500}, width: 100, height: 250, health: 100, class: 'obstacle' },
//     { id: 2, position: {x: 1200, y: 300}, width: 150, height: 150, health: 100, class: 'obstacle' },
//     { id: 3, position: {x: 900, y: 100}, width: 150, height: 150, health: 100, class: 'obstacle' },
//   ];

//   // Set global enemies to the starter enemies
//   useEffect(() => {
//     setObstacles(preplacedObstacles)
//   }, []);

//   // Temporary starter enemies
//   const preplacedEnemies = [
//     { id: 1, position: {x: 200, y: 400}, width: 50, height: 50, health: 100, class: 'enemy' },
//     { id: 2, position: {x: 400, y: 400}, width: 50, height: 50, health: 100, class: 'enemy' },
//     { id: 3, position: {x: 600, y: 100}, width: 50, height: 50, health: 100, class: 'enemy' },
//   ];

//   // Set global enemies to the starter enemies
//   useEffect(() => {
//     setEnemies(preplacedEnemies)
//   }, []);

//   let xInput = [];
//   let yInput = [];

//   const handleKeyDown = (e) => {
//     if ((e.key === 'w' || e.key === 's') && yInput.indexOf(e.key) === -1) {
//       yInput.push(e.key);
//     }

//     if ((e.key === 'a' || e.key === 'd') && xInput.indexOf(e.key) === -1) {
//       xInput.push(e.key);
//     }
//   };

//   const handleKeyUp = (e) => {
//     if (e.key === 'w' || e.key === 's') {
//       yInput.splice(yInput.indexOf(e.key), 1);
//     }

//     if (e.key === 'a' || e.key === 'd') {
//       xInput.splice(xInput.indexOf(e.key), 1);
//     }
//   };

//   const updatePlayerMovement = () => {
//     let changeX = 0;
//     let changeY = 0;
  
//     setPlayerPosition((prevPlayerPosition) => {
//       let newX = prevPlayerPosition.x;
//       let newY = prevPlayerPosition.y;
//       return { x: newX, y: newY };
//     });

//     if (xInput.indexOf('d') > -1) {
//       changeX += 1.5;
//     } else if (xInput.indexOf('a') > -1) {
//       changeX -= 1.5;
//     }

//     if (yInput.indexOf('w') > -1) {
//       changeY -= 1.5;
//     } else if (yInput.indexOf('s') > -1) {
//       changeY += 1.5;
//     }

//     updateObstacles(changeX, changeY);

//     // Update enemy positions
//     setEnemies((prevEnemies) =>
//       prevEnemies.map((enemy) => ({
//         ...enemy,
//         position: {
//           x: enemy.position.x - changeX,
//           y: enemy.position.y - changeY,
//         },
//       }))
//     );

//     // Update projectiles positions
//     setProjectiles((prevProjectiles) =>
//       prevProjectiles.map((projectile) => ({
//         ...projectile,
//         position: {
//           x: projectile.position.x - changeX,
//           y: projectile.position.y - changeY,
//         },
//       }))
//     );
//   };
  
//   const handleMouseDown = (e) => {
//     if (e.button === 0) {
//       // Get the mouse position relative to the viewport
//       const mouseX = e.clientX - window.innerWidth / 2;
//       const mouseY = (e.clientY - window.innerHeight / 2);
  
//       // Calculate the angle and distance between player and mouse
//       const angle = Math.atan2(mouseY, mouseX);
  
//       // Spawn a bullet at the player's position
//       const newProjectile = {
//         id: Math.floor(Math.random() * Date.now()),
//         position: { x: playerPosition.x, y: playerPosition.y },
//         target: { x: playerPosition.x + mouseX, y: playerPosition.y + mouseY },
//         angle: angle,
//         distance: 10, // Bullet speed
//         time: 0, // Bullet life time variable
//         width: 10,
//         height: 5,
//         class: 'bullet'
//       };
  
//       setProjectiles((prevProjectiles) => [...prevProjectiles, newProjectile]);
//     }
//   };
  
//    useEffect(() => {
//     setProjectiles((prevProjectiles) => {
//       if (!prevProjectiles) {
//         return []; // Return an empty array if prevProjectiles is undefined or null
//       }

//       let newProjectiles = [];
//       for (let i = 0; i < prevProjectiles.length; i++) {
//         // Get the properties of the current projectile
//         const { position, angle, distance, time } = prevProjectiles[i];
  
//         // Update projectile position based on angle and distance
//         const projectileX = position.x + distance * Math.cos(angle);
//         const projectileY = position.y + distance * Math.sin(angle);
  
//         // Update time interval by 1
//         const newTime = time + 1

//         // Create a new projectile object with updated position
//         const updatedProjectile = { ...prevProjectiles[i], position: { x: projectileX, y: projectileY }, time: newTime };
        
//         // Add the updated projectile to the newProjectiles array if it's time hasn't run out
//         if (newTime < 300) {
//           newProjectiles = [...newProjectiles, updatedProjectile];
//         }
//       }
//       return newProjectiles;
//     });

//     if (obstacles[0]) {
//       // console.log({
//       //   left: playerPosition.x,
//       //   right: playerPosition.x + 20,
//       //   top: playerPosition.y,
//       //   bottom: playerPosition.y + 20,
//       // }, {
//       //   left: obstacles[0].position.x,
//       //   right: obstacles[0].position.x + obstacles[0].width,
//       //   top: obstacles[0].position.y,
//       //   bottom: obstacles[0].position.y + obstacles[0].height,
//       // });
//     }

//   }, [playerPosition]);

//   function say(that) {
//     console.log(that);
//   }

//   function updateObstacles(newX, newY) {
//     // Check if obstacles is defined before creating a copy
//     // Create a copy of the current obstacle positions
//     let obstaclesCopy = [...obstacles];
//     let hasCollision = false
//     // Update the copied obstacle positions based on player movement
//     obstaclesCopy = obstaclesCopy.map((obstacle) => ({
//       ...obstacle,
//       position: {
//         x: obstacle.position.x - newX,
//         y: obstacle.position.y - newY,
//       },
//     }));

//     console.log(obstaclesCopy[0].position);

//     // Create player rectangle to compare to collidable objects
//     const playerRect = {
//       left: playerPosition.x,
//       right: playerPosition.x + 20,
//       top: playerPosition.y,
//       bottom: playerPosition.y + 20,
//     };

//     // Check for collisions with all obstacles
//     for (let i = 0; i < obstaclesCopy.length; i++) {
//       let obstacle = obstaclesCopy[i];
//       // Create boundary for obstacle
//       let obstacleRect = {
//         left: obstacle.position.x,
//         right: obstacle.position.x + obstacle.width,
//         top: obstacle.position.y,
//         bottom: obstacle.position.y + obstacle.height,
//       };
//       // Check if the player is colliding with the object
//       if (
//         playerRect.right > obstacleRect.left &&
//         playerRect.left < obstacleRect.right &&
//         playerRect.bottom > obstacleRect.top &&
//         playerRect.top < obstacleRect.bottom
//       ) {
//         // Collision detected
//         console.log(true);
//         hasCollision = true;
//         break;
//       }
//     }

//     // If no collision, update other game object positions (obstacles, enemies, etc.)
//     if (!hasCollision) {
//       setObstacles((prevObstacles) =>
//         prevObstacles.map((obstacle) => ({
//           ...obstacle,
//           position: {
//             x: obstacle.position.x - newX, // Adjust based on player movement
//             y: obstacle.position.y - newY,
//           },
//         }))
//       );
//     }
//   }

  

//   useEffect(() => {
//     for (let i = 0; i < enemies.length; i++) {
//       let enemy = enemies[i];
//       // Check if enemy is dead
//       enemy.health <= 0 && handleDeath()
//       const enemyRect = {
//         left: enemy.position.x,
//         right: enemy.position.x + enemy.width, 
//         top: enemy.position.y + enemy.height, 
//         bottom: enemy.position.y, 
//       };
//       // Enemy chase player
//       // moveTowardsPlayer(enemy);
//       // Check for collision using the ref
//       // handlePlayerCollision(id, enemyRect, playerCollision);
//     }
//   }, [playerPosition]);

//   // Function to happen when colliding with player
//   const playerCollision = () => {
//     setPlayerHealth(prevPlayerHealth => prevPlayerHealth - 20)
//     console.log(playerHealth - 1);
//   }

//   const handleDeath = () => {
//     setEnemies((prevEnemies) => {
//       let newEnemies = prevEnemies.filter(enemy => enemy.id !== id)
//       return [...newEnemies]
//     })

//   }

//   const moveTowardsPlayer = (enemy) => {
//     const angle = Math.atan2(playerPosition.y - enemy.position.y, playerPosition.x - enemy.position.x);
//     const speed = 1; // Enemy speed

//     const deltaX = speed * Math.cos(angle);
//     const deltaY = speed * Math.sin(angle);

//     // Update the enemy's position based on the calculated delta
//     setEnemies(prevEnemies => {
//       return prevEnemies.map(thisEnemy =>
//         thisEnemy.id === enemy.id
//           ? { ...thisEnemy, position: { x: thisEnemy.position.x + deltaX, y: thisEnemy.position.y + deltaY } }
//           : thisEnemy
//       );
//     });
//   };
  
//   useEffect(() => {
//     if (gameState) {
//       // Only run game-related logic when the game is not paused
//       window.addEventListener('keydown', handleKeyDown);
//       window.addEventListener('keyup', handleKeyUp);
//       window.addEventListener('mousedown', handleMouseDown);

//       const interval = setInterval(() => {
//         updatePlayerMovement();
//         // checkForCollision();
//       }, 14);

//       return () => {
//         window.removeEventListener('keydown', handleKeyDown);
//         window.removeEventListener('keyup', handleKeyUp);
//         window.removeEventListener('mousedown', handleMouseDown);
//         clearInterval(interval);
//       };
//     }
//   }, [gameState]);


//   return (
//     <Canvas
//       playerPosition={playerPosition}
//       obstacles={obstacles}
//       enemies={enemies}
//       projectiles={projectiles}
//     />
//   );
// };

// export default Game;

import { useEffect, useState, useRef } from 'react';
import { useGame } from '../utils/GameContext';
import './game.css'
import Canvas from './Canvas';

const Game = () => {
  const { gameState, setGameState, level, setLevel, playerPosition, setPlayerPosition, projectiles, setProjectiles, obstacles, setObstacles, enemies, setEnemies } = useGame()
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
      setChangeX(2.5);
    } else if (xInput.indexOf('a') > -1) {
      setChangeX(-2.5);
    } else {
      setChangeX(0)
    }

    if (yInput.indexOf('w') > -1) {
      setChangeY(-2.5);
    } else if (yInput.indexOf('s') > -1) {
      setChangeY(2.5);
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

    // Update obstacles
    setObstacles((prevObstacles) => {
      // Initialize collision variable
      let hasCollision = false

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

        // console.log(obstacleRect, playerRect);
        // Check if the player is colliding with the object
        if (
          playerRect.right > obstacleRect.left &&
          playerRect.left < obstacleRect.right &&
          playerRect.bottom > obstacleRect.top &&
          playerRect.top < obstacleRect.bottom
        ) {
          // Collision detected
          console.log(obstacle.id);
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
    })

    // Update enemy positions
    setEnemies((prevEnemies) =>
      prevEnemies.map((enemy) => ({
        ...enemy,
        position: {
          x: enemy.position.x - changeX,
          y: enemy.position.y - changeY,
        },
      }))
    );

    // Update projectiles positions
    setProjectiles((prevProjectiles) =>
      prevProjectiles.map((projectile) => ({
        ...projectile,
        position: {
          x: projectile.position.x - changeX,
          y: projectile.position.y - changeY,
        },
      }))
    );
  }, [changeX, changeY, playerPosition])

  
  
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
    for (let i = 0; i < enemies.length; i++) {
      let enemy = enemies[i];
      // Check if enemy is dead
      enemy.health <= 0 && handleDeath()
      const enemyRect = {
        left: enemy.position.x,
        right: enemy.position.x + enemy.width, 
        top: enemy.position.y + enemy.height, 
        bottom: enemy.position.y, 
      };
      // Enemy chase player
      // moveTowardsPlayer(enemy);
      // Check for collision using the ref
      // handlePlayerCollision(id, enemyRect, playerCollision);
    }
  }, [playerPosition]);

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

  const moveTowardsPlayer = (enemy) => {
    const angle = Math.atan2(playerPosition.y - enemy.position.y, playerPosition.x - enemy.position.x);
    const speed = 1; // Enemy speed

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
      }, 14);

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

