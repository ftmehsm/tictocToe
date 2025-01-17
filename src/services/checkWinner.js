const checkWinner = (cells) => {{
    for (let i = 0; i < 3; i++) {
        if (cells[i * 3] && cells[i * 3] === cells[i * 3 + 1] && cells[i * 3] === cells[i * 3 + 2]) {
            return cells[i * 3];
        }
    }

    for (let i = 0; i < 3; i++) {
        if (cells[i] && cells[i] === cells[i + 3] && cells[i] === cells[i + 6]) {
            return cells[i];
        }
    }

    if (cells[0] && cells[0] === cells[4] && cells[0] === cells[8]) {
        return cells[0];
    }
    if (cells[2] && cells[2] === cells[4] && cells[2] === cells[6]) {
        return cells[2];
    }

    return null
}
}

export {checkWinner}