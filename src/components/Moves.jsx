import styles from "../styles/Board.module.css"
function Moves({moveHistory,stepHandler}) {
    return (
        <div className={styles.moves}>
        {moveHistory?.map(item => <div onClick={() => stepHandler(item.step)} className={styles.move} key={item.step}>
        <span>step {item.step}</span>
        <p>{item.player} : </p>
        <p>{item.location}</p>
        </div>)}
      </div>
    );
}

export default Moves;