// Player.jsx
import { useState } from 'react';
import './player.css';

const Player = ({ position, isJumping }) => {
  return <div className={`player ${isJumping && 'jumping'}`} style={{ left: position }}></div>;
};

export default Player;

