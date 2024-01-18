import './obstacle.css'
import { useGame } from '../../utils/GameContext'
import { useEffect } from 'react';
import Obstacle from './Obstacle';

export default function Obstacles() {
  const {playerPosition, setPlayerPosition, bullets, setBullets, enemies, setEnemies, obstacles, setObstacles } = useGame()

  // Temporary starter enemies
  const preplacedObstacles = [
    { id: 1, position: {x: 100, y: 500}, width: 100, height: 250, health: 100, class: 'obstacle' },
    { id: 2, position: {x: 400, y: 300}, width: 150, height: 150, health: 100, class: 'obstacle' },
    { id: 3, position: {x: 900, y: 100}, width: 150, height: 150, health: 100, class: 'obstacle' },
  ];

  // Set global enemies to the starter enemies
  useEffect(() => {
    setObstacles(preplacedObstacles)
  }, []);

  // Preventing player from overlapping an obstacle when collision is detected
  const collisionCorrection = (playerRef, obstacleRef) => {
    let newX = playerRef.left;
    let newY = playerRef.bottom;

    if (
      playerRef.right >= obstacleRef.left &&
      playerRef.right <= obstacleRef.left
    ) {
      newX = playerRef.left - 5
      return { y: newY, x: newX }
    } 
    if (
      playerRef.left <= obstacleRef.right &&
      playerRef.left >= obstacleRef.right
    ) {
      newX = playerRef.left + 5
      return { y: newY, x: newX }
    } 
    if (
      playerRef.bottom <= obstacleRef.top &&
      playerRef.bottom >= obstacleRef.bottom
    ) {
      newY = playerRef.bottom + 5
      return { y: newY, x: newX }
    } 
    if (
      playerRef.top >= obstacleRef.bottom &&
      playerRef.top <= obstacleRef.top
    ) {
      newY = playerRef.bottom - 5
      return { y: newY, x: newX }
    } 

    return { y: newY, x: newX }
  }

  // Preventing enemy from overlapping an obstacle when collision is detected
  const enemyCollisionCorrection = (enemyRef, obstacleRef) => {
    let newX = enemyRef.left;
    let newY = enemyRef.bottom;

    if (
      enemyRef.right >= obstacleRef.left &&
      enemyRef.right <= obstacleRef.left
    ) {
      newX = enemyRef.left - 15
      // return {...enemy, position: { y: newY, x: newX }};
    } 
    if (
      enemyRef.left <= obstacleRef.right &&
      enemyRef.left >= obstacleRef.right
    ) {
      newX = enemyRef.left + 15
      // return {...enemy, position: { y: newY, x: newX }};
    } 
    if (
      enemyRef.bottom <= obstacleRef.top &&
      enemyRef.bottom >= obstacleRef.bottom
    ) {
      newY = enemyRef.bottom + 15
      // return {...enemy, position: { y: newY, x: newX }};
    } 
    if (
      enemyRef.top >= obstacleRef.bottom &&
      enemyRef.top <= obstacleRef.top
    ) {
      newY = enemyRef.bottom - 15
      // return {...enemy, position: { y: newY, x: newX }};
    } 

    return { y: newY, x: newX };
  }

  // Handling collision between player and obstacle
  const handleObstacleCollision = (id, obstacleRect) => {
    setPlayerPosition((prevPlayerPosition) => {
      let newX = prevPlayerPosition.x;
      let newY = prevPlayerPosition.y;

      const playerRect = {
        left: prevPlayerPosition.x,
        right: prevPlayerPosition.x + 50,
        top: prevPlayerPosition.y + 50,
        bottom: prevPlayerPosition.y,
      };

      // Collision detection
      if (
        playerRect.right >= obstacleRect.left &&
        playerRect.left <= obstacleRect.right &&
        playerRect.bottom <= obstacleRect.top &&
        playerRect.top >= obstacleRect.bottom
      ) {
        return collisionCorrection(playerRect, obstacleRect)
      } 

      return { y: newY, x: newX };
    })

    setEnemies((prevEnemies) => {
      let newEnemies = []

      for (let i = 0; i < prevEnemies.length; i++) {
        let enemy = prevEnemies[i];

        const enemyRect = {
          left: enemy.position.x,
          right: enemy.position.x + enemy.width, 
          top: enemy.position.y + enemy.height, 
          bottom: enemy.position.y, 
        };
        
        // Collision detection
        if (
          enemyRect.right >= obstacleRect.left &&
          enemyRect.left <= obstacleRect.right &&
          enemyRect.bottom <= obstacleRect.top &&
          enemyRect.top >= obstacleRect.bottom
        ) {
          newEnemies = [...newEnemies, {...enemy, position: enemyCollisionCorrection(enemyRect, obstacleRect)}];
        } else {
          newEnemies = [...newEnemies, {...enemy, position: enemyCollisionCorrection(enemyRect, obstacleRect)}];
        }

      }
      return newEnemies
    })
  };


  return (
    <>
      {obstacles.map((obstacle) => (
        <Obstacle itemClass={obstacle.class} key={obstacle.id} id={obstacle.id} position={obstacle.position} width={obstacle.width} height={obstacle.height} handleCollision={handleObstacleCollision} />
      ))}
    </>
  )
}