import { useGame } from "../../../utils/GameContext";
import jump from "../../../utils/inputHandlers";

export default function handleKeyPress(e) {
  const { setPlayerPosition } = useGame();
  
  // Handle key events to move the player or trigger jump
  if (/(ArrowRight|D|d)/.test(e.key)) {
    setPlayerPosition((prevPosition) => prevPosition + 10);
  } else if (/(ArrowLeft|A|a)/.test(e.key)) {
    setPlayerPosition((prevPosition) => prevPosition - 10);
  } else if (e.key === ' ' || e.key === 'Spacebar') {
    // Trigger jump when the spacebar is pressed
  
  }
};

