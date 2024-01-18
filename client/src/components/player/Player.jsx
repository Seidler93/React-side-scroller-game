// Player.jsx
import { useState } from 'react';
import './player.css';

const Player = ({ position }) => {

  return <div id='player' className={`player`} style={{ left: position.x, bottom: position.y }}></div>
};

export default Player;

