// App.js
import React from 'react';
import Game from '../src/components/Game2';
import { GameProvider } from './utils/GameContext';
import Header from './components/header/index.jsx'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Outlet } from 'react-router-dom';

const App = () => {
  return (
    <GameProvider>
      <Outlet/>
    </GameProvider>
  );
};

export default App;
