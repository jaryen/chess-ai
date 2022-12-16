/* This file deals with assigning values to
the current position on the board for minimax
to use. */
import { Chess } from './chess.js';

// Piece values
const Pawn = 100;
const Knight = 350;
const Bishop = 350;
const Rook = 525;
const Queen = 1000;

// Depth of the minimax search tree.
const maxDepth = 3;

// Returns the total material score for both
// sides for the current position on the board.
export function evaluateBoard(board) {
    let score = {
        w_score: 0,
        b_score: 0
    }

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
                    if (currPiece === 'P') score.w_score += Pawn;
                    else score.b_score += Pawn;
                    break;
                case 'N':
                case 'n':
                    if (currPiece === 'N') score.w_score += Knight;
                    else score.b_score += Knight;
                    break;
                case 'B':
                case 'b':
                    if (currPiece === 'B') score.w_score += Bishop;
                    else score.b_score += Bishop;
                    break;
                case 'R':
                case 'r':
                    if (currPiece === 'R') score.w_score += Rook;
                    else score.b_score += Rook;
                    break;
                case 'Q':
                case 'q':
                    if (currPiece === 'Q') score.w_score += Queen;
                    else score.b_score += Queen;
                    break;
                default:
                    break;
            }
        }
    }

    return score;
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
export function minimax(depth, game, isMax, color) {
    // Object that holds the best score and
    // best move. This is returned.
    var obj = {
        bestScore: 0,
        bestMove: '',
        bestMoves: []
    };

    // Base case. When the number of moves to search or 
    // no legal moves left is reached.
    if (depth == 0 || game.moves().length == 0) {
        // Calculate the gain.
        let w_score = evaluateBoard(game).w_score;
        let b_score = evaluateBoard(game).b_score;
        if (color === 'w') {
            obj.bestScore = w_score - b_score;
        } else {
            obj.bestScore = b_score - w_score;
        }
        return obj;
    }

    let moves = game.moves();
    let updatedGame = new Chess();
    updatedGame.load(game.fen());

    if (isMax) {
        // Maximizing.
        obj.bestScore = -Infinity;
        for (let i = 0; i < moves.length; i++) {
            updatedGame.move(moves[i]); // make each possible moves from current position
            let minimaxScore = minimax(depth-1, updatedGame, false, color).bestScore;
            if (obj.bestScore <= minimaxScore) {
                obj.bestScore = minimaxScore; // assign better score.
                obj.bestMoves.push(moves[i]);
                obj.bestMove = moves[i]; // assign current move because score is better if move is made.
            }
        }
    } else {
        // Minimizing.
        obj.bestScore = Infinity;
        for (let i = 0; i < moves.length; i++) {
            updatedGame.move(moves[i]); // make each possible moves from current position
            let minimaxScore = minimax(depth-1, updatedGame, true, color).bestScore;
            if (obj.bestScore >= minimaxScore) {
                obj.bestScore = minimaxScore;
                obj.bestMoves.push(moves[i]);
                obj.bestMove = moves[i];
            }
        }
    }

    return obj;
}

// Alpha Beta pruning function.
export function alpha_beta(depth, game, isMax, alpha, beta, color) {
    // Object that holds the best score and
    // best move. This is returned.
    var obj = {
        bestScore: 0,
        bestMove: '',
        bestMoves: []
    };

    // Base case. When the depth is reached, return
    // the gain for the side being calculated.
    if (depth == 0) {
        // Calculate the gain.
        let score = evaluateBoard(game);
        if (color === 'w') {
            obj.bestScore = score.w_score - score.b_score;
        } else {
            obj.bestScore = score.b_score - score.w_score;
        }
        return obj;
    }

    // Get the legal moves.
    let moves = game.moves();

    // Create a new game and load the current position.
    let updatedGame = new Chess();
    updatedGame.load(game.fen());

    if (isMax) {
        // Maximizing.
        // Go through each legal moves.
        for (let i = 0; i < moves.length; i++) {
            updatedGame.move(moves[i]);
            // Get the best gain for this move.
            let score = alpha_beta(depth-1, updatedGame, false, alpha, beta, color).bestScore;
            // If move returns a gain greater than
            // the current best gain, cutoff. This
            // is because the minimizer would never
            // choose this move or any subsequent moves.
            if (score >= beta) {
                return obj;
            }
            // If there is a better move found.
            if (score > alpha) {
                alpha = score;
                obj.bestScore = alpha;
                obj.bestMove = moves[i];
            }
        }
        return obj;
    } else {
        for (let i = 0; i < moves.length; i++) {
            updatedGame.move(moves[i]);
            let score = alpha_beta(depth-1, updatedGame, true, alpha, beta, color).bestScore;
            if (score <= alpha) {
                return obj;
            }
            if (score < beta) {
                beta = score;
                obj.bestScore = beta;
                obj.bestMove = moves[i];
            }
        }
        return obj;
    }
}

let game = new Chess();
const t0 = performance.now();
let test1 = alpha_beta(3, game, true, -Infinity, Infinity, game.turn());
const t1 = performance.now();

console.log("Alpha Beta pruning best move: " + test1.bestMove);
console.log(`Time to perform: ${(t1 - t0)/1000} seconds.`);

let game2 = new Chess();
const t2 = performance.now();
let test2 = minimax(3, game, true, game.turn());
const t3 = performance.now();

console.log("Minimax best move: " + test2.bestMove);
console.log(`Time to perform: ${(t3 - t2)/1000} seconds.`)

/* let game = new Chess();

// Get the best score and moves for a new game.
let obj = minimax(maxDepth, game, true, game.turn());
console.log("Max Score:", obj.bestScore);
console.log("Best Move:", obj.bestMove);

game.move(obj.bestMove); */

/* let obj2 = minimax(maxDepth, game, true, game.turn());
console.log("Max Score:", obj2.bestScore);
console.log("Best Move:", obj2.bestMove); */