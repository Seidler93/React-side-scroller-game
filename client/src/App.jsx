// App.js
import React from 'react';
import Game from '../src/components/Game2';
import { GameProvider } from './utils/GameContext';
import Header from './components/header/index.jsx'

const App = () => {
  return (
    <GameProvider>
      <Header/>
      <Game/>
    </GameProvider>
  );
};

export default App;
