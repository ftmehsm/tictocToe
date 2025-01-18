export const saveGameToLocalStorage = (cells, moveHistory, winner, isXNext) => {
  const gameState = {
    cells,
    moveHistory,
    winner,
    isXNext,
  };
  localStorage.setItem("ticTacToeGame", JSON.stringify(gameState));
};

export const loadGameFromLocalStorage = () => {
  const savedGame = localStorage.getItem("ticTacToeGame");
  if (savedGame) {
    return JSON.parse(savedGame);
  }
  return null;
};