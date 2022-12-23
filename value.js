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
const King = Infinity;

const piece_value_map = new Map();
piece_value_map.set('p', 100);
piece_value_map.set('n', 350);
piece_value_map.set('b', 350);
piece_value_map.set('r', 525);
piece_value_map.set('q', 1000);
piece_value_map.set('k', Infinity);

// Depth of the minimax search tree.
const maxDepth = 3;

// Returns the total material score for both
// sides for the current position on the board.
export function evaluateBoard(game) {
    let score = {
        w_score: 0,
        b_score: 0
    }

    // Get the piece positions using FEN
    let piecePos = game.fen().substring(0, game.fen().indexOf(' '));

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

function evaluate_gain(scores, side) {
    let gain = side === 'w' ? scores.w_score - scores.b_score : scores.b_score - scores.w_score;
    return gain;
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
                obj.bestMoves.push(moves[i]); // Store the best move.
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
export function alpha_beta(depth, game, isMax, alpha, beta, side) {
    // Object that holds the best score and
    // best move. This is returned.
    var obj = {
        bestScore: 0,
        bestMove: '',
    };

    // Base case. When the depth is reached, return
    // the gain for the side being calculated.
    if (depth == 0) {
        // Calculate the gain and return it.
        let scores = evaluateBoard(game);
        obj.bestScore = evaluate_gain(scores, side);
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
            let score = alpha_beta(depth-1, updatedGame, false, alpha, beta, side).bestScore;
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
            let score = alpha_beta(depth-1, updatedGame, true, alpha, beta, side).bestScore;
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

// This function orders the nodes in
// the alpha-beta tree for optimal pruning.
function move_ordering(moves) {
    // Order by capture moves first.
    // MVV-LVA

    // First, get the children of current none-leaf
    // node.
    // Loop through each child and determine whether it
    // is a MVV-LVA capture move.
    // Put all of the MVV-LVA moves in a list and order
    // by gain in descending order.
    // Return this list to be traversed by the alpha-beta algo.
    let move_gain_map = new Map();

    for (let i = 0; i < moves.length; i++) {
        let move = moves[i];
        let piece = move.piece;
        let gain = 0;
        if (move.hasOwnProperty('captured')) {
            let piece_captured = move.captured;
            gain = piece_value_map.get(piece_captured) - piece_value_map.get(piece);
        }
        move_gain_map.set(move.san, gain);
    }

    // Order map by value
    const move_gain_ordered = new Map([...move_gain_map.entries()].sort((a, b) => b[1] - a[1]));
    return Array.from(move_gain_ordered.keys());
}


/* 
*
TESTS 
*
*/
let game = new Chess();
game.load('8/P3R2r/1P5p/PP1p4/R2p4/2r5/2Bb2k1/3K1b2 w - - 0 1');
let verbose_moves = game.moves({ verbose: true });
let ordered_moves = move_ordering(verbose_moves);
console.log(ordered_moves);

/* let game = new Chess();
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
console.log(`Time to perform: ${(t3 - t2)/1000} seconds.`); */

/* let game = new Chess();

// Get the best score and moves for a new game.
let obj = minimax(maxDepth, game, true, game.turn());
console.log("Max Score:", obj.bestScore);
console.log("Best Move:", obj.bestMove);

game.move(obj.bestMove); */

/* let obj2 = minimax(maxDepth, game, true, game.turn());
console.log("Max Score:", obj2.bestScore);
console.log("Best Move:", obj2.bestMove); */