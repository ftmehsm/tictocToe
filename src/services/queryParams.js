import { useEffect } from 'react';
import { loadGameFromLocalStorage, saveGameToLocalStorage } from './localStorage';



export const useQueryParams = (cells, moveHistory, isXNext, setSearchParams, winner, redoStack) => {
  useEffect(() => {
    const allNull = cells?.every((value) => value === null);
    const redoNull = redoStack?.every((value) => value === null);

    saveGameToLocalStorage(cells, moveHistory, winner, isXNext);

    setSearchParams((prevParams) => {
      const updatedParams = new URLSearchParams(prevParams);
      
      if (!allNull) {
        const currentBoardParam = JSON.stringify(cells);
        if (updatedParams.get("currentBoard") !== currentBoardParam) {
          updatedParams.set("currentBoard", currentBoardParam);
        }
      } else {
        updatedParams.delete("currentBoard");
      }

      if (!redoNull) {
        const redoParam = JSON.stringify(redoStack);
        if (updatedParams.get("redo") !== redoParam) {
          updatedParams.set("redo", redoParam);
        }
      } else {
        updatedParams.delete("redo");
      }

      const activePlayer = isXNext ? "player1" : "player2";
      if (updatedParams.get("activePlayer") !== activePlayer) {
        updatedParams.set("activePlayer", activePlayer);
      }

      if (winner && updatedParams.get("winner") !== winner) {
        updatedParams.set("winner", winner);
      } else if (!winner) {
        updatedParams.delete("winner");
      }

      const moveHistoryParam = JSON.stringify(moveHistory);
      if (moveHistory.length && updatedParams.get("moveHistory") !== moveHistoryParam) {
        updatedParams.set("moveHistory", moveHistoryParam);
      } else if (!moveHistory.length) {
        updatedParams.delete("moveHistory");
      }

      return updatedParams;
    });
  }, [cells, moveHistory, isXNext, setSearchParams, winner, redoStack]);
};


export const useInitializeQueryParams = (searchParams, setCells, setIsXNext, setMoveHistory, setWinner, setRedoStack) => {
  useEffect(() => {
    const savedGame = loadGameFromLocalStorage();

    const currentBoardParam = searchParams.get('currentBoard');
    const activePlayerParam = searchParams.get('activePlayer');
    const moveHistoryParam = searchParams.get('moveHistory');
    const winnerParam = searchParams.get('winner');
    const redoParam = searchParams.get('redo');

    if (currentBoardParam || activePlayerParam || moveHistoryParam || winnerParam || redoParam) {
      setCells(currentBoardParam ? JSON.parse(currentBoardParam) : Array(9).fill(null));
      setRedoStack(redoParam ? JSON.parse(redoParam) : []);
      setWinner(winnerParam || null);

      setIsXNext(activePlayerParam === 'player1');

      setMoveHistory(moveHistoryParam ? JSON.parse(moveHistoryParam) : []);
    } else {
      setCells(savedGame.cells || Array(9).fill(null));
      setRedoStack(savedGame.redoStack || []);
      setWinner(savedGame.winner || null);
      setIsXNext(savedGame.isXNext || true);
      setMoveHistory(savedGame.moveHistory || []);
    }
  }, [searchParams, setCells, setIsXNext, setMoveHistory, setWinner, setRedoStack]);
};
