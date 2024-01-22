import React, { useEffect, useState } from 'react';
import Player from './player/Player';
import Bullet from './projectiles/Projectile';
import Enemies from './enemies/Enemies';
import { useGame } from '../utils/GameContext';
import Obstacles from './obstacles/Obstacles';
import Projectiles from './projectiles/Projectiles';
import './game.css'

const Game = () => {
  const [backgroundPosition, setBackgroundPosition] = useState(0);
  const { level, setLevel, playerPosition, setPlayerPosition, projectiles, setProjectiles, obstacles, enemies, setEnemies } = useGame()
  // console.log(obstacles);

  let xInput = []
  let yInput = []

  const handleKeyDown = (e) => {
    // Handle key events to move the player in y direction
    if (( e.key === 'w' || e.key === 's' )
          && yInput.indexOf(e.key) === -1
      ) {
        yInput.push(e.key)
    }
    // Handle key events to move the player in x direction
    if (( e.key === 'a' || e.key === 'd' )
          && xInput.indexOf(e.key) === -1
      ) {
        xInput.push(e.key)
    }
  };

  const handleKeyUp = (e) => {
    // Handle keyup events to release pressed keys
    if (  e.key === 'w' ||
          e.key === 's' 
        ) {
          yInput.splice(yInput.indexOf(e.key), 1)
    }
    if (  e.key === 'a' ||
          e.key === 'd' 
        ) {
          xInput.splice(xInput.indexOf(e.key), 1)
    }
  };

  useEffect(() => {
    const handleMouseDown = (e) => {
      if (e.button === 0) { // Check for left mouse button (button 0)
        // Get the mouse position relative to the game container
        const mouseX = e.clientX
        // const mouseY = (e.clientY - e.target.getBoundingClientRect().height) * -1;
        const mouseY = (e.clientY - window.innerHeight) * -1;
        // Calculate the angle and distance between player and mouse
        const angle = Math.atan2(mouseY - playerPosition.y, mouseX - playerPosition.x);
        
        // Spawn a bullet at the player's position
        const newProjectile = {
          id: Math.floor(Math.random() * Date.now()),
          position: { x: playerPosition.x, y: playerPosition.y },
          target: { x: mouseX, y: mouseY },
          angle: angle,
          distance: 5, // Bullet speed
          time: 0, // Bullet life time variable
          width: 10,
          height: 5,
          class: 'bullet'
        };
  
        setProjectiles((prevProjectiles) => [...prevProjectiles, newProjectile]);
      }
    };
  
    window.addEventListener('mousedown', handleMouseDown);
  
    return () => {
      window.removeEventListener('mousedown', handleMouseDown);
    };
  }, [projectiles, playerPosition]); 

  const updatePlayerPosition = () => {    
    setPlayerPosition((prevPlayerPosition) => {
      let newX = prevPlayerPosition.x;
      let newY = prevPlayerPosition.y;
  
      if (xInput.indexOf('d') > -1) {
        newX += 2;
      } else if (xInput.indexOf('a') > -1) {
        newX -= 2;
      } 
      
      if (yInput.indexOf('w') > -1) {
        newY += 2
      } else if (yInput.indexOf('s') > -1) {
        newY -= 2;
      }

      const playerRect = {
        left: prevPlayerPosition.x,
        right: prevPlayerPosition.x + 50,
        top: prevPlayerPosition.y + 50,
        bottom: prevPlayerPosition.y,
      }

      if (newX < 0) {
        newX = 0;
      }

      if (newY < 0) {
        newY = 0;
      }

      return { y: newY, x: newX };
    })
  };
  
  useEffect(() => {
    // Add event listener for keydown and keyup events
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
  
    // Remove event listeners when component unmounts
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

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
    updateEnemies()
    
  }, [enemies]);

  const updateEnemies = () => {
    if (enemies.length === 0) {
      setLevel(prevLevel => prevLevel += 1)
      // generateEnemies()
    }
  }

  const generateEnemies = () => {
    console.log('enemy');
    function getRandomInt() {
      let min = Math.ceil(1);
      let max = Math.floor(1000);

      // Generate a random integer between min (inclusive) and max (inclusive)
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    const newEnemies = []
    for (let i = 0; i <= level; i++) {
      const newEnemy = {
        id: i, 
        position: {x: getRandomInt(), y: getRandomInt()}, 
        width: 50, 
        height: 50, 
        health: 100 * i, 
        class: 'enemy'
      }
      newEnemies.push(newEnemy)
    }
    setEnemies(newEnemies)
  }

  // Tick for updating player movement
  useEffect(() => {
    const interval = setInterval(() => {
     updatePlayerPosition()
    }, 8);
    
    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="game-container">
      <Player position={playerPosition}/>
      <Obstacles/>
      <Enemies/>
      <Projectiles/>
    </div>
  );
};

export default Game;
