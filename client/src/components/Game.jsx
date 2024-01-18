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
  const { playerPosition, setPlayerPosition, projectiles, setProjectiles, obstacles } = useGame()
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

  const playerCollisionCorrection = (playerRef, obstacleRef) => {
    let newX = playerRef.left;
    let newY = playerRef.bottom;

    if (
      playerRef.right > obstacleRef.left &&
      playerRef.right < obstacleRef.left
    ) {
      newX = playerRef.left - 5
      console.log('col');
      return { y: newY, x: newX }
    } 
    if (
      playerRef.left < obstacleRef.right &&
      playerRef.left > obstacleRef.right
    ) {
      newX = playerRef.left + 5
      return { y: newY, x: newX }
    } 
    if (
      playerRef.bottom < obstacleRef.top &&
      playerRef.bottom > obstacleRef.bottom
    ) {
      newY = playerRef.bottom + 5
      return { y: newY, x: newX }
    } 
    if (
      playerRef.top > obstacleRef.bottom &&
      playerRef.top < obstacleRef.top
    ) {
      newY = playerRef.bottom - 5
      return { y: newY, x: newX }
    } 

    return { y: newY, x: newX }
  }  

  const updatePlayerPosition = () => {    
    setPlayerPosition((prevPlayerPosition) => {
      let newX = prevPlayerPosition.x;
      let newY = prevPlayerPosition.y;
  
      if (xInput.indexOf('d') > -1) {
        newX += 5;
      } else if (xInput.indexOf('a') > -1) {
        newX -= 5;
      } 
      
      if (yInput.indexOf('w') > -1) {
        newY += 5
      } else if (yInput.indexOf('s') > -1) {
        newY -= 5;
      }

      const playerRect = {
        left: prevPlayerPosition.x,
        right: prevPlayerPosition.x + 50,
        top: prevPlayerPosition.y + 50,
        bottom: prevPlayerPosition.y,
      }

      // for (let i = 0; i < obstacles.length; i++) {
      //   const obstacle = obstacles[i];
  
      //   const obstacleRect = {
      //     left: obstacle.position.x,
      //     right: obstacle.position.x + obstacle.width, 
      //     top: obstacle.position.y + obstacle.height, 
      //     bottom: obstacle.position.y, 
      //   };
  
      //   if (
      //     playerRect.right > obstacleRect.left &&
      //     playerRect.left < obstacleRect.right &&
      //     playerRect.bottom < obstacleRect.top &&
      //     playerRect.top > obstacleRect.bottom
      //   ) {
      //     return playerCollisionCorrection(playerRect, obstacleRect)
      //   } 
      // }
 
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

  // Tick for updating player movement
  useEffect(() => {
    const interval = setInterval(() => {
      // Check for collision using the ref
     updatePlayerPosition()
    //  updateProjectiles()
    }, 16);
    
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
