// GameContext.js
import React, { createContext, useContext, useState } from 'react';

const GameContext = createContext();

export const GameProvider = ({ children }) => {
  const [playerPosition, setPlayerPosition] = useState(10);
  const [isJumping, setIsJumping] = useState(false)

  return (
    <GameContext.Provider value={{ playerPosition, setPlayerPosition, isJumping, setIsJumping }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  return useContext(GameContext);
};
