// Game.js
import React, { useEffect, useState } from 'react';
import Player from './player/Player';
import Obstacle from './obstacle/Obstacle';
import { handleKeyPress, handleCollision } from '../utils/inputHandlers';

const Game = () => {
  const [playerPosition, setPlayerPosition] = useState(300);
  const [isJumping, setIsJumping] = useState(false);
  const [backgroundPosition, setBackgroundPosition] = useState(0);

  const preplacedObstacles = [
    { id: 1, position: 200 },
    { id: 2, position: 400 },
    // Add more obstacles as needed
  ];
  const [obstacles, setObstacles] = useState(preplacedObstacles);

  const handleKeyDown = (e) => {
    handleKeyPress(e, setPlayerPosition, playerPosition, isJumping, setIsJumping);
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  useEffect(() => {
    // Move the background based on player movement
    setBackgroundPosition((prevPosition) => prevPosition - 5); // Adjust the speed as needed
  }, [playerPosition]);

  const handleObstacleCollision = (obstacleId, obstacleRect) => {
    // console.log(obstacleId, obstacleRect);
    handleCollision(obstacleId, obstacleRect, playerPosition, setPlayerPosition);
  };

  return (
    <div className="game-container" style={{ backgroundPosition: `${backgroundPosition}px 0` }}>
      <Player position={playerPosition} isJumping={isJumping}/>
      {obstacles.map((obstacle) => (
        <Obstacle key={obstacle.id} id={obstacle.id} position={obstacle.position} onCollision={handleObstacleCollision} />
      ))}
    </div>
  );
};

export default Game;
