// Obstacle.jsx
import React, { useEffect, useRef } from 'react';
import './obstacle.css';

const Obstacle = ({ id, position, height, width, handleCollision }) => {

  useEffect(() => {
    const interval = setInterval(() => {
      const obstacleRect = {
        left: position.x,
        right: position.x + width, 
        top: position.y + height, 
        bottom: position.y, 
      };
      // Check for collision using the ref
      handleCollision(id, obstacleRect);
    }, 8); // Adjust the interval as needed

    return () => {
      clearInterval(interval);
    };
  }, [id, handleCollision]);

  return <div id={id} className="obstacle" style={{ left: position.x, bottom: position.y , width: width, height: height}}></div>;
};

export default Obstacle;
