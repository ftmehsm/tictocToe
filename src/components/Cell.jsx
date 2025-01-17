import styles from "../styles/Cell.module.css";

function Cell({value,clickHandler}) {
  return (
    <div>
      <button className={styles.cell} onClick={clickHandler}>
        <img src={value} alt="" />
      </button>
    </div>
  );
}

export default Cell;
