import { useEffect } from 'react';
import { loadGameFromLocalStorage, saveGameToLocalStorage } from './localStorage';

export const useQueryParams = (cells, moveHistory, isXNext, setSearchParams, winner) => {
  useEffect(() => {
    const allNull = cells?.every(value => value === null);
    const newCells =allNull ? Array(9).fill(null) : [...cells] ; 
    saveGameToLocalStorage(newCells, moveHistory, winner, isXNext);
    
    // به روز رسانی همه پارامترها در یک بار
    setSearchParams(prevParams => {
      const updatedParams = new URLSearchParams(prevParams);
      
      // فقط زمانی که newCells تغییر کرده است، به روز رسانی می‌کنیم
      if(!allNull){
        updatedParams.set('currentBoard', JSON.stringify(newCells));
      }else{
        updatedParams.delete('currentBoard');
      }

      // به روز رسانی activePlayer
      updatedParams.set('activePlayer', isXNext ? "player1" : "player2");

      // به روز رسانی moveHistory
      if (moveHistory.length) {
        updatedParams.set('moveHistory', JSON.stringify(moveHistory));
      } else {
        updatedParams.delete('moveHistory');
      }
      
      return updatedParams;
    });
  }, [moveHistory, cells, isXNext, setSearchParams, winner]);
};

// تابعی برای خواندن پارامترهای URL
export const useInitializeQueryParams = (searchParams, setCells, setIsXNext, setMoveHistory, setWinner) => {
  useEffect(() => {
    const savedGame = loadGameFromLocalStorage();
    const currentBoardParam = searchParams.get('currentBoard');
    const activePlayerParam = searchParams.get('activePlayer');
    const moveHistoryParam = searchParams.get('moveHistory');

    if (currentBoardParam && activePlayerParam && moveHistoryParam) {
      if(currentBoardParam){

        setCells(JSON.parse(currentBoardParam));
      }else{
        setCells(Array(9).fill(null));
      }

      

      if (activePlayerParam === "player1") {
        setIsXNext(true);  // player1 به معنی X
      } else if (activePlayerParam === "player2") {
        setIsXNext(false); // player2 به معنی O
      }
  
      if (moveHistoryParam) {
        setMoveHistory(JSON.parse(moveHistoryParam));
      }
      setWinner(savedGame.winner);
    }else{
      setMoveHistory(savedGame.moveHistory);
      setWinner(savedGame.winner);
      setIsXNext(savedGame.isXNext);
      setCells(savedGame.cells);
    }



  }, [searchParams, setCells, setIsXNext, setMoveHistory, setWinner]);
};