// GameContext.js
import React, { createContext, useContext, useState } from 'react';

const GameContext = createContext();

export const GameProvider = ({ children }) => {
  const [playerPosition, setPlayerPosition] = useState({x: 300, y: 0});
  const [projectiles, setProjectiles] = useState([]);
  const [enemies, setEnemies] = useState([]);
  const [obstacles, setObstacles] = useState([]);
  const [playerHealth, setPlayerHealth] = useState(100);

  return (
    <GameContext.Provider value={{ playerPosition, setPlayerPosition, projectiles, setProjectiles, enemies, setEnemies, obstacles, setObstacles, playerHealth, setPlayerHealth }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  return useContext(GameContext);
};
