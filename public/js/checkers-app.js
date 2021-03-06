const socket = io();
import { enableChat } from "./chat.js";

const loggedUser = JSON.parse(sessionStorage.getItem("loggedUser"));

if (!loggedUser) {
    location.href = "/login";
} else {
    document.querySelector(".user-info").style.display = "flex";
}

const checkersBoard = document.getElementById("board");
// console.log(checkersBoard);
const createEmptyCell = (isWhite) => ({
    isWhiteCell: isWhite,
});
const createCheckerPiece = (isWhite, isKing) => ({
    isWhitePiece: isWhite,
    isKing: isKing,
});
const whiteEmptyCell = createEmptyCell(true);
const blackEmptyCell = createEmptyCell(false);
const whiteCheckerPiece = createCheckerPiece(true, false);
const blackCheckerPiece = createCheckerPiece(false, false);
const whiteKing = createCheckerPiece(true, true);
const blackKing = createCheckerPiece(false, true);
const Board = [
    [
        whiteEmptyCell,
        blackCheckerPiece,
        whiteEmptyCell,
        blackCheckerPiece,
        whiteEmptyCell,
        blackCheckerPiece,
        whiteEmptyCell,
        blackCheckerPiece,
    ],
    [
        blackCheckerPiece,
        whiteEmptyCell,
        blackCheckerPiece,
        whiteEmptyCell,
        blackCheckerPiece,
        whiteEmptyCell,
        blackCheckerPiece,
        whiteEmptyCell,
    ],
    [
        whiteEmptyCell,
        blackCheckerPiece,
        whiteEmptyCell,
        blackCheckerPiece,
        whiteEmptyCell,
        blackCheckerPiece,
        whiteEmptyCell,
        blackCheckerPiece,
    ],
    [
        blackEmptyCell,
        whiteEmptyCell,
        blackEmptyCell,
        whiteEmptyCell,
        blackEmptyCell,
        whiteEmptyCell,
        blackEmptyCell,
        whiteEmptyCell,
    ],
    [
        whiteEmptyCell,
        blackEmptyCell,
        whiteEmptyCell,
        blackEmptyCell,
        whiteEmptyCell,
        blackEmptyCell,
        whiteEmptyCell,
        blackEmptyCell,
    ],
    [
        whiteCheckerPiece,
        whiteEmptyCell,
        whiteCheckerPiece,
        whiteEmptyCell,
        whiteCheckerPiece,
        whiteEmptyCell,
        whiteCheckerPiece,
        whiteEmptyCell,
    ],
    [
        whiteEmptyCell,
        whiteCheckerPiece,
        whiteEmptyCell,
        whiteCheckerPiece,
        whiteEmptyCell,
        whiteCheckerPiece,
        whiteEmptyCell,
        whiteCheckerPiece,
    ],
    [
        whiteCheckerPiece,
        whiteEmptyCell,
        whiteCheckerPiece,
        whiteEmptyCell,
        whiteCheckerPiece,
        whiteEmptyCell,
        whiteCheckerPiece,
        whiteEmptyCell,
    ],
];

// const Board = [
//     [
//         whiteEmptyCell,
//         blackEmptyCell,
//         whiteEmptyCell,
//         blackEmptyCell,
//         whiteEmptyCell,
//         blackEmptyCell,
//         whiteEmptyCell,
//         blackEmptyCell,
//     ],
//     [
//         blackEmptyCell,
//         whiteEmptyCell,
//         blackEmptyCell,
//         whiteEmptyCell,
//         blackEmptyCell,
//         whiteEmptyCell,
//         blackEmptyCell,
//         whiteEmptyCell,
//     ],
//     [
//         whiteEmptyCell,
//         blackEmptyCell,
//         whiteEmptyCell,
//         blackEmptyCell,
//         whiteEmptyCell,
//         blackEmptyCell,
//         whiteEmptyCell,
//         blackEmptyCell,
//     ],
//     [
//         blackEmptyCell,
//         whiteEmptyCell,
//         blackEmptyCell,
//         whiteEmptyCell,
//         blackEmptyCell,
//         whiteEmptyCell,
//         blackCheckerPiece,
//         whiteEmptyCell,
//     ],
//     [
//         whiteEmptyCell,
//         blackEmptyCell,
//         whiteEmptyCell,
//         blackEmptyCell,
//         whiteEmptyCell,
//         whiteCheckerPiece,
//         whiteEmptyCell,
//         blackEmptyCell,
//     ],
//     [
//         blackEmptyCell,
//         whiteEmptyCell,
//         blackEmptyCell,
//         whiteEmptyCell,
//         blackEmptyCell,
//         whiteEmptyCell,
//         blackEmptyCell,
//         whiteEmptyCell,
//     ],
//     [
//         whiteEmptyCell,
//         blackEmptyCell,
//         whiteEmptyCell,
//         blackEmptyCell,
//         whiteEmptyCell,
//         blackEmptyCell,
//         whiteEmptyCell,
//         blackEmptyCell,
//     ],
//     [
//         blackEmptyCell,
//         whiteEmptyCell,
//         blackEmptyCell,
//         whiteEmptyCell,
//         blackEmptyCell,
//         whiteEmptyCell,
//         blackEmptyCell,
//         whiteEmptyCell,
//     ],
// ];

const BoardUI = new Array(8);
function createCell(addCell, row, col, isWhite) {
    checkersBoard.appendChild(addCell);
    addCell.setAttribute("id", "row-" + (row + 1) + " col-" + (col + 1));
    switch (isWhite) {
        case true:
            addCell.classList.add("white", "cell");
            break;
        case false:
            addCell.classList.add("black", "cell");
            break;
    }
}

function createChecker(addCell, piece) {
    const addChecker = document.createElement("button");
    addCell.appendChild(addChecker);
    switch (piece.isWhitePiece) {
        case true:
            addChecker.classList.add("checker", "white-checker");
            break;
        case false:
            addChecker.classList.add("checker", "black-checker");
            break;
    }
}

const createBoard = (Board) => {
    let isWhite = true;
    for (let i = 0; i < 8; i++) {
        isWhite = i % 2 === 0 ? true : false; // Determines the color of the cell
        BoardUI[i] = new Array(8);
        for (let j = 0; j < 8; j++) {
            const addCell = document.createElement("div");
            createCell(addCell, i, j, isWhite);
            if (Board[i][j] === whiteCheckerPiece || Board[i][j] === blackCheckerPiece)
                // If there should be a piece, create it
                createChecker(addCell, Board[i][j]);
            else {
                // If not, declare cell as empty
                const addEmpty = document.createElement("div");
                addCell.appendChild(addEmpty);
                addEmpty.classList.add("empty-cell");
            }
            BoardUI[i][j] = document.getElementById("row-" + (i + 1) + " col-" + (j + 1));
            addEventListenersToCheckers(i, j);
            isWhite = !isWhite;
        }
    }
    socket.on("move", (fromRow, fromCol, toRow, toCol, isTryingToCapture, isCrownedThisTurn, piecesCapturedThisTurn) => {
        movePieceForAllSockets(fromRow, fromCol, toRow, toCol, isTryingToCapture, isCrownedThisTurn, piecesCapturedThisTurn);
    });
};
createBoard(Board);
enableChat()

// window.onload = () => {
    // const color = loggedUser.isWhite ? "White" : "Black"
    // displayAlertsModal(`You are playing ${color}`, "#343a40", 3000)
// }

let isCheckerSelected, isCrownedThisTurn;
let fromRow, fromCol, fromCell, toCell;
let isWhiteTurn = true;
let targetPieceRow, targetPieceCol;
let isTryingToCapture, cellToCapture, mustBeCaptured;
let cellsToCapture = [],
    forcedRow = [],
    forcedCol = [];
let piecesCapturedThisTurn = 0;

function displayAlertsModal (message, color, timeout) {
    const inGameAlertsModal = document.getElementById("inGame-messages-modal")
    const inGameAlertsModalContent = document.getElementById("inGame-messages-modal-content")
    // const inGameAlertsModalContent = document.getElementById("inGame-messages-modal-content")
    const alertContent = document.getElementById("alert-message")
    alertContent.innerHTML = "";
    setTimeout(() => {
        inGameAlertsModalContent.style.width = "45%"
    }, 200);
    inGameAlertsModal.style.visibility = "visible"
    inGameAlertsModal.style.opacity = "1"
    alertContent.innerHTML = message;
    alertContent.style.color = color;
    setTimeout(() => {
        inGameAlertsModal.style.visibility = "hidden"
        inGameAlertsModal.style.opacity = "0"
    }, timeout);
}

function showLegalMovesAvailable(isWhiteTurn, fromRow, fromCol) {
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            if (isLegalMove(isWhiteTurn, fromRow, fromCol, i, j)) {
                if (BoardUI[i][j].classList[2] !== "available-move") {
                    BoardUI[i][j].classList.add("available-move");
                }
            }
        }
    }
}
function hideLegalMovesAvailable() {
    let hideAvailableMoves = document.getElementsByClassName("available-move");
    while (hideAvailableMoves.length !== 0) hideAvailableMoves[0].classList.remove("available-move");
}
function deselectPieces() {
    let selectedPieces = document.getElementsByClassName("selected");
    while (selectedPieces.length !== 0) {
        selectedPieces[0].classList.remove("selected");
    }
}
function selectPiece(i, j) {
    BoardUI[i][j].children[0].classList.add("selected");
    // fromCell = BoardUI[i][j].children[0];
    fromRow = i;
    fromCol = j;
    isCheckerSelected = true;
}
function movePiece(fromRow, fromCol, toRow, toCol, isTryingToCapture) {
    Board[toRow][toCol] = Board[fromRow][fromCol];
    Board[fromRow][fromCol] = blackEmptyCell;
    fromCell = BoardUI[fromRow][fromCol].children[0];
    toCell = BoardUI[toRow][toCol].children[0];
    fromCell.classList.remove("selected");
    BoardUI[toRow][toCol].removeChild(BoardUI[toRow][toCol].children[0]);
    BoardUI[toRow][toCol].appendChild(fromCell);
    BoardUI[fromRow][fromCol].appendChild(toCell);
    // console.log(isTryingToCapture);
    if (isTryingToCapture) {
        targetPieceCol = toCol > fromCol ? toCol - 1 : toCol + 1;
        targetPieceRow = toRow > fromRow ? toRow - 1 : toRow + 1;
        clearCell(BoardUI[targetPieceRow][targetPieceCol], targetPieceRow, targetPieceCol);
        piecesCapturedThisTurn++;
    } else piecesCapturedThisTurn = 0;
}
function addEventListenersToCheckers(i, j) {
    BoardUI[i][j].addEventListener("click", function (event) {
        if ((isWhiteTurn && loggedUser.isWhite) || (!isWhiteTurn && !loggedUser.isWhite)) {
            // debugger
            if (!isEmptyCell(Board[i][j])) {
                // On piece selection
                deselectPieces();
                hideLegalMovesAvailable();
                isTryingToCapture = false; // Initializer
                if (!isTryingToMoveOppositePlayerCheckers(Board[i][j], isWhiteTurn)) {
                    if (areThereAnyPiecesToCapture(isWhiteTurn)) {
                        if (!didThePlayerChoseAPieceThatCanCapture(i, j)) {
                            isCheckerSelected = false;
                            displayAlertsModal("Illegal move. You MUST capture a piece when you have the opportunity.", "#7b0410", 1200)
                        } else {
                            selectPiece(i, j);
                            showLegalMovesAvailable(isWhiteTurn, fromRow, fromCol);
                        }
                    } else {
                        selectPiece(i, j);
                        showLegalMovesAvailable(isWhiteTurn, fromRow, fromCol);
                    }
                } else {
                    isCheckerSelected = false;
                    displayAlertsModal("Illegal action. It's " + (isWhiteTurn ? "white" : "black") + " player's turn.", "#7b0410", 1200)
                }
            } else {
                // On move
                if (isEmptyCell(Board[i][j]) && isCheckerSelected) {
                    if (BoardUI[i][j].classList[2] === "available-move") {
                        hideLegalMovesAvailable();
                        movePiece(fromRow, fromCol, i, j, isTryingToCapture);
                        if (!isKing(Board, i, j) && (i === 0 || i === 7)) {
                            crownPiece(Board[i][j], i, j);
                        }
                        if (piecesCapturedThisTurn > 0) {
                            socket.emit("gameData", fromRow, fromCol, i, j, isTryingToCapture, isCrownedThisTurn, piecesCapturedThisTurn);
                            if (!isAnotherCaptureAvailable(isWhiteTurn, i, j)) {
                                isCheckerSelected = false;
                                piecesCapturedThisTurn = 0;
                                isWhiteTurn = !isWhiteTurn; // Changes turn
                            } else {
                                selectPiece(i, j)
                                cellsToCapture.forEach(cell => {
                                    cell.classList.add("available-move");
                                });
                            }
                        } else {
                            socket.emit("gameData", fromRow, fromCol, i, j, isTryingToCapture, isCrownedThisTurn, piecesCapturedThisTurn);
                            isCheckerSelected = false;
                            isWhiteTurn = !isWhiteTurn; // Changes turn
                        }
                    } else displayAlertsModal("Illegal move. Please try again.", "#7b0410", 1200)
                }
            }
        } else {
            isCheckerSelected = false;
            displayAlertsModal("Illegal action. It's " + (isWhiteTurn ? "white" : "black") + " player's turn.", "#7b0410", 1200)
        }
        isCrownedThisTurn = false;
        cellsToCapture = []; // Initializes the array
        if (isGameOver()) disableAllBoard();
    });
}

function isEmptyCell(cell) {
    if (cell === whiteEmptyCell || cell === blackEmptyCell) return true;
    return false;
}

function isAnotherCaptureAvailable(isWhiteTurn, fromRow, fromCol) {
    if (!isKing(Board[fromRow][fromCol]) || (isKing(Board[fromRow][fromCol]) && !isCrownedThisTurn)) {
        cellsToCapture = []; // Initializes the array
        setPiecesThatMustBeCaptured(isWhiteTurn, fromRow, fromCol);
        if (cellsToCapture.length > 0) return true;
    }
    piecesCapturedThisTurn = 0;
    return false;
}

function isTryingToMoveOppositePlayerCheckers(piece, isWhiteTurn) {
    if ((piece === whiteCheckerPiece || piece === whiteKing) && !isWhiteTurn) return true;
    else if ((piece === blackCheckerPiece || piece === blackKing) && isWhiteTurn) return true;
    return false;
}
function clearCell(cellToClearUI, rowToClear, ColToClear) {
    let addEmpty = document.createElement("div");
    cellToClearUI.removeChild(cellToClearUI.children[0]);
    cellToClearUI.appendChild(addEmpty);
    addEmpty.classList.add("empty-cell");
    Board[rowToClear][ColToClear] = blackEmptyCell;
}
function isLegalMove(isWhiteTurn, fromRow, fromCol, toRow, toCol) {
    setPiecesThatMustBeCaptured(isWhiteTurn, fromRow, fromCol); // Saves the coordinates of the pieces that must be captured
    cellsToCapture.forEach(cell => {
        cell.classList.add("available-move");
    })
    if (cellsToCapture.length === 0) {
        if (!isMovingDiagonally(isWhiteTurn, fromRow, fromCol, toRow, toCol)) return false;
        else if (Math.abs(fromCol - toCol) > 1 || Math.abs(fromRow - toRow) > 1) {
            if (!isKing(Board[fromRow][fromCol])) return false;
        }
        if (isKing(Board[fromRow][fromCol]) && !isPathForKingClear(fromRow, fromCol, toRow, toCol)) return false;
    } else if (!isNecessaryToForceCapture(toRow, toCol)) {
        return false;
    }
    return true;
}
function isMovingDiagonally(isWhiteTurn, fromRow, fromCol, toRow, toCol) {
    if (isEmptyCell(Board[fromRow][fromCol])) return false;
    if (Board[toRow][toCol] === whiteEmptyCell)
        // Making sure the destination cell isn't white
        return false;
    if (piecesCapturedThisTurn === 0 && ((isWhiteTurn && toRow > fromRow) || (!isWhiteTurn && toRow < fromRow))) {
        // Makes sure piece doesn't move backwards
        if (!isKing(Board[fromRow][fromCol]))
            // If piece isn't King
            return false;
    }
    if (!isEmptyCell(Board[toRow][toCol])) return false;
    if (fromRow === toRow || fromCol === toCol) return false;
    if (Math.abs(fromRow - toRow) !== Math.abs(fromCol - toCol)) return false;
    return true;
}
function isTryingToCapturePiece(fromRow, fromCol, toRow, toCol) {
    if (Math.abs(fromCol - toCol) > 1 || Math.abs(fromRow - toRow) > 1) {
        // Checking if there's a capture attempt
        if (Math.abs(fromCol - toCol) > 2 || Math.abs(fromRow - toRow) > 2) {
            if (!isKing(Board[fromRow][fromCol])) return false;
        }
    } else return false;
    return true;
}
function isCaptureLegal(isWhiteTurn, fromRow, fromCol, toRow, toCol) {
    targetPieceCol = toCol > fromCol ? toCol - 1 : toCol + 1;
    targetPieceRow = toRow > fromRow ? toRow - 1 : toRow + 1;
    if (isEmptyCell(Board[targetPieceRow][targetPieceCol])) return false;
    if (isKing(Board[fromRow][fromCol])) {
        if (!isPathForKingClear(fromRow, fromCol, targetPieceRow, targetPieceCol)) return false;
    }
    if (isWhiteTurn) {
        if (
            Board[targetPieceRow][targetPieceCol] !== blackCheckerPiece &&
            Board[targetPieceRow][targetPieceCol] !== blackKing
        )
            return false;
    } else if (
        Board[targetPieceRow][targetPieceCol] !== whiteCheckerPiece &&
        Board[targetPieceRow][targetPieceCol] !== whiteKing
    )
        return false;
    isTryingToCapture = true;
    return true;
}
function setPiecesThatMustBeCaptured(isWhiteTurn, fromRow, fromCol) {
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            if (isMovingDiagonally(isWhiteTurn, fromRow, fromCol, i, j)) {
                if (isTryingToCapturePiece(fromRow, fromCol, i, j)) {
                    if (isCaptureLegal(isWhiteTurn, fromRow, fromCol, i, j)) {
                        cellsToCapture.push(BoardUI[i][j]);
                        // cellToCapture = Board[i][j];
                        // BoardUI[i][j].classList.add("available-move");
                        // selectPiece(fromRow, fromCol);
                    }
                }
            }
        }
    }
}
function isNecessaryToForceCapture(toRow, toCol) {
    for (let i = 0; i < cellsToCapture.length; i++) {
        if (cellsToCapture[i] === Board[toRow][toCol]) return true;
    }
    return false;
}
function areThereAnyPiecesToCapture(isWhiteTurn) {
    forcedRow = [];
    forcedCol = [];
    let isWhite;
    for (let fromRow = 0; fromRow < 8; fromRow++) {
        for (let fromCol = 0; fromCol < 8; fromCol++) {
            for (let toRow = 0; toRow < 8; toRow++) {
                for (let toCol = 0; toCol < 8; toCol++) {
                    if (Board[fromRow][fromCol] === whiteCheckerPiece || Board[fromRow][fromCol] === whiteKing)
                        isWhite = true;
                    else isWhite = false;
                    if (isMovingDiagonally(isWhite, fromRow, fromCol, toRow, toCol)) {
                        if (isTryingToCapturePiece(fromRow, fromCol, toRow, toCol)) {
                            if (isCaptureLegal(isWhite, fromRow, fromCol, toRow, toCol)) {
                                if (isWhite !== isWhiteTurn) continue;
                                forcedRow.push(fromRow);
                                forcedCol.push(fromCol);
                            }
                        }
                    }
                }
            }
        }
    }
    isTryingToCapture = false;
    if (forcedRow.length > 0) return true;
    return false;
}
function didThePlayerChoseAPieceThatCanCapture(fromRow, fromCol) {
    if (forcedRow !== undefined) {
        for (let i = 0; i < forcedRow.length; i++) {
            if (forcedRow[i] === fromRow && forcedCol[i] === fromCol) return true;
        }
    }
    return false;
}
function crownPiece(piece, row, col) {
    if ((row === 0 && piece === whiteCheckerPiece) || (row === 7 && piece === blackCheckerPiece)) {
        const king = document.createElement("div");
        BoardUI[row][col].children[0].appendChild(king);
        king.innerHTML = "K";
        Board[row][col] = piece === whiteCheckerPiece ? whiteKing : blackKing;
        isCrownedThisTurn = true;
    }
}
function isKing(cell) {
    if (cell === whiteKing || cell === blackKing) return true;
    return false;
}
function isPathForKingClear(fromRow, fromCol, toRow, toCol) {
    let i = fromRow > toRow ? toRow + 1 : toRow - 1;
    let j = fromCol > toCol ? toCol + 1 : toCol - 1;
    if (fromCol < toCol) {
        // If king goes right
        if (fromRow > toRow) {
            // If king goes up
            while (i <= fromRow - 1 && j >= fromCol + 1) {
                if (!isEmptyCell(Board[i][j])) return false;
                i++;
                j--;
            }
        } else {
            // If king goes down
            while (i >= fromRow + 1 && j >= fromCol + 1) {
                if (!isEmptyCell(Board[i][j])) return false;
                i--;
                j--;
            }
        }
    } else {
        // If king goes left
        if (fromRow > toRow) {
            // If king goes up
            while (i <= fromRow - 1 && j <= fromCol - 1) {
                if (!isEmptyCell(Board[i][j])) return false;
                i++;
                j++;
            }
        } else {
            // If king goes down
            while (i >= fromRow + 1 && j <= fromCol - 1) {
                if (!isEmptyCell(Board[i][j])) return false;
                i--;
                j++;
            }
        }
    }
    return true;
}
function isGameOver() {
    let whitePieces = document.getElementsByClassName("white-checker");
    let blackPieces = document.getElementsByClassName("black-checker");
    let winningColor, hasWon;
    if (whitePieces.length === 0)  {
        winningColor = "Black"
        hasWon = !loggedUser.isWhite ? true : false;
    }
    else if (blackPieces.length === 0) {
        winningColor = "White"
        hasWon = loggedUser.isWhite ? true : false;
    }
    else return false;
    setTimeout(() => {
        displayAlertsModal(`${winningColor} Player Wins! Please wait while you're being redirected to the main menu...`, "#4a4e69", 5000)
    }, 100);
    setTimeout(() => {
        location.href = "/";
    }, 5000);
    socket.emit("sendPlayer", loggedUser, hasWon)
    delete loggedUser.isWhite
    sessionStorage.setItem('loggedUser', JSON.stringify(loggedUser))
    // console.log(loggedUser);
    return true;
    // if (whitePieces.length === 0) {
    //     setTimeout(() => {
    //         // alert("Congratulations! Black Player Wins! Please refresh the page for a new game.");
    //         displayAlertsModal("Congratulations! Black Player Wins! Please refresh the page for a new game.", "#2BA9D4", 1200)
    //     }, 100);
    //     return true;
    // }
    // if (blackPieces.length === 0) {
    //     setTimeout(() => {
    //         displayAlertsModal("Congratulations! White Player Wins! Please refresh the page for a new game.", "#2BA9D4", 1200)
    //     }, 100);
    //     return true;
    // }
    // return false;
}
function disableAllBoard() {
    let pieces = document.querySelectorAll("button");
    let cells = document.querySelectorAll(".cell");
    for (let i = 0; i < pieces.length; i++) pieces[i].disabled = true;
    for (let i = 0; i < cells.length; i++) cells[i].onclick = null;
}

function movePieceForAllSockets (fromRow, fromCol, toRow, toCol, isTryingToCapture, isCrownedThisTurn, piecesCapturedThisTurn) {
    movePiece(fromRow, fromCol, toRow, toCol, isTryingToCapture);
    if (!isKing(Board, toRow, toCol) && (toRow === 0 || toRow === 7)) {
        crownPiece(Board[toRow][toCol], toRow, toCol);
    }
    if (piecesCapturedThisTurn > 0) {
        if (!isAnotherCaptureAvailable(isWhiteTurn, toRow, toCol)) {
            isWhiteTurn = !isWhiteTurn; // Changes turn
        }
    } else {
        isWhiteTurn = !isWhiteTurn; // Changes turn
    }
    if (isGameOver()) disableAllBoard();
};

const color = loggedUser.isWhite ? "White" : "Black"
displayAlertsModal(`You are playing ${color}`, "#343a40", 3000)