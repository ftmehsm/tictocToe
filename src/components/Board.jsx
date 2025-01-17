import { useEffect, useState } from "react";
import Cell from "./Cell";
import Players from "./Players";

import styles from "../styles/Board.module.css";

import { checkWinner } from "../services/checkWinner";
import { locations } from "../constants/locations";
import Buttons from "./Buttons";
import Moves from "./Moves";


function Board() {
  const [cells, setCells] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [winner, setWinner] = useState(null);
  const [moveHistory, setMoveHistory] = useState([]);
  const [step , setStep] = useState(1);
  const [redoStack, setRedoStack] = useState([]);




  
  useEffect(() => {
    const newCells = Array(9).fill(null);
  
    moveHistory.forEach(({ player, cell }) => {
      newCells[cell] = player === "player1" ? "player1.svg" : "player2.svg";
    });
  
    setCells(newCells);
    setStep(moveHistory.length); // مقدار step را بر اساس طول moveHistory تنظیم کنید
    setIsXNext(moveHistory.length % 2 === 0); // تعیین نوبت بازیکن
  }, [moveHistory]);
  
  

  const clickHandler = (index) => {
    if (cells[index] !== null || winner) return;
  
    const newCells = [...cells];
    newCells[index] = isXNext ? "player1.svg" : "player2.svg";
    setCells(newCells);
  
    const newMove = locations.find((item) => item.cell === index);
    newMove.step = moveHistory.length + 1;
    newMove.player = isXNext ? "player1" : "player2";
  
    setMoveHistory([...moveHistory, newMove]); // moveHistory تعیین‌کننده مقدار step خواهد بود
  
    const currentWinner = checkWinner(newCells);
    if (currentWinner === null && newCells.every((item) => item !== null)) {
      setWinner("Equal");
    } else if (currentWinner == "player1.svg") {
      setWinner("Player 1 won");
    } else if (currentWinner == "player2.svg") {
      setWinner("Player 2 won");
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
  
    const lastMove = selectedHistory[selectedHistory.length - 1];
    setIsXNext(lastMove?.player !== "player1");
    setCells(newCells);
  
    setWinner(null); // نیازی به تغییر step در اینجا نیست
  };
  

  const undoRedoHandler = (action) => {
    if (action === "UNDO" && moveHistory.length) {
      // حذف آخرین حرکت از moveHistory
      const newHistory = [...moveHistory];
      const lastMove = newHistory.pop();
  
      // افزودن حرکت به redoStack
      setRedoStack((prevStack) => [...prevStack, lastMove]);
  
      // به‌روزرسانی state
      setMoveHistory(newHistory);
    } else if (action === "REDO" && redoStack.length) {
      // بازیابی آخرین حرکت از redoStack
      const newRedoStack = [...redoStack];
      const lastRedo = newRedoStack.pop();
  
      // افزودن حرکت به moveHistory
      setMoveHistory((prevHistory) => [...prevHistory, lastRedo]);
      setRedoStack(newRedoStack);
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
