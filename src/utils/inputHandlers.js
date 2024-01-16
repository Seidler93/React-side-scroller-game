// inputHandlers.js

export const handleKeyPress = (e, setPlayerPosition, playerPosition, isJumping, setIsJumping) => {
  // Handle key events to move the player or trigger jump
  if (/(ArrowRight|D|d)/.test(e.key)) {
    setPlayerPosition((prevPosition) => prevPosition + 10);
  } else if (/(ArrowLeft|A|a)/.test(e.key)) {
    setPlayerPosition((prevPosition) => prevPosition - 10);
  } else if (e.key === ' ' || e.key === 'Spacebar') {
    // Trigger jump when the spacebar is pressed
    jump(isJumping, setIsJumping, setPlayerPosition);
  }
};

export const jump = (isJumping, setIsJumping) => {
  console.log('trying to jump');
  if (!isJumping) {
    setIsJumping(true);
    setTimeout(() => setIsJumping(false), 1000); // Adjust the duration of the jump
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

export default handleKeyPress

// Other functions as needed
