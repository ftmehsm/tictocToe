import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import Cell from "./Cell";
import Players from "./Players";
import Buttons from "./Buttons";
import Moves from "./Moves";

import styles from "../styles/Board.module.css";

import { locations } from "../constants/locations";
import { checkWinner } from "../services/checkWinner";
import { useQueryParams, useInitializeQueryParams } from "../services/queryParams";

function Board() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [cells, setCells] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [winner, setWinner] = useState(null);
  const [moveHistory, setMoveHistory] = useState([]);
  const [step, setStep] = useState(1);
  const [redoStack, setRedoStack] = useState([]);

  useInitializeQueryParams(searchParams, setCells, setIsXNext, setMoveHistory, setWinner, setRedoStack);
  useQueryParams(cells, moveHistory, isXNext, setSearchParams, winner, redoStack);

  useEffect(()=>{
    if(moveHistory.length){
      stepHandler(moveHistory.length)
      const currentWinner = checkWinner(cells);

    if (currentWinner) {
      setWinner(currentWinner === "player1.svg" ? "Player 1 won" : "Player 2 won");
    } else if (cells.every((item) => item !== null)) {
      setWinner("Equal");
    } else {
      setWinner(null)
    }
    }
  },[redoStack,step])

  const clickHandler = useCallback((index) => {
    if (cells[index] !== null || winner) return;

    const newCells = [...cells];
    newCells[index] = isXNext ? "player1.svg" : "player2.svg";
    setCells(newCells);

    const newMove = locations.find((item) => item.cell === index);
    newMove.step = moveHistory.length + 1;
    newMove.player = isXNext ? "player1" : "player2";

    setMoveHistory((prevHistory) => [...prevHistory, newMove]);
    setRedoStack([]); // Clear redo stack on a new move

    const currentWinner = checkWinner(newCells);

    if (currentWinner) {
      setWinner(currentWinner === "player1.svg" ? "Player 1 won" : "Player 2 won");
    } else if (newCells.every((item) => item !== null)) {
      setWinner("Equal");
    } else {
      setIsXNext(!isXNext);
    }
  }, [cells, winner, isXNext, moveHistory]);

  const resetHandler = useCallback(() => {
    setCells(Array(9).fill(null));
    setMoveHistory([]);
    setWinner(null);
    setIsXNext(true);
    setStep(1);
    setRedoStack([]);
  }, []);

  const stepHandler = useCallback(
    (step) => {
      const selectedHistory = moveHistory.slice(0, step);
      const newCells = Array(9).fill(null);
  
      selectedHistory.forEach(({ player, cell }) => {
        newCells[cell] = player === "player1" ? "player1.svg" : "player2.svg";
      });
  
      const lastMove = selectedHistory[selectedHistory.length - 1];
      setIsXNext(lastMove?.player !== "player1"); 
      setCells(newCells);
      setWinner(null); // Clear the winner state
      setMoveHistory(selectedHistory); // Set the move history to reflect the selected state
      setStep(step);
    },
    [moveHistory]
  );
  

  const undoRedoHandler = useCallback(
    (action) => {
      if (action === "UNDO" && moveHistory.length) {
        const newHistory = [...moveHistory];
        const lastMove = newHistory.pop(); // Remove the last move
        setRedoStack((prevStack) => [lastMove, ...prevStack]); 
        setMoveHistory(newHistory);
        stepHandler(newHistory.length);
      } else if (action === "REDO" && redoStack.length) {
        const newRedoStack = [...redoStack];
        const lastRedo = newRedoStack.pop(); 
        setRedoStack(newRedoStack); 
        setMoveHistory((prevHistory) => [...prevHistory, lastRedo]); // Add the move back to history
      }
    },
    [moveHistory, redoStack, stepHandler]
  );
  

  
  return (
    <>
      <Players isXNext={isXNext} winner={winner} />
      <h3>{winner}</h3>
      <div className={styles.container}>
        <Moves moveHistory={moveHistory} stepHandler={stepHandler} />
        <div className={styles.board}>
          {cells.map((value, index) => (
            <Cell key={index} value={value} clickHandler={() => clickHandler(index)} />
          ))}
        </div>
      </div>
      <Buttons resetHandler={resetHandler} undoRedoHandler={undoRedoHandler} />
    </>
  );
}

export default Board;
