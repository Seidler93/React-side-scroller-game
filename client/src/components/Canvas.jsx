import { useEffect, useRef, useState } from 'react';
import { useGame } from '../utils/GameContext';
import playerImageSrc from '../assets/Skins.png';
import weaponImageSrc from '../assets/Weapons.png';

const Canvas = ({
  playerPosition,
  obstacles,
  enemies,
  projectiles,
  mousePosition
}) => {
  const { level, setLevel, playerHealth, setPlayerHealth } = useGame();
  const canvasRef = useRef(null);
  const playerImageRef = useRef(new Image());
  const weaponImageRef = useRef(new Image());

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
      context.rotate(angleToMouse + 4.75);
  
      // Draw backpack
      context.drawImage(
        playerImageRef.current, 55, 100, 200, 200, -30, -38, 62, 62);
    
      // Draw the arms
      context.drawImage(
        playerImageRef.current, 500, 100, 380, 380, -40, -8, 90, 90);
    
      // Draw the head
      context.drawImage(
        playerImageRef.current, 256, 100, 200, 200, -25, -8, 50, 50);
  
      // Rotate the canvas
      const weaponAngleInRadians = 6.1;
      context.rotate(weaponAngleInRadians);
  
      // Draw the gun
      context.drawImage(weaponImageRef.current, 856, 400, 400, 400, -100, -20, 100, 100);
  
      // Restore the saved state to prevent the rotation affecting other drawings
      context.restore();
    };
    
    const drawObstacles = () => {
      // Draw obstacles
      context.fillStyle = 'green';
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
        
        // Translate the canvas to the projectile position
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

    const updateCanvas = () => {
      // Clear the canvas before drawing updated elements
      context.clearRect(0, 0, canvas.width, canvas.height);

      // Draw game elements
      drawPlayer();
      drawObstacles();
      drawEnemies();
      drawProjectiles();
      drawPlayerCircle();
    };

    // Preload player image
    playerImageRef.current.src = playerImageSrc;

    // Preload weapon image
    weaponImageRef.current.src = weaponImageSrc;

    // Call the updateCanvas function on every animation frame
    const animationFrameId = requestAnimationFrame(() => {
      updateCanvas();
    });

    // Cleanup function
    return () => {
      playerImageRef.current.onload = null;
      weaponImageRef.current.onload = null;
      cancelAnimationFrame(animationFrameId);
    };
  }, [playerPosition, obstacles, enemies, projectiles]);

  return (
    <canvas
      ref={canvasRef}
      width={window.innerWidth}
      height={window.innerHeight}
      style={{ backgroundColor: 'lightgrey' }}
    />
  );
};

export default Canvas;
