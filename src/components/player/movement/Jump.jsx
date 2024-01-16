import { useGame } from "../../../utils/GameContext";

export const jump = () => {
  const { isJumping, setIsJumping } = useGame();

  if (!isJumping) {
    setIsJumping(true);
    setTimeout(() => setIsJumping(false), 500); // Adjust the duration of the jump
  }
};

export default jump;
