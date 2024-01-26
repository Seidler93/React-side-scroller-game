import { useEffect, useState, useRef } from 'react';
import { useGame } from '../utils/GameContext';
import './game.css'
import Canvas from './Canvas';
import Header from './header';
import Healthbar from './player/Healthbar';
import GameOverScreen from './GameOverScreen';

const Game = () => {
  const { 
    isShooting, setIsShooting,
    gameState, setGameState, 
    level, setLevel, 
    playerPosition, setPlayerPosition, 
    projectiles, setProjectiles, 
    obstacles, setObstacles, 
    enemies, setEnemies, 
    playerHealth, setPlayerHealth,
    maxPlayerHealth, setMaxPlayerHealth,
    gameOver, setGameOver,
    gameStats, setGameStats
  } = useGame()

  const [changeX, setChangeX] = useState(0)
  const [changeY, setChangeY] = useState(0)
  const [beginningNextLevel, setBeginningNextLevel] = useState(false)
  const [initiation, setInitiation] = useState(true)
  const [canShoot, setCanShoot] = useState(true)
  const [wallCollision, setWallwallCollision] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [playerSpeed, setPlayerSpeed] = useState(1);
  const [loot, setLoot] = useState([]);


  // Update mouse coordinates on mouse move
  const handleMouseMove = (e) => {
    setMousePosition({ x: e.clientX, y: e.clientY });
  };

  function initialTimer() {
    setTimeout(() => {
      setInitiation(false)
    }, 500);
  }

  // Temporary starter obstacles
  const preplacedObstacles = [
    // Outer walls
    { id: 1, position: { x: 100, y: -700 }, width: 50, height: 3000, health: 100, class: 'obstacle' },
    { id: 2, position: { x: 100, y: -700 }, width: 3000, height: 50, health: 100, class: 'obstacle' },
    { id: 3, position: { x: 3100, y: -700 }, width: 50, height: 3000, health: 100, class: 'obstacle' },
    { id: 4, position: { x: 100, y: 2300 }, width: 3000, height: 50, health: 100, class: 'obstacle' },
  
    // Inner walls
    { id: 5, position: { x: 400, y: -300 }, width: 50, height: 1050, health: 100, class: 'obstacle' },
    { id: 6, position: { x: 300, y: 0 }, width: 550, height: 50, health: 100, class: 'obstacle' },
    { id: 7, position: { x: 1200, y: 100 }, width: 400, height: 50, health: 100, class: 'obstacle' },
  
    // Additional rooms and obstacles
    { id: 8, position: { x: 600, y: -500 }, width: 200, height: 50, health: 100, class: 'obstacle' },
    { id: 9, position: { x: 1000, y: -200 }, width: 50, height: 400, health: 100, class: 'obstacle' },
    { id: 10, position: { x: 800, y: 200 }, width: 300, height: 50, health: 100, class: 'obstacle' },
    { id: 11, position: { x: 1200, y: -400 }, width: 50, height: 250, health: 100, class: 'obstacle' },
    { id: 12, position: { x: 1400, y: 300 }, width: 50, height: 200, health: 100, class: 'obstacle' },
  
    // More rooms
    { id: 13, position: { x: 1600, y: -200 }, width: 50, height: 400, health: 100, class: 'obstacle' },
    { id: 14, position: { x: 1800, y: 0 }, width: 300, height: 50, health: 100, class: 'obstacle' },
    { id: 15, position: { x: 1600, y: 200 }, width: 50, height: 400, health: 100, class: 'obstacle' },
  ];
  
  // Temporary starter enemies
  const preplacedEnemies = [
    { id: 1, position: {x: 200, y: 300}, width: 50, height: 50, health: 100, maxHealth: 100, class: 'enemy' },
    { id: 2, position: {x: 800, y: 700}, width: 50, height: 50, health: 100, maxHealth: 100, class: 'enemy' },
    { id: 3, position: {x: 600, y: 100}, width: 50, height: 50, health: 100, maxHealth: 100, class: 'enemy' },
  ];

  const placedLoot = [
    { id: 500, position: {x: 600, y: 500}, width: 50, height: 50, type: 'health pot' },
  ]

  // Set global enemies and obstacles to the starter enemies
  useEffect(() => {
    setEnemies(preplacedEnemies)
    setObstacles(preplacedObstacles)
    setLoot(placedLoot)
    initialTimer()
    setGameState(true)
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

    if (e.key === 'Tab' || e.key === 'Escape') {
      setGameState(!gameState)
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
      setChangeX(playerSpeed);
    } else if (xInput.indexOf('a') > -1) {
      setChangeX(-playerSpeed);
    } else {
      setChangeX(0)
    }

    if (yInput.indexOf('w') > -1) {
      setChangeY(-playerSpeed);
    } else if (yInput.indexOf('s') > -1) {
      setChangeY(playerSpeed);
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
        setWallwallCollision(true)
        break;
      } else { 
        setWallwallCollision(false)
      }
    }
    

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

    for (let i = 0; i < loot.length; i++) {
      let lootObject = loot[i];

      // Create boundary for obstacle
      let lootRect = {
        left: lootObject.position.x - changeX,
        right: lootObject.position.x + lootObject.width - changeX,
        top: lootObject.position.y - changeY,
        bottom: lootObject.position.y + lootObject.height - changeY,
      };

      // Check if the player is colliding with the object
      if (
        playerRect.right > lootRect.left &&
        playerRect.left < lootRect.right &&
        playerRect.bottom > lootRect.top &&
        playerRect.top < lootRect.bottom
      ) {
        // Collision detected
        lootCollision(lootObject)
      }
    }
  }, [playerPosition])

  useEffect(() => {
    if (!wallCollision) {
      setLoot((prevLoot) => {
        return prevLoot.map((lootObject) => ({
          ...lootObject,
          position: {
            x: lootObject.position.x - changeX,
            y: lootObject.position.y - changeY,
          },
        }))
      });

      updateEnemyPosition()

      setObstacles((prevObstacles) => {
        return prevObstacles.map((obstacle) => ({
          ...obstacle,
          position: {
            x: obstacle.position.x - changeX,
            y: obstacle.position.y - changeY,
          },
        }));        
      });
    }
  }, [playerPosition])


  // Update enemy positions
  const updateEnemyPosition = () => {
    setEnemies((prevEnemies) => {
      return prevEnemies.map((enemy) => ({
        ...enemy,
        position: {
          x: enemy.position.x - changeX,
          y: enemy.position.y - changeY,
        },
      }));
    });
  }

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
      return [...newEnemies, {...enemy, health: (enemy.health - 25)}]
    })
  }

  function obstacleHit(projectile) {
    setProjectiles((prevpPojectiles) => {
      let newProjectiles = prevpPojectiles.filter(proj => proj.id !== projectile.id)
      return [...newProjectiles]
    })
  }

  const lootCollision = (lootObject) => {
    setLoot((prevLoot) => {
      const updatedLoot = prevLoot.filter(loot => loot.id !== lootObject.id)
      return [...updatedLoot]
    })

    // Calculate the amount to increase by 20%
    const increaseAmount = maxPlayerHealth * 0.2;

    // Update player health, ensuring it doesn't exceed maxPlayerHealth
    const newPlayerHealth = Math.min(playerHealth + increaseAmount, maxPlayerHealth);
    setPlayerHealth(newPlayerHealth)
  }

  const fireWeapon = () => {
    let gunOffsetX = 75;
    let gunOffsetY = 75;

      // Get the mouse position relative to the viewport
      const mouseX = mousePosition.x - window.innerWidth / 2;
      const mouseY = mousePosition.y - window.innerHeight / 2;
  
      // Calculate the angle between player and mouse
      const angleToMouse = Math.atan2(mouseY, mouseX);
  
      // Calculate the position of the gun tip based on player position and rotation
      const gunTipX = playerPosition.x + Math.cos(angleToMouse) * gunOffsetX;
      const gunTipY = playerPosition.y + Math.sin(angleToMouse) * gunOffsetY;
  
      // Spawn a bullet at the gun tip
      const newProjectile = {
        id: Math.floor(Math.random() * Date.now()),
        position: { x: gunTipX, y: gunTipY },
        target: { x: playerPosition.x + mouseX, y: playerPosition.y + mouseY },
        angle: angleToMouse,
        distance: 10, // Bullet speed
        time: 0, // Bullet life time variable
        width: 10,
        height: 5,
        class: 'bullet',
      };

      setProjectiles((prevProjectiles) => [...prevProjectiles, newProjectile]);
  }

  useEffect(() => {
    if (isShooting && canShoot) {
      fireWeapon();
      setCanShoot(false)
      setTimeout(() => {
        setCanShoot(true)
      }, 200); // Gun fire rate
    }
  }, [isShooting, playerPosition]);

  const handleMouseDown = (e) => {
    if (e.button === 0) {
      setIsShooting(true)
    }
  };

  const handleMouseUp = (e) => {
    if (e.button === 0) {
      setIsShooting(false)
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
        const updatedProjectile = { ...prevProjectiles[i], position: { x: projectileX, y: projectileY }, time: newTime, gunFlash: false };
        
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
      enemy.health <= 0 && handleEnemyDeath(enemy)
      // Enemy chase player
      moveTowardsPlayer(enemy);
    }
  }, [playerPosition]);

  // Function to happen when colliding with player
  const playerCollision = () => {
    setPlayerHealth(prevPlayerHealth => prevPlayerHealth - 20)
  }

  // Handle enemy death
  const handleEnemyDeath = (enemy) => {
    // Remove enemy from array
    setEnemies((prevEnemies) => {
      let newEnemies = prevEnemies.filter(enm => enm.id !== enemy.id)
      return [...newEnemies]
    })

    function fiftyPercentChance() {
      return Math.random() < 0.5;
    }

    setLoot((prevLoot) => {
      if (fiftyPercentChance()) {
        const newHealthPot = {
          id: Math.floor(Math.random() * Date.now()),
            position: enemy.position, 
            type: 'health pot', 
            width: 50, 
            height: 50
        }
        return [ ...prevLoot, newHealthPot ]
      } else {
        return prevLoot
      }
    })

    // Add a kill to kill stats
    setGameStats((prevStats) => ({
      ...prevStats,
      kills: prevStats.kills + 1,
    }));
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
    if (!beginningNextLevel) {
      updateEnemies()
    }
  }, [enemies]);
  
  function timer() {
    setTimeout(() => {
      setBeginningNextLevel(false)
    }, 5000);
  }
  
  const updateEnemies = () => {
    if (enemies.length === 0 && !initiation) {
      setBeginningNextLevel(true)
      timer()
      setLevel(prevLevel => prevLevel += 1)
      setTimeout(() => {
        generateEnemies();
      }, 8000);
    }
  }

  const generateEnemies = () => {
    function getRandomInt() {
      let min = Math.ceil(1);
      let max = Math.floor(1000);

      // Generate a random integer between min and max
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    const newEnemies = []
    for (let i = 0; i <= level; i++) {
      const newEnemy = {
        id: i, 
        position: {x: getRandomInt(), y: getRandomInt()}, 
        width: 50, 
        height: 50, 
        health: 100 * level,
        maxHealth: 100 * level,
        class: 'enemy'
      }
      newEnemies.push(newEnemy)
    }
    setEnemies(newEnemies)
  }

  useEffect(() => {
    if (playerHealth <= 0) {
      setGameState(false)
      setGameOver(true)
    }
  }, [playerHealth]);
  
  useEffect(() => {
    if (gameState) {
      // Only run game-related logic when the game is not paused
      window.addEventListener('keydown', handleKeyDown);
      window.addEventListener('keyup', handleKeyUp);
      window.addEventListener('mousedown', handleMouseDown);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('mousemove', handleMouseMove);

      const interval = setInterval(() => {
        updatePlayerMovement();
      }, 4);

      return () => {
        window.removeEventListener('keydown', handleKeyDown);
        window.removeEventListener('keyup', handleKeyUp);
        window.removeEventListener('mousedown', handleMouseDown);
        window.removeEventListener('mousemove', handleMouseMove);

        clearInterval(interval);
      };
    }
  }, [gameState]);

  return (
    <>
      {gameOver && <GameOverScreen/>}
      <Header/>
      <Healthbar/>
      <Canvas
        playerPosition={playerPosition}
        obstacles={obstacles}
        enemies={enemies}
        projectiles={projectiles}
        isShooting={isShooting}
        mousePosition={mousePosition}
        loot={loot}
      />
    </>
  );
};

export default Game;

