// Obstacle.jsx
import React, { useEffect, useRef } from 'react';
import './obstacle.css';

const Obstacle = ({ id, position, onCollision }) => {
  const obstacleRef = useRef();

  useEffect(() => {
    const interval = setInterval(() => {
      // Check for collision using the ref
      const obstacleRect = obstacleRef.current.getBoundingClientRect();
      onCollision(id, obstacleRect);
    }, 16); // Adjust the interval as needed

    return () => {
      clearInterval(interval);
    };
  }, [id, onCollision]);

  return <div id={id} ref={obstacleRef} className="obstacle" style={{ left: position }}></div>;
};

export default Obstacle;
