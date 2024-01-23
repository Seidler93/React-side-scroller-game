// Canvas.jsx
import React, { useEffect, useRef } from 'react';

const Canvas = ({
  playerPosition,
  obstacles,
  enemies,
  projectiles,
  backgroundPosition,
  viewportPosition,
  gameWorldWidth,
  gameWorldHeight,
}) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    // Clear the canvas
    context.clearRect(0, 0, canvas.width, canvas.height);

    // Adjust player position based on viewport
    const adjustedPlayerX = playerPosition.x - viewportPosition.x;
    const adjustedPlayerY = playerPosition.y - viewportPosition.y;

    // Draw player
    const drawPlayer = () => {
      // console.log('Drawing Player', playerPosition);
      context.fillStyle = 'blue';
      context.fillRect(adjustedPlayerX, adjustedPlayerY, 20, 20);
    };

    // Draw obstacles
    const drawObstacles = () => {
      // console.log('Drawing Obstacles', obstacles);
      context.fillStyle = 'green';
      obstacles.forEach((obstacle) => {
        const adjustedObstacleX = obstacle.position.x;
        const adjustedObstacleY = obstacle.position.y;
        context.fillRect(adjustedObstacleX, adjustedObstacleY, obstacle.width, obstacle.height);
      });
    };

    // Draw enemies
    const drawEnemies = () => {
      // console.log('Drawing Enemies', enemies);
      context.fillStyle = 'red';
      enemies.forEach((enemy) => {
        const adjustedEnemyX = enemy.position.x;
        const adjustedEnemyY = enemy.position.y;
        context.fillRect(adjustedEnemyX, adjustedEnemyY, enemy.width, enemy.height);
      });
    };

  // Draw projectiles
  const drawProjectiles = () => {
    context.strokeStyle = 'black';
    context.lineWidth = 3;
    
    projectiles.forEach((projectile) => {
      context.save(); // Save the current state of the canvas
      
      // Translate the canvas to the projectile position
      context.translate(projectile.position.x, projectile.position.y);
      
      // Rotate the canvas to match the projectile's angle
      context.rotate(projectile.angle);
      
      // Draw the projectile (line in this case)
      context.beginPath();
      context.moveTo(0, 0);
      context.lineTo(15, 0); // Increase the length for more visibility
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

      // Update the background position
      const newBackgroundPosition = `${backgroundPosition.left}px ${backgroundPosition.top}px`;
      canvas.style.backgroundPosition = newBackgroundPosition;
    };

    // Call the updateCanvas function on every animation frame
    const animationFrameId = requestAnimationFrame(() => {
      updateCanvas();
    });

    // console.log(viewportPosition);

    // Cleanup function
    return () => cancelAnimationFrame(animationFrameId);
  }, [playerPosition, obstacles, enemies, projectiles, backgroundPosition]);

  return ( 
    <canvas 
      ref={canvasRef} 
      width={window.innerWidth} 
      height={window.innerHeight} 
      // width={viewportPosition.x}
      // height={viewportPosition.y}
      style={{ backgroundColor: 'lightgrey' }} // Adjust the color as needed
    />
  );
};

export default Canvas;
