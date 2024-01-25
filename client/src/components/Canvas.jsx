// Canvas.jsx
import { useEffect, useRef } from 'react';
import { useGame } from '../utils/GameContext';

const Canvas = ({
  playerPosition,
  obstacles,
  enemies,
  projectiles,  
}) => {
  const { 
    level, setLevel,
    playerHealth, setPlayerHealth 
  } = useGame()

  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    // Clear the canvas
    context.clearRect(0, 0, canvas.width, canvas.height);

    // Draw player
    const drawPlayer = () => {
      // console.log('Drawing Player', playerPosition);
      context.fillStyle = 'blue';
      context.fillRect(playerPosition.x, playerPosition.y, 20.5, 20.5);
    };

    // Draw obstacles
    const drawObstacles = () => {
      // console.log('Drawing Obstacles', obstacles);
      context.fillStyle = 'green';
      obstacles.forEach((obstacle) => {
        context.fillRect(obstacle.position.x, obstacle.position.y, obstacle.width, obstacle.height);
      });
    };

    // Draw enemies
    const drawEnemies = () => {
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
    };

    // Call the updateCanvas function on every animation frame
    const animationFrameId = requestAnimationFrame(() => {
      updateCanvas();
    });

    // Cleanup function
    return () => cancelAnimationFrame(animationFrameId);
  }, [playerPosition, obstacles, enemies, projectiles,]);

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
