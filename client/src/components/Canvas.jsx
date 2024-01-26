import { useEffect, useRef, useState } from 'react';
import { useGame } from '../utils/GameContext';
import playerImageSrc from '../assets/Skins.png';
import weaponImageSrc from '../assets/Weapons.png';
import gunShotSrc from '../assets/GunShot.png';

const Canvas = ({
  playerPosition,
  obstacles,
  enemies,
  projectiles,
  mousePosition,
  isShooting,
  loot
}) => {
  const {gameState, level, setLevel, playerHealth, setPlayerHealth,} = useGame();
  const canvasRef = useRef(null);
  const playerImageRef = useRef(new Image());
  const weaponImageRef = useRef(new Image());
  const gunShotImgRef = useRef(new Image())

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    // Clear the canvas
    context.clearRect(0, 0, canvas.width, canvas.height);

    const drawPlayer = () => {
      // Save the current state of the canvas
      context.save();
    
      // Move the canvas origin to the center of the player
      context.translate(playerPosition.x, playerPosition.y);
    
      // Rotate the canvas
      const angleToMouse = Math.atan2(mousePosition.y - playerPosition.y, mousePosition.x - playerPosition.x);
      context.rotate(angleToMouse + 4.9);
    
      // Draw components
      drawRightArm();
      drawLeftArm();
      drawGun();
      drawBackpack();
      drawHead();
    
      // Restore the saved state to prevent the rotation affecting other drawings
      context.restore();
    };
    
    const drawBackpack = () => {
      context.drawImage(
        playerImageRef.current, 55, 100, 200, 200, -12, -38, 49, 49);
    };
    
    const drawRightArm = () => {
      context.drawImage(
        playerImageRef.current, 450, 145, 215, 215, -37, -20, 60, 65);
    };
    
    const drawLeftArm = () => {
      context.drawImage(
        playerImageRef.current, 625, 135, 300, 280, -7, -10, 70, 70);
      };
    
    const drawHead = () => {
      context.drawImage(
        playerImageRef.current, 256, 100, 200, 200, -7, -8, 40, 40);
    };
    
    const drawGun = () => {
      // Rotate the canvas for the gun
      const weaponAngleInRadians = 6.1;
      context.rotate(weaponAngleInRadians);
    
      // Draw the gun
      context.drawImage(weaponImageRef.current, 856, 400, 400, 400, -66, -20, 90, 85);
    };
    
    const drawObstacles = () => {
      // Draw obstacles
      context.fillStyle = 'black';
      obstacles.forEach((obstacle) => {
        context.fillRect(obstacle.position.x, obstacle.position.y, obstacle.width, obstacle.height);
      });
    };

    const drawPlayerCircle = () => {
      // Save the current state of the canvas
      context.save();
    
      // Move the canvas origin to the player's position
      context.translate(playerPosition.x, playerPosition.y);
    
      // Draw a small circle at the player's position
      context.beginPath();
      context.arc(0, 0, 5, 0, 2 * Math.PI);
      context.fillStyle = 'yellow'; // Set the color as needed
      context.fill();
    
      // Restore the saved state to prevent affecting other drawings
      context.restore();
    };
    
    const drawEnemies = () => {
      // Draw enemies
      enemies.forEach((enemy) => {
        // Draw the enemy
        context.fillStyle = 'red';
        context.fillRect(enemy.position.x, enemy.position.y, enemy.width, enemy.height);
      
        // Draw the health bar
        context.fillStyle = 'green';
        const healthBarHeight = 5;
        const healthBarWidth = (enemy.health / enemy.maxHealth) * 50; // Adjust based on your health range
        const healthBarY = enemy.position.y - healthBarHeight - 5; // Adjust distance from the enemy
        context.fillRect(enemy.position.x, healthBarY, healthBarWidth, healthBarHeight);
      });
    };

    const drawProjectiles = () => {
      // Draw projectiles
      context.strokeStyle = 'black';
      context.lineWidth = 3;
      
      projectiles.forEach((projectile) => {
        context.save(); // Save the current state of the canvas
        
        // Translate the canvas to the tip of the gun
        context.translate(projectile.position.x, projectile.position.y);
        
        // Rotate the canvas to match the projectile's angle
        context.rotate(projectile.angle);
        
        // Draw the projectile
        context.beginPath();
        context.moveTo(0, 0);
        context.lineTo(15, 0);
        context.stroke();

        context.restore(); // Restore the saved state to prevent the rotation affecting other drawings
      });
    };

    const drawMuzzleFlash = () => {
      let gunOffsetX = 80;
      let gunOffsetY = 80;

      // Get the mouse position relative to the viewport
      const mouseX = mousePosition.x - window.innerWidth / 2;
      const mouseY = mousePosition.y - window.innerHeight / 2;

      // Calculate the angle between player and mouse
      const angleToMouse = Math.atan2(mouseY, mouseX);

      // Calculate the position of the gun tip based on player position and rotation
      const gunTipX = playerPosition.x + Math.cos(angleToMouse) * gunOffsetX;
      const gunTipY = playerPosition.y + Math.sin(angleToMouse) * gunOffsetY;     

      const flashOptions = [820, 265, 1090, 1365] 

      const getRandomFlashOption = () => {
        const randomIndex = Math.floor(Math.random() * flashOptions.length);
        return flashOptions[randomIndex];
      };

      context.save(); // Save the current state of the canvas
    
      context.translate(gunTipX, gunTipY);
    
      context.rotate(angleToMouse);
    
      // Draw your gun sprite at the gun tip location
      context.drawImage(
        gunShotImgRef.current, 75, getRandomFlashOption(), 200, 200, -25, -50, 75, 75);
    
      context.restore();
    };
    
    const drawCrosshair = () => {
      // Set styles
      context.strokeStyle = 'white';
      context.fillStyle = 'white';

      // Draw top line
      context.beginPath();
      context.moveTo(mousePosition.x, mousePosition.y + 8);
      context.lineTo(mousePosition.x, mousePosition.y + 18);
      context.stroke();

      // Draw bottom line
      context.beginPath();
      context.moveTo(mousePosition.x, mousePosition.y - 8);
      context.lineTo(mousePosition.x, mousePosition.y - 18);
      context.stroke();
  
      // Draw right line
      context.beginPath();
      context.moveTo(mousePosition.x + 8, mousePosition.y);
      context.lineTo(mousePosition.x + 18, mousePosition.y);
      context.stroke();

      // Draw left line
      context.beginPath();
      context.moveTo(mousePosition.x - 8, mousePosition.y);
      context.lineTo(mousePosition.x - 18, mousePosition.y);
      context.stroke();
  
      // Draw dot in the center
      context.beginPath();
      context.arc(mousePosition.x, mousePosition.y, 3, 0, 2 * Math.PI);
      context.fill();
    };

    const drawLoot = () => {
      loot.forEach((lootObject) => {
        switch (lootObject.type) {
          case 'health pot':
            drawHealthPot(lootObject);
            break;
        
          case 'square':
            // Code to handle a square object
            // console.log('Handling a square object');
            break;
        
          case 'triangle':
            // Code to handle a triangle object
            // console.log('Handling a triangle object');
            break;
        
          default:
            // Code to handle other types or a default case
            // console.log('Handling other object types');
            break;
        }
      });
    }

    const drawHealthPot = (healthPot) => {
      // Save the current state of the canvas
      context.save();
    
      // Move the canvas origin to the player's position
      context.translate(healthPot.position.x, healthPot.position.y);
    
      // Calculate vertical offset based on time
      const yOffset = Math.sin(Date.now() * 0.002) * 5; // Adjust the multiplier for speed

      // Draw a 25px circle at the player's position with vertical offset
      context.beginPath();
      context.arc(0, yOffset, 12.5, 0, 2 * Math.PI); // Radius is half of the desired size (25 / 2)
      context.fillStyle = 'red'; // Set the color as needed
      context.fill();

      // Restore the saved state to prevent affecting other drawings
      context.restore();
    }
    

    const updateCanvas = () => {
      // Clear the canvas before drawing updated elements
      context.clearRect(0, 0, canvas.width, canvas.height);

      // Draw game elements
      drawProjectiles();
      drawPlayer();
      drawObstacles();
      drawEnemies();
      drawPlayerCircle();
      drawLoot()

      // Draw muzzle flash
      if (isShooting) {
        drawMuzzleFlash(); 
      }

      // Draw crosshair
      drawCrosshair(mousePosition);
    };

    // Preload sprite sheets
    playerImageRef.current.src = playerImageSrc;
    weaponImageRef.current.src = weaponImageSrc;
    gunShotImgRef.current.src = gunShotSrc;

    // Call the updateCanvas function on every animation frame
    const animationFrameId = requestAnimationFrame(() => {
      updateCanvas();
    });

    // Cleanup function
    return () => {
      playerImageRef.current.onload = null;
      weaponImageRef.current.onload = null;
      gunShotImgRef.current.onload = null;
      cancelAnimationFrame(animationFrameId);
    };
  }, [playerPosition, obstacles, enemies, projectiles]);

  return (
    <canvas
      ref={canvasRef}
      width={window.innerWidth}
      height={window.innerHeight}
      style={{
        backgroundColor: 'lightgrey',
        cursor: gameState ? 'none' : 'auto',
      }}
    />
  );
};

export default Canvas;
