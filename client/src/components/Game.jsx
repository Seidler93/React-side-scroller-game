// Game.js
import React, { useEffect, useState } from 'react';
import Player from './player/Player';
import Obstacle from './obstacle/Obstacle';
import Bullet from './projectiles/Bullet';

const Game = () => {
  const [playerPosition, setPlayerPosition] = useState({x: 300, y: 0});
  const [isJumping, setIsJumping] = useState(false);
  const [backgroundPosition, setBackgroundPosition] = useState(0);
  const [bullets, setBullets] = useState([]);

  let xInput = []
  let yInput = []

  const preplacedObstacles = [
    { id: 1, position: {x: 200, y: 0}, width: 50, height: 50 },
    { id: 2, position: {x: 400, y: 0}, width: 50, height: 50 },
    { id: 3, position: {x: 600, y: 100}, width: 50, height: 50 },
    // Add more obstacles as needed
  ];
  const [obstacles, setObstacles] = useState(preplacedObstacles);

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
        const mouseY = (e.clientY - e.target.getBoundingClientRect().height) * -1;
  
        // Calculate the angle and distance between player and mouse
        const angle = Math.atan2(mouseY - playerPosition.y, mouseX - playerPosition.x);
        
        // Spawn a bullet at the player's position
        const newBullet = {
          id: bullets.length + 1,
          position: { x: playerPosition.x, y: playerPosition.y },
          target: { x: mouseX, y: mouseY },
          angle: angle,
          distance: 5, // Bullet speed
          time: 0, // Bullet life time variable
        };
  
        setBullets((prevBullets) => [...prevBullets, newBullet]);
      }
    };
  
    window.addEventListener('mousedown', handleMouseDown);
  
    return () => {
      window.removeEventListener('mousedown', handleMouseDown);
    };
  }, [bullets, playerPosition]);
  

  const collisionCorrection = (playerRef, obstacleRef) => {
    let newX = playerRef.left;
    let newY = playerRef.bottom;

    if (
      playerRef.right >= obstacleRef.left &&
      playerRef.right <= obstacleRef.left
    ) {
      newX = playerRef.left - 5
      return { y: newY, x: newX }
    } 
    if (
      playerRef.left <= obstacleRef.right &&
      playerRef.left >= obstacleRef.right
    ) {
      newX = playerRef.left + 5
      return { y: newY, x: newX }
    } 
    if (
      playerRef.bottom <= obstacleRef.top &&
      playerRef.bottom >= obstacleRef.bottom
    ) {
      newY = playerRef.bottom + 5
      return { y: newY, x: newX }
    } 
    if (
      playerRef.top >= obstacleRef.bottom &&
      playerRef.top <= obstacleRef.top
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
      // console.log('me', playerRect);
  
      if (xInput.indexOf('d') > -1) {
        newX += 5;
      } else if (xInput.indexOf('a') > -1) {
        newX -= 5;
      } 
      
      if (yInput.includes('w') ) {
        newY += 5
      } else if (yInput.indexOf('s') > -1) {
        newY -= 5;
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
    // Move the background based on player movement
    setBackgroundPosition((prevPosition) => prevPosition - 5);
  }, [playerPosition]);

  const handleObstacleCollision = (id, obstacleRect) => {
    setPlayerPosition((prevPlayerPosition) => {
      let newX = prevPlayerPosition.x;
      let newY = prevPlayerPosition.y;

      const playerRect = {
        left: prevPlayerPosition.x,
        right: prevPlayerPosition.x + 50,
        top: prevPlayerPosition.y + 50,
        bottom: prevPlayerPosition.y,
      };

      // Collision detection
      if (
        playerRect.right >= obstacleRect.left &&
        playerRect.left <= obstacleRect.right &&
        playerRect.bottom <= obstacleRect.top &&
        playerRect.top >= obstacleRect.bottom
      ) {
        return collisionCorrection(playerRect, obstacleRect)
      } 

      return { y: newY, x: newX };
    })
  };

  const updateBullet = () => {
    setBullets((prevBullets) => {
      let newBullets = [];
      for (let i = 0; i < prevBullets.length; i++) {
        // Get the properties of the current bullet
        const { position, angle, distance, time } = prevBullets[i];
  
        // Update bullet position based on angle and distance
        const bulletX = position.x + distance * Math.cos(angle);
        const bulletY = position.y + distance * Math.sin(angle);
  
        // Update time interval by 1
        const newTime = time + 1

        // Create a new bullet object with updated position
        const updatedBullet = { ...prevBullets[i], position: { x: bulletX, y: bulletY }, time: newTime };
        
        // Add the updated bullet to the newBullets array if it's time hasn't run out
        if (newTime < 300) {
          newBullets = [...newBullets, updatedBullet];
        }
      }
      return newBullets;
    });
  };

  

  useEffect(() => {
    const interval = setInterval(() => {
      // Check for collision using the ref
     updatePlayerPosition()
     updateBullet()
    }, 16);
    
    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="game-container" style={{ backgroundPosition: `${backgroundPosition}px 0` }}>
      <Player position={playerPosition} isJumping={isJumping}/>
      {obstacles.map((obstacle) => (
        <Obstacle key={obstacle.id} id={obstacle.id} position={obstacle.position} width={obstacle.width} height={obstacle.height} handleCollision={handleObstacleCollision} />
      ))}
      {bullets.map((bullet) => (
        <Bullet key={bullet.id} position={bullet.position} target={bullet.target} />
      ))}
    </div>
  );
};

export default Game;
