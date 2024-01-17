// Player.jsx
import { useState } from 'react';
import './player.css';

const Player = ({ position, isJumping }) => {
  return <div id='player' className={`player ${isJumping && 'jumping'}`} style={{ left: position.x, bottom: position.y }}></div>;
};

export default Player;

