import { useEffect, useState } from "react";
import Cell from "./Cell";
import Players from "./Players";

import styles from "../styles/Board.module.css";

import { checkWinner } from "../services/checkWinner";
import { locations } from "../constants/locations";
import Buttons from "./Buttons";
import Moves from "./Moves";
import { useSearchParams } from "react-router-dom";
import { useQueryParams, useInitializeQueryParams } from '../services/queryParams';



function Board() {
  
  const[searchParams,setSearchParams] = useSearchParams()
  const [cells, setCells] = useState([]);
  const [isXNext, setIsXNext] = useState(true);
  const [winner, setWinner] = useState('');
  const [moveHistory, setMoveHistory] = useState([]);
  const [step , setStep] = useState(1);
  const [redoStack, setRedoStack] = useState([]);

  useInitializeQueryParams(searchParams, setCells, setIsXNext, setMoveHistory,setWinner);
  useQueryParams(cells, moveHistory, isXNext, setSearchParams,winner);

 

  useEffect(()=>{
    if(moveHistory.length){
      stepHandler(moveHistory.length)
    }
  },[step,redoStack])



  const clickHandler = (index) => {
    if (cells[index] !== null || winner) return;
  
    const newCells = [...cells];
    newCells[index] = isXNext ? "player1.svg" : "player2.svg";
    setCells(newCells);
  
    const newMove = locations.find((item) => item.cell === index);
    newMove.step = moveHistory.length + 1;
    newMove.player = isXNext ? "player1" : "player2";
  
    setMoveHistory([...moveHistory, newMove]);
  
    const currentWinner = checkWinner(newCells);
  
    if (currentWinner) {
      if (currentWinner === "player1.svg") {
        setWinner("Player 1 won");
      } else if (currentWinner === "player2.svg") {
        setWinner("Player 2 won");
      }
    } else if (newCells.every((item) => item !== null)) {
      setWinner("Equal");
    } else {
      setIsXNext(!isXNext);
    }
  };
  

  const resetHandler = () => {
    setCells(Array(9).fill(null));
    setMoveHistory([])
    setWinner(null)
    setIsXNext(true)
    setStep(1)
  };

  const stepHandler = (step) => {
    const selectedHistory = moveHistory.slice(0, step);
    const newCells = Array(9).fill(null);
  
    selectedHistory.forEach(({ player, cell }) => {
      newCells[cell] = player === "player1" ? "player1.svg" : "player2.svg";
    });

    const lastMove = selectedHistory[selectedHistory.length-1];
    if(lastMove.player ==="player1"){
      setIsXNext(false)
    }else{
      setIsXNext(true)
    }
    
    setCells(newCells);
    setWinner(null);
    setMoveHistory(selectedHistory)
    setStep(step)
  };
  

  const undoRedoHandler = (action) => {
    if (action === "UNDO" && moveHistory.length) {
      const newHistory = [...moveHistory];
      const lastMove = newHistory.pop();
      setRedoStack((prevStack) => [...prevStack, lastMove]);
      setMoveHistory(newHistory);
      stepHandler(newHistory.length);
      setStep(step => step-1)
    } else if (action === "REDO" && redoStack.length) {
      const newRedoStack = [...redoStack];
      const lastRedo = newRedoStack.pop();
      setMoveHistory((prevHistory) => [...prevHistory, lastRedo]);
      setRedoStack(newRedoStack);
      setStep(step => step+1)
    }
  };
  

  


  return (
    <>
      <Players isXNext={isXNext} winner={winner} />
      <h3>{winner}</h3>
      <div className={styles.container}>
       <Moves moveHistory={moveHistory} stepHandler={stepHandler}/>
        <div className={styles.board}>
          {cells.map((value, index) => (
            <Cell
              key={index}
              value={cells[index]}
              clickHandler={() => clickHandler(index)}
            />
          ))}
        
        </div>
      </div>
      <Buttons resetHandler={resetHandler} undoRedoHandler={undoRedoHandler} />
    </>
  );
}

export default Board;
