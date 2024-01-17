// App.js
import React from 'react';
import Game from '../src/components/Game';
import { GameProvider } from './utils/GameContext';

const App = () => {
  return (
    <GameProvider>
      <Game />
    </GameProvider>
  );
};

export default App;
