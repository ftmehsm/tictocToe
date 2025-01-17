import styles from "../styles/Buttons.module.css"
function Buttons({resetHandler,undoRedoHandler}) {
    return (
        <div className={styles.container}>
            <button className={styles.reset} onClick={resetHandler}>
                RESET
            </button>
            <button className={styles.undo} onClick={() => undoRedoHandler("UNDO")}>
                UNDO
            </button>
            <button className={styles.redo} onClick={() => undoRedoHandler("REDO")}>
                REDO
            </button>
        </div>
    );
}

export default Buttons;