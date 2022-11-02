/* This file deals with assigning values to
the current position on the board for minimax
to use. */
import { Chess } from './chess.js';
// import { game } from './playermoves.js';

const Pawn = 100;
const Knight = 350;
const Bishop = 350;
const Rook = 525;
const Queen = 1000;

// Depth of the minimax search tree.
const maxDepth = 1;

// Returns the total material score for both
// sides for the current position on the board.
export function evaluateBoard(board) {
    let w_score = 0;
    let b_score = 0;

    // Get the piece positions using FEN
    let piecePos = board.fen().substring(0, board.fen().indexOf(' '));

    // Split piece pos string at '/'
    let piecePosArr = piecePos.split('/');

    // Loop through each character and add appropriate
    // piece value to the total score for each side.
    for (let i = 0; i < piecePosArr.length; i++) {
        let currRow = piecePosArr[i];
        for (let j = 0; j < currRow.length; j++) {
            let currPiece = currRow.charAt(j);
            switch(currPiece) {
                case 'P':
                case 'p':
                    if (currPiece === 'P') w_score += Pawn;
                    else b_score += Pawn;
                    break;
                case 'N':
                case 'n':
                    if (currPiece === 'N') w_score += Knight;
                    else b_score += Knight;
                    break;
                case 'B':
                case 'b':
                    if (currPiece === 'B') w_score += Bishop;
                    else b_score += Bishop;
                    break;
                case 'R':
                case 'r':
                    if (currPiece === 'R') w_score += Rook;
                    else b_score += Rook;
                    break;
                case 'Q':
                case 'q':
                    if (currPiece === 'Q') w_score += Queen;
                    else b_score += Queen;
                    break;
                default:
                    break;
            }
        }
    }

    return w_score;
}

// Called each move for bot
// For each legal move available, make that move and 
// repeat the process for the new legal moves from the 
// previous move.
// Repeat for 'numMoves' times.
// Returns an evaluation when the current move level reached
// levels OR if no moves are left for current position.
export function makePossibleMoves(currLevel, game, pos) {
    if (currLevel >= maxDepth || game.moves().length <= 0) {
        return evaluateBoard(game);
    }

    // Get the array of available moves.
    let moves = game.moves();

    // Get the current position on the board.
    let chess = new Chess(pos);

    currLevel += 1;

    // For each move, make all possible moves from
    // that move.
    for (let i = 0; i < moves.length; i++) {
        chess.move(moves[i]);
        makePossibleMoves(currLevel, chess, chess.fen());
    }
}

// Returns the optimal score and corresponding best move.
function minimax(depth, game, isMaxi) {
    var obj = {
        bestScore: 0,
        bestMove: null
    };
    // When the number of moves to search or 
    // no legal moves left is reached.
    if (depth == 0 || game.moves().length == 0) {
        obj.bestScore = evaluateBoard(game);
        return obj.bestScore;
    }
    let moves = game.moves();
    if (isMaxi) {
        // Maximizing.
        obj.bestScore = -Infinity;
        for (let i = 0; i < game.moves().length; i++) {
            game.move(moves[i]);
            if (obj.bestScore < minimax(depth-1, game, false).bestScore) {
                obj.bestScore = minimax(depth-1, game, false).bestScore;
                obj.bestMove = minimax(depth-1, game, false).bestMove == null ? obj.bestMove : minimax(depth-1, game, false).bestMove;
            }
        }
        return obj;
    } else {
        // Minimizing.
        obj.bestScore = Infinity;
        for (let i = 0; i < game.moves().length; i++) {
            game.move(moves[i]);
            if (obj.bestScore > minimax(depth-1, game, true).bestScore) {
                obj.bestScore = minimax(depth-1, game, true).bestScore;
                obj.bestMove = minimax(depth-1, game, false).bestMove == null ? obj.bestMove : minimax(depth-1, game, false).bestMove;
            }
        }
        return obj;
    }
}

function getNextMove() {
    // Returns the next optimal move.

}

let game = new Chess();
let obj = minimax(maxDepth, game, true);
console.log("Max Score: ", obj.bestScore);
console.log("Best Move: ", obj.bestMoves);