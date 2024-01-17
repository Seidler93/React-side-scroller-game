// inputHandlers.js
let pressedKeys = [];

export const handleKeyDown = (e, setIsJumping, setPlayerPosition, isJumping) => {
  // Handle key events to move the player or trigger jump
  if (( e.key === 'd' ||  
        e.key === 'a' ||
        e.key === ' ' )
        && pressedKeys.indexOf(e.key) === -1
    ) {
    pressedKeys.push(e.key);
  }
};

export const handleKeyUp = (e) => {
  // Handle keyup events to release pressed keys
  if (  e.key === 'd' ||
        e.key === 'a' ||
        e.key === ' ') {
    pressedKeys.splice(pressedKeys.indexOf(e.key), 1)
  }
};


export const jump = (isJumping, setIsJumping, setPlayerPosition) => {
  console.log('trying to jump');
  if (!isJumping) {
    setIsJumping(true);
    setTimeout(() => {
      // setPlayerPosition((prevPosition) => prevPosition)
      setIsJumping(false)
    }, 1000); // Adjust the duration of the jump
  }
};

export const handleCollision = (obstacleId, obstacleRect, playerPosition, setPlayerPosition, playerWidth) => {
  const playerRect = document.querySelector('.player').getBoundingClientRect();

  if (
    playerRect.left < obstacleRect.right &&
    playerRect.right > obstacleRect.left &&
    playerRect.top < obstacleRect.bottom &&
    playerRect.bottom > obstacleRect.top
  ) {
    const newPosition =
      obstacleRect.left < playerRect.left
        ? obstacleRect.right // Move player to the right of the obstacle
        : obstacleRect.left - 50; // Move player to the left of the obstacle

    setPlayerPosition(newPosition);
  }
};

export default handleKeyDown

// Other functions as needed
