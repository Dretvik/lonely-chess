const board = document.getElementById("board");
let currentPosition = [];

function createBackline(row, color) {
    return [
        new Rook(0, row, color),
        new Knight(1, row, color),
        new Bishop(2, row, color),
        new Queen(3, row, color),
        new King(4, row, color),
        new Bishop(5, row, color),
        new Knight(6, row, color),
        new Rook(7, row, color),
    ];
}

function createPawns(row, color) {
    const pawns = [];
    for (let col = 0; col < 8; col++) {
        pawns.push(new Pawn(col, row, color));
    }
    return pawns;
}

function createStartingPosition() {
    const newBoard = [
        createBackline(0, "black"),
        createPawns(1, "black"),
        new Array(8).fill(null),
        new Array(8).fill(null),
        new Array(8).fill(null),
        new Array(8).fill(null),
        createPawns(6, "white"),
        createBackline(7, "white"),
    ];
    console.log(newBoard);
    return newBoard;
}

function createIdString(row, col) {
    return `${row}-${col}`;
}

function createTilesHTML() {
    for (let row = 0; row < currentPosition.length; row++) {
        for (let col = 0; col < currentPosition[0].length; col++) {
            tile = document.createElement("div");
            tile.id = createIdString(row, col);
            tile.classList.add("tile");
            if (row % 2) tile.classList.add("odd");
            tile.addEventListener("mousedown", (event) => {
                handleClick(event, row, col);
            });
            board.append(tile);
        }
    }
}

function handleClick(event, row, col) {
    clearPossibleMovesCSS();
    if (!currentPosition[row][col]) return;
    if (event.altKey) {
        // Temporary event listener for testing purposes
        // If you hold Alt when clicking a piece, it deletes the piece!
        // Used for testing collision updates for now
        currentPosition[row][col] = null;
        drawCurrentPosition();
    } else {
        const possibleMoves =
            currentPosition[row][col].getPossibleMoves(currentPosition);
        showPossibleMoves(possibleMoves);
        getTileElement(row, col).classList.add("selected-piece");
    }
}

function getTileElement(row, col) {
    return document.getElementById(`${row}-${col}`);
}

function drawCurrentPosition() {
    /*
     * A 2D array holds the position data for each square.
     * Each element in the array contains one of two options:
     *
     *      If there is no piece, the element is null.
     *
     *      If there is a piece, the element is an instance of a subclass
     *      of Piece corresponding to the piece in the square.
     *
     * Each instance of Piece has its own getPossibleMoves method.
     * This method is attached to an event listener.
     */
    for (let row = 0; row < currentPosition.length; row++) {
        for (let col = 0; col < currentPosition[0].length; col++) {
            const currentPiece = currentPosition[row][col];
            const currentTileElement = getTileElement(row, col);
            if (currentPiece) {
                const pieceText = currentPiece.symbol;
                const IS_WHITE = currentPiece.color === "white";
                const IS_BLACK = !IS_WHITE;
                currentTileElement.textContent = pieceText;
                currentTileElement.classList.toggle("white", IS_WHITE);
                currentTileElement.classList.toggle("black", IS_BLACK);
            } else {
                currentTileElement.textContent = "";
            }
        }
    }
}

function showPossibleMoves(possibleMoves) {
    console.log(possibleMoves);
    if (!possibleMoves.length) return;
    for (const { row, col, attack } of possibleMoves) {
        const tile = getTileElement(row, col);
        const classString = attack ? "possible-attack" : "possible-move";
        tile.classList.add(classString);
    }
}

function clearPossibleMovesCSS() {
    const tilesToClear = document.querySelectorAll(
        ".possible-move, .possible-attack, .selected-piece"
    );
    for (const tile of tilesToClear) {
        tile.classList.remove(
            "possible-move",
            "possible-attack",
            "selected-piece"
        );
    }
}
