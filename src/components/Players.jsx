import styles from "../styles/Players.module.css"

function Players({isXNext , winner}) {

    return (
        <div className={styles.container}>
            <div className={styles.players}>
            <div className={isXNext && !winner ? styles.player : null }>
                <img src="/player1.png" alt="" />
            </div>
            <div className={!isXNext && !winner ? styles.player : null}>
            <img src="/player2.png" alt="" />
            </div>
            </div>
        </div>
    );
}

export default Players;