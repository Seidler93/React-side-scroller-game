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
    setPlayerPosition((prevPlayerPosition) => {
      let newX = prevPlayerPosition.x;
      let newY = prevPlayerPosition.y;

      if (xInput.indexOf('d') > -1) {
        newX += 2;
      } else if (xInput.indexOf('a') > -1) {
        newX -= 2;
      }

      if (yInput.indexOf('w') > -1) {
        newY -= 2;
      } else if (yInput.indexOf('s') > -1) {
        newY += 2;
      }

      // Additional checks or constraints can be added here

      return { y: newY, x: newX };
    });
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    const interval = setInterval(() => {
      updatePlayerPosition();
      updateViewportPosition();
    }, 8);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      clearInterval(interval);
    };
  }, []); // Empty dependency array to ensure the event listeners are added only once

  const updateViewportPosition = () => {
    setViewportPosition((prevViewportPosition) => {
      const newViewportPosition = { ...prevViewportPosition };
      const playerX = playerPosition.x;
      const playerY = playerPosition.y;

      // Adjust viewport position based on player position
      newViewportPosition.x = Math.max(0, Math.min(playerX - viewportSize.width / 2, maxViewportPosition.x));
      newViewportPosition.y = Math.max(0, Math.min(playerY - viewportSize.height / 2, maxViewportPosition.y));

      console.log(newViewportPosition);
      return newViewportPosition;
    });
  };

//   let xInput = []
//   let yInput = []

//   const handleKeyDown = (e) => {
//     // console.log(e.key);
//     // Handle key events to move the player in y direction
//     if (( e.key === 'w' || e.key === 's' )
//           && yInput.indexOf(e.key) === -1
//       ) {
//         yInput.push(e.key)
//     }
//     // Handle key events to move the player in x direction
//     if (( e.key === 'a' || e.key === 'd' )
//           && xInput.indexOf(e.key) === -1
//       ) {
//         xInput.push(e.key)
//     }

//     if (e.key === 'i') {
//       const gameContainer = document.querySelector('.game-container');
//       gameContainer.style.backgroundPosition = '500px!important 500px!important';
//       console.log(gameContainer);
//     }
//   };

//   const handleKeyUp = (e) => {
//     // Handle keyup events to release pressed keys
//     if (  e.key === 'w' ||
//           e.key === 's' 
//         ) {
//           yInput.splice(yInput.indexOf(e.key), 1)
//     }
//     if (  e.key === 'a' ||
//           e.key === 'd' 
//         ) {
//           xInput.splice(xInput.indexOf(e.key), 1)
//     }
//   };

//   useEffect(() => {
//     const handleMouseDown = (e) => {
//       if (e.button === 0) { // Check for left mouse button (button 0)
//         // Get the mouse position relative to the game container
//         const mouseX = e.clientX 
//         // const mouseY = (e.clientY - e.target.getBoundingClientRect().height) * -1;
//         const mouseY = e.clientY * -1;
//         // const mouseY = (e.clientY - window.innerHeight) * -1;
//         // Calculate the angle and distance between player and mouse
//         const angle = Math.atan2(mouseY + playerPosition.y, mouseX - playerPosition.x);
        
//         // Spawn a bullet at the player's position
//         const newProjectile = {
//           id: Math.floor(Math.random() * Date.now()),
//           position: { x: playerPosition.x, y: playerPosition.y },
//           target: { x: mouseX, y: mouseY },
//           angle: angle,
//           distance: 5, // Bullet speed
//           time: 0, // Bullet life time variable
//           width: 10,
//           height: 5,
//           class: 'bullet'
//         };
  
//         setProjectiles((prevProjectiles) => [...prevProjectiles, newProjectile]);
//       }
//     };
  
//     window.addEventListener('mousedown', handleMouseDown);
  
//     return () => {
//       window.removeEventListener('mousedown', handleMouseDown);
//     };
//   }, [projectiles, playerPosition]); 

//   const updatePlayerPosition = () => {    
//     setPlayerPosition((prevPlayerPosition) => {
//       let newX = prevPlayerPosition.x;
//       let newY = prevPlayerPosition.y;
  
//       if (xInput.indexOf('d') > -1) {
//         newX += 2;
//       } else if (xInput.indexOf('a') > -1) {
//         newX -= 2;
//       } 
      
//       if (yInput.indexOf('w') > -1) {
//         newY += 2
//       } else if (yInput.indexOf('s') > -1) {
//         newY -= 2;
//       }

//       if (newX < 0) {
//         newX = 0;
//       }

//       if (newY < 0) {
//         newY = 0;
//       }

//       return { y: newY, x: newX };
//     })
//   };
  
//   useEffect(() => {
//     // Add event listener for keydown and keyup events
//     window.addEventListener('keydown', handleKeyDown);
//     window.addEventListener('keyup', handleKeyUp);
  
//     // Remove event listeners when component unmounts
//     return () => {
//       window.removeEventListener('keydown', handleKeyDown);
//       window.removeEventListener('keyup', handleKeyUp);
//     };
//   }, [])

//   useEffect(() => {
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
//   }, [playerPosition]);

//   useEffect(() => {
//     updateEnemies()
    
//   }, [enemies]);

//   const updateEnemies = () => {
//     if (enemies.length === 0) {
//       setLevel(prevLevel => prevLevel += 1)
//       // generateEnemies()
//     }
//   }

//   const generateEnemies = () => {
//     console.log('enemy');
//     function getRandomInt() {
//       let min = Math.ceil(1);
//       let max = Math.floor(1000);

//       // Generate a random integer between min (inclusive) and max (inclusive)
//       return Math.floor(Math.random() * (max - min + 1)) + min;
//     }

//     const newEnemies = []
//     for (let i = 0; i <= level; i++) {
//       const newEnemy = {
//         id: i, 
//         position: {x: getRandomInt(), y: getRandomInt()}, 
//         width: 50, 
//         height: 50, 
//         health: 100 * i, 
//         class: 'enemy'
//       }
//       newEnemies.push(newEnemy)
//     }
//     setEnemies(newEnemies)
//   }

//   const lastScrollTimeRef = useRef(0);

// useEffect(() => {
//   // console.log(backgroundPosition.right);
//   setBackgroundPosition((prevBackgroundPosition) => {

//     let newRight = prevBackgroundPosition.right;
//     let newLeft = prevBackgroundPosition.left;
//     let newTop = prevBackgroundPosition.top;
//     let newBottom = prevBackgroundPosition.bottom;

//     // console.log(windowHeight, windowWidth, playerPosition);

//     const currentTime = Date.now();

//     // Add a delay between scrolls (e.g., 500 milliseconds)
//     // if (currentTime - lastScrollTimeRef.current < 100) {
//     //   return prevBackgroundPosition;
//     // }

//     if (playerPosition.x > prevBackgroundPosition.right - 100) {
//       window.scrollTo({
//         left: playerPosition.x + 100 - window.innerWidth,
//         behavior: 'smooth',
//       });
//       newRight += 100;
//       newLeft += 100
//     }
    
//     if (playerPosition.x < prevBackgroundPosition.left + 100) {
//       window.scrollTo({
//         left: playerPosition.x - 100,
//         behavior: 'smooth',
//       });
//       newRight -= 100;
//       newLeft -= 100
//     }
    
//     // console.log(playerPosition.y, prevBackgroundPosition.top - 200);
//     if (playerPosition.y > prevBackgroundPosition.top - 200) {
//       window.scrollTo({
//         top: 10000 - (playerPosition.y + 200),
//         behavior: 'smooth',
//       });
//       newTop += 200;
//       newBottom += 200
//     }

//     if (playerPosition.y < prevBackgroundPosition.bottom - 200) {
//       window.scrollTo({
//         top: 10000 - (playerPosition.y),
//         behavior: 'smooth',
//       });
//       newTop -= 200;
//       newBottom -= 200
//     }

//   //  console.log({
//   //   right: newRight,
//   //   left: newLeft,
//   //   top: newTop,
//   //   bottom: newBottom,
//   // });

   

//     // Update the last scroll time
//     lastScrollTimeRef.current = currentTime;
//     // console.log(newRight);

//     // Return the updated backgroundPosition
//     return {
//       right: newRight,
//       left: newLeft,
//       top: newTop,
//       bottom: newBottom,
//     };
//   });
// }, [playerPosition]);

// useEffect(() => {
//   setBackgroundPosition((prevBackgroundPosition) => {
//     const edgeThreshold = 20; // Adjust this threshold as needed
//     const windowWidth = window.innerWidth;
//     const windowHeight = window.innerHeight;

//     let newRight = prevBackgroundPosition.right;
//     let newLeft = prevBackgroundPosition.left;
//     let newTop = prevBackgroundPosition.top;
//     let newBottom = prevBackgroundPosition.bottom;

//     const currentTime = Date.now();

//     // Add a delay between scrolls (e.g., 500 milliseconds)
//     if (currentTime - lastScrollTimeRef.current < 100) {
//       return prevBackgroundPosition;
//     }

//     if (playerPosition.x > prevBackgroundPosition.right - 100) {
//       newRight += 100;
//       newLeft += 100;
//     }

//     if (playerPosition.x < prevBackgroundPosition.left + 100) {
//       newRight -= 100;
//       newLeft -= 100;
//     }

//     if (playerPosition.y > prevBackgroundPosition.top - 200) {
//       newTop += 200;
//       newBottom += 200;
//     }

//     if (playerPosition.y < prevBackgroundPosition.bottom - 200) {
//       newTop -= 200;
//       newBottom -= 200;
//     }

//     // Update the style directly
//     const gameContainer = document.querySelector('.game-container');
//     if (gameContainer) {
//       gameContainer.style.backgroundPosition = `${newLeft}px ${newTop}px`;
//     }

//     // Update the last scroll time
//     lastScrollTimeRef.current = currentTime;

//     // Return the updated backgroundPosition
//     return {
//       right: newRight,
//       left: newLeft,
//       top: newTop,
//       bottom: newBottom,
//     };
//   });
// }, [playerPosition]);



  // // Tick for updating player movement
  // useEffect(() => {
  //   const interval = setInterval(() => {
  //    updatePlayerPosition()
  //   }, 8);
    
  //   return () => {
  //     clearInterval(interval);
  //   };
  // }, []);

  return (
    <Canvas
      playerPosition={playerPosition}
      obstacles={obstacles}
      enemies={enemies}
      projectiles={projectiles}
      backgroundPosition={backgroundPosition}
      viewportPosition={viewportPosition}
    />
  );
};

export default Game;
