// GameContext.js
import React, { createContext, useContext, useState } from 'react';

const GameContext = createContext();

export const GameProvider = ({ children }) => {
  const [playerPosition, setPlayerPosition] = useState({x: window.innerWidth / 2, y: window.innerHeight / 2});
  const [projectiles, setProjectiles] = useState([]);
  const [gunFlash, setGunFlash] = useState(null);
  const [enemies, setEnemies] = useState([]);
  const [obstacles, setObstacles] = useState([]);
  const [playerHealth, setPlayerHealth] = useState(10000);
  const [maxPlayerHealth, setMaxPlayerHealth] = useState(10000);
  const [level, setLevel] = useState(1);
  const [gameState, setGameState] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [isShooting, setIsShooting] = useState(false);
  const [gameStats, setGameStats] = useState({
    kills: 0
  })

  return (
    <GameContext.Provider value={{
      isShooting, setIsShooting,
      gunFlash, setGunFlash, 
      gameStats, setGameStats, 
      gameOver, setGameOver, 
      maxPlayerHealth, setMaxPlayerHealth, 
      gameState, setGameState, 
      level, setLevel, 
      playerPosition, setPlayerPosition, 
      projectiles, setProjectiles, 
      enemies, setEnemies, 
      obstacles, setObstacles, 
      playerHealth, setPlayerHealth 
    }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  return useContext(GameContext);
};
