class MinHeap {
    constructor() {
        this.heap = [];
    }

    push(value) {
        this.heap.push(value);
        this.bubbleUp();
    }

    pop() {
        if (this.heap.length === 1) return this.heap.pop();
        const min = this.heap[0];
        this.heap[0] = this.heap.pop();
        this.bubbleDown();
        return min;
    }

    bubbleUp() {
        let index = this.heap.length - 1;
        while (index > 0) {
            const parentIndex = Math.floor((index - 1) / 2);
            if (this.heap[index].eval >= this.heap[parentIndex].eval) break;
            [this.heap[index], this.heap[parentIndex]] = [this.heap[parentIndex], this.heap[index]];
            index = parentIndex;
        }
    }

    bubbleDown() {
        let index = 0;
        while (true) {
            const leftChild = 2 * index + 1;
            const rightChild = 2 * index + 2;
            let smallest = index;

            if (leftChild < this.heap.length && this.heap[leftChild].eval < this.heap[smallest].eval) smallest = leftChild;
            if (rightChild < this.heap.length && this.heap[rightChild].eval < this.heap[smallest].eval) smallest = rightChild;

            if (smallest === index) break;
            [this.heap[index], this.heap[smallest]] = [this.heap[smallest], this.heap[index]];
            index = smallest;
        }
    }

    isEmpty() {
        return this.heap.length === 0;
    }
}

const socket = io();
const chess = new Chess();
const boardElement = document.querySelector(".chessboard");
const statusElement = document.getElementById("gameStatus");
const moveIndicator = document.getElementById("moveIndicator");
const winPercentageElement = document.getElementById("winPercentage");
const whitePointsElement = document.getElementById("whitePoints");
const blackPointsElement = document.getElementById("blackPoints");

let draggedPiece = null;
let sourceSquare = null;
let playerRole = null;
let legalMoves = [];
let whiteCapturePoints = 0;
let blackCapturePoints = 0;
let moveStack = [];
let moveTree = new Map();

const PIECE_VALUES = { p: 1, n: 3, b: 3, r: 5, q: 9, k: 0 };
const POSITIONAL_BONUSES = {
    p: [0, 0, 0, 0, 0, 0, 0, 0, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.1, 0.2, 0.2, 0.3, 0.3, 0.2, 0.2, 0.1, 0, 0.1, 0.2, 0.3, 0.4, 0.3, 0.2, 0.1, 0, 0.1, 0.2, 0.3, 0.4, 0.3, 0.2, 0.1, 0, 0.1, 0.2, 0.3, 0.3, 0.2, 0.2, 0.1, 0, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    n: [0, -0.1, -0.2, -0.2, -0.2, -0.2, -0.1, 0, -0.1, 0, 0, 0, 0, 0, 0, -0.1, -0.2, 0.1, 0.2, 0.3, 0.3, 0.2, 0.1, -0.2, -0.2, 0.2, 0.4, 0.5, 0.5, 0.4, 0.2, -0.2, -0.2, 0.3, 0.5, 0.6, 0.6, 0.5, 0.3, -0.2, -0.2, 0.2, 0.4, 0.5, 0.5, 0.4, 0.2, -0.2, -0.1, 0.1, 0.2, 0.3, 0.3, 0.2, 0.1, -0.1, 0, -0.1, -0.2, -0.2, -0.2, -0.2, -0.1, 0],
    b: [-0.2, -0.1, -0.1, -0.1, -0.1, -0.1, -0.1, -0.2, -0.1, 0, 0, 0, 0, 0, 0, -0.1, -0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, -0.1, -0.1, 0.1, 0.2, 0.2, 0.2, 0.2, 0.1, -0.1, -0.1, 0.1, 0.2, 0.2, 0.2, 0.2, 0.1, -0.1, -0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, -0.1, -0.1, 0, 0, 0, 0, 0, 0, -0.1, -0.2, -0.1, -0.1, -0.1, -0.1, -0.1, -0.1, -0.2]
};

const evaluateBoard = (board) => {
    let score = 0;
    board.forEach((row, rowIndex) => {
        row.forEach((square, colIndex) => {
            if (square) {
                const pieceValue = PIECE_VALUES[square.type.toLowerCase()];
                const posIndex = (square.color === 'w' ? rowIndex : 7 - rowIndex) * 8 + colIndex;
                const posBonus = POSITIONAL_BONUSES[square.type.toLowerCase()]?.[posIndex] || 0;
                score += (square.color === 'w' ? 1 : -1) * (pieceValue + posBonus);
            }
        });
    });
    return score + (chess.in_check() ? (chess.turn() === 'w' ? -0.5 : 0.5) : 0);
};

const buildMoveTree = (depth, isMaximizing) => {
    if (depth === 0 || chess.game_over()) return { eval: evaluateBoard(chess.board()), moves: [] };

    const moveHeap = new MinHeap();
    const moves = chess.moves({ verbose: true });
    for (let move of moves) {
        chess.move(move);
        const node = buildMoveTree(depth - 1, !isMaximizing);
        chess.undo();
        moveHeap.push({ move, eval: node.eval });
        if (!moveTree.has(chess.fen())) moveTree.set(chess.fen(), new Map());
        moveTree.get(chess.fen()).set(move.san, node.eval);
    }

    return {
        eval: isMaximizing ? moveHeap.heap.reduce((max, node) => Math.max(max, node.eval), -Infinity) :
            moveHeap.heap.reduce((min, node) => Math.min(min, node.eval), Infinity),
        moves: moveHeap.heap.map(node => node.move)
    };
};

const calculateWinPercentage = () => {
    if (!playerRole || chess.game_over()) return "N/A";
    const depth = chess.moves().length < 20 ? 3 : 2;
    moveTree.clear();
    const tree = buildMoveTree(depth, chess.turn() === 'w');
    const evalScore = tree.eval;
    const absScore = Math.abs(evalScore);
    const maxScore = 39 + 2;
    let basePercentage = (absScore / maxScore) * 50;
    basePercentage = Math.min(47.5, Math.max(2.5, basePercentage));
    const advantage = evalScore > 0 ? 'White' : 'Black';
    const adjustedPercentage = 50 + (advantage === (playerRole === 'w' ? 'White' : 'Black') ? basePercentage : -basePercentage);
    return `Win Status ${Math.min(95, Math.max(5, adjustedPercentage.toFixed(1)))}%`;
};

const calculateCapturePoints = (move) => {
    if (!move?.captured) return { whitePoints: whiteCapturePoints, blackPoints: blackCapturePoints };
    const value = PIECE_VALUES[move.captured.toLowerCase()];
    if (chess.turn() === 'w') whiteCapturePoints += value;
    else blackCapturePoints += value;
    return { whitePoints: whiteCapturePoints, blackPoints: blackCapturePoints };
};

const renderBoard = () => {
    const board = chess.board();
    boardElement.innerHTML = "";

    board.forEach((row, rowIndex) => {
        row.forEach((square, colIndex) => {
            const squareElement = document.createElement("div");

            const effectiveRow = playerRole === 'b' ? 7 - rowIndex : rowIndex;
            const effectiveCol = playerRole === 'b' ? 7 - colIndex : colIndex;

            squareElement.classList.add(
                "square",
                (effectiveRow + effectiveCol) % 2 === 0 ? "light" : "dark"
            );

            squareElement.dataset.row = rowIndex;
            squareElement.dataset.col = colIndex;

            if (square) {
                const pieceElement = document.createElement("div");
                pieceElement.classList.add("piece", square.color === 'w' ? "white" : "black");
                pieceElement.innerText = square.type === 'p' ? (square.color === 'w' ? '♙' : '♙') :
                    square.type === 'n' ? (square.color === 'w' ? '♘' : '♞') :
                        square.type === 'b' ? (square.color === 'w' ? '♗' : '♝') :
                            square.type === 'r' ? (square.color === 'w' ? '♖' : '♜') :
                                square.type === 'q' ? (square.color === 'w' ? '♕' : '♛') :
                                    square.type === 'k' ? (square.color === 'w' ? '♔' : '♚') : '';
                pieceElement.draggable = playerRole === square.color;

                pieceElement.addEventListener("dragstart", (event) => {
                    if (pieceElement.draggable) {
                        draggedPiece = pieceElement;
                        sourceSquare = { row: rowIndex, col: colIndex };
                        event.dataTransfer.setData("text/plain", "");
                        console.log(`Dragging piece from ${sourceSquare.row},${sourceSquare.col}`);
                        highlightLegalMoves(sourceSquare);
                    }
                });

                pieceElement.addEventListener("dragend", () => {
                    draggedPiece = null;
                    sourceSquare = null;
                    removeHighlights();
                });

                squareElement.appendChild(pieceElement);
            }

            squareElement.addEventListener("dragover", (e) => e.preventDefault());

            squareElement.addEventListener("drop", (e) => {
                e.preventDefault();
                if (draggedPiece && sourceSquare) {
                    const targetSquare = {
                        row: parseInt(squareElement.dataset.row),
                        col: parseInt(squareElement.dataset.col),
                    };
                    console.log(`Dropped piece at ${targetSquare.row},${targetSquare.col}`);
                    handleMove(sourceSquare, targetSquare);
                    removeHighlights();
                }
            });

            boardElement.appendChild(squareElement);
        });
    });

    const lastMove = chess.history({ verbose: true }).pop();
    const { whitePoints, blackPoints } = calculateCapturePoints(lastMove);
    whitePointsElement.textContent = `Black: ${whitePoints} pts`;
    blackPointsElement.textContent = `White: ${blackPoints} pts`;
    moveStack.push(chess.fen()); // Push current state to stack

    updateGameStatus();
    updateMoveIndicator();
    if (playerRole) winPercentageElement.textContent = calculateWinPercentage();
};

const highlightLegalMoves = (sourceSquare) => {
    removeHighlights();
    const moves = chess.moves({ square: getAlgebraicNotation(sourceSquare), verbose: true });
    legalMoves = moves.map(move => ({
        from: move.from,
        to: move.to
    }));

    legalMoves.forEach(move => {
        const targetSquare = document.querySelector(`[data-row="${8 - move.to[1]}"][data-col="${move.to.charCodeAt(0) - 97}"]`);
        if (targetSquare) {
            targetSquare.classList.add("highlight-legal");
        }
    });
};

const removeHighlights = () => {
    document.querySelectorAll(".highlight-legal").forEach(el => el.classList.remove("highlight-legal"));
};

const handleMove = (sourceSquare, targetSquare) => {
    const move = {
        from: getAlgebraicNotation(sourceSquare),
        to: getAlgebraicNotation(targetSquare),
        promotion: 'q'
    };

    const legalMove = chess.move({
        from: move.from,
        to: move.to,
        promotion: move.promotion
    }, { dry_run: true });

    if (legalMove) {
        console.log("Emitting move:", move);
        socket.emit("move", move);
    } else {
        console.log("Illegal move attempted:", move);
        renderBoard();
    }
};

const getAlgebraicNotation = ({ row, col }) => {
    return `${String.fromCharCode(97 + col)}${8 - row}`;
};

const updateGameStatus = () => {
    if (chess.in_checkmate()) {
        statusElement.textContent = "Checkmate!";
        statusElement.classList.add("check");
    } else if (chess.in_stalemate()) {
        statusElement.textContent = "Stalemate!";
        statusElement.classList.remove("check");
    } else if (chess.in_check()) {
        statusElement.textContent = "Check!";
        statusElement.classList.add("check");
    } else {
        statusElement.textContent = "";
        statusElement.classList.remove("check");
    }
};

const updateMoveIndicator = () => {
    const turn = chess.turn() === 'w' ? 'White' : 'Black';
    moveIndicator.textContent = `Current Move: ${turn}`;
};

socket.on("playerRole", (role) => {
    console.log("Received playerRole:", role);
    playerRole = role;

    if (playerRole === 'b') {
        boardElement.classList.add("flipped");
    } else {
        boardElement.classList.remove("flipped");
    }

    renderBoard();
});

socket.on("spectatorRole", () => {
    console.log("Received spectatorRole");
    playerRole = null;
    boardElement.classList.remove("flipped");
    renderBoard();
});

socket.on("boardState", (fen) => {
    console.log("Received boardState:", fen);
    chess.load(fen);
    renderBoard();
});

socket.on("move", (move) => {
    console.log("Received move:", move);
    chess.move(move);
    renderBoard();
});

renderBoard();