// GameContext.js
import React, { createContext, useContext, useState } from 'react';

const GameContext = createContext();

export const GameProvider = ({ children }) => {
  const [playerPosition, setPlayerPosition] = useState({x: window.innerWidth / 2, y: window.innerHeight / 2});
  const [projectiles, setProjectiles] = useState([]);
  const [enemies, setEnemies] = useState([]);
  const [obstacles, setObstacles] = useState([]);
  const [playerHealth, setPlayerHealth] = useState(100);
  const [level, setLevel] = useState(1);

  return (
    <GameContext.Provider value={{ level, setLevel, playerPosition, setPlayerPosition, projectiles, setProjectiles, enemies, setEnemies, obstacles, setObstacles, playerHealth, setPlayerHealth }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  return useContext(GameContext);
};
