import React, { useEffect, useState, useRef } from 'react';
import Player from './player/Player';
import Bullet from './projectiles/Projectile';
import Enemies from './enemies/Enemies';
import { useGame } from '../utils/GameContext';
import Obstacles from './obstacles/Obstacles';
import Projectiles from './projectiles/Projectiles';
import './game.css'
import Canvas from './Canvas';

const Game = () => {
  const [backgroundPosition, setBackgroundPosition] = useState({
    left: 0,
    right: window.innerWidth,
    top: window.innerHeight,
    bottom: 0
  });

  const [isShooting, setIsShooting] = useState(false)

  const [viewportPosition, setViewportPosition] = useState({ x: 0, y: 0 }); // Initialize viewportPosition state
  const gameWorldWidth = 5000; // Replace this with the actual width of your game world
  const gameWorldHeight = 5000; // Replace this with the actual height of your game world

  const viewportSize = { width: window.innerWidth, height: window.innerHeight };
  const gameWorldSize = { width: gameWorldWidth, height: gameWorldHeight };
  const maxViewportPosition = {
    x: gameWorldSize.width - viewportSize.width,
    y: gameWorldSize.height - viewportSize.height,
  };

  const { level, setLevel, playerPosition, setPlayerPosition, projectiles, setProjectiles, obstacles, setObstacles, enemies, setEnemies } = useGame()

  // Temporary starter obstacles
  const preplacedObstacles = [
    { id: 1, position: {x: 100, y: 500}, width: 100, height: 250, health: 100, class: 'obstacle' },
    { id: 2, position: {x: 500, y: 300}, width: 150, height: 150, health: 100, class: 'obstacle' },
    { id: 3, position: {x: 900, y: 100}, width: 150, height: 150, health: 100, class: 'obstacle' },
  ];

  // Set global enemies to the starter enemies
  useEffect(() => {
    setObstacles(preplacedObstacles)
  }, []);

  // Temporary starter enemies
  const preplacedEnemies = [
    { id: 1, position: {x: 200, y: 400}, width: 50, height: 50, health: 100, class: 'enemy' },
    { id: 2, position: {x: 400, y: 400}, width: 50, height: 50, health: 100, class: 'enemy' },
    { id: 3, position: {x: 600, y: 100}, width: 50, height: 50, health: 100, class: 'enemy' },
  ];

  // Set global enemies to the starter enemies
  useEffect(() => {
    setEnemies(preplacedEnemies)
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

  const updatePlayerPosition = () => {
    let changeX = 0;
    let changeY = 0;

    setPlayerPosition((prevPlayerPosition) => {
      let newX = prevPlayerPosition.x;
      let newY = prevPlayerPosition.y;
      
      if (xInput.indexOf('d') > -1) {
        // newX += 2;
        changeX += 1.5
      } else if (xInput.indexOf('a') > -1) {
        // newX -= 2;
        changeX -= 1.5
      }
      
      if (yInput.indexOf('w') > -1) {
        // newY -= 2;
        changeY -= 1.5;
      } else if (yInput.indexOf('s') > -1) {
        // newY += 2;
        changeY += 1.5;
      }
      
      // Additional checks or constraints can be added here
      
      // console.log(changeX, changeY);
      return { y: newY, x: newX };
    });
    // console.log(obstacles[0].position.x);

    // Update other game object positions (obstacles, enemies, etc.)
    setObstacles((prevObstacles) =>
      prevObstacles.map((obstacle) => ({
        ...obstacle,
        position: {
          x: obstacle.position.x - changeX, // Adjust based on player movement
          y: obstacle.position.y - changeY,
        }
      }))
    );

    // Update enemy positions
    setEnemies((prevEnemies) =>
      prevEnemies.map((enemy) => ({
        ...enemy,
        position: {
          x: enemy.position.x - changeX,
          y: enemy.position.y - changeY,
        }
      }))
    );

    // Update projectiles positions
    setProjectiles((prevProjectiles) =>
      prevProjectiles.map((projectile) => ({
        ...projectile,
        position: {
          x: projectile.position.x - changeX,
          y: projectile.position.y - changeY,
        }
      }))
    );

    // Update viewport position if needed
    setViewportPosition((prevViewportPosition) => ({
      x: prevViewportPosition.x + changeX,
      y: prevViewportPosition.y + changeY,
    }));

  };

  const handleMouseDown = (e) => {
    if (e.button === 0) {
      setIsShooting(true)
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
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('mousedown', handleMouseDown);

    const interval = setInterval(() => {
      updatePlayerPosition();
      updateViewportPosition();
    }, 8);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('mousedown', handleMouseDown);
      clearInterval(interval);
    };
  }, []); // Empty dependency array to ensure the event listeners are added only once

  const updateViewportPosition = () => {
    setViewportPosition((prevViewportPosition) => {
      let newViewportPosition = prevViewportPosition;
      const playerX = playerPosition.x;
      const playerY = playerPosition.y;

      // Adjust viewport position based on player position
      newViewportPosition.x = Math.max(0, Math.min(playerX - viewportSize.width / 2, maxViewportPosition.x));
      newViewportPosition.y = Math.max(0, Math.min(playerY - viewportSize.height / 2, maxViewportPosition.y));

      return newViewportPosition;
    });
  };

  return (
    <Canvas
      playerPosition={playerPosition}
      obstacles={obstacles}
      enemies={enemies}
      projectiles={projectiles}
      backgroundPosition={backgroundPosition}
      viewportPosition={viewportPosition}
      gameWorldWidth={gameWorldWidth}
      gameWorldHeight={gameWorldHeight}
    />
  );
};

export default Game;
