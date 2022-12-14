/* This file deals with assigning values to
the current position on the board for minimax
to use. */
import { Chess } from './chess.js';

// Piece values
const Pawn = 100;
const Knight = 300;
const Bishop = 320;
const Rook = 500;
const Queen = 900;
const King = 1300;

const piece_value_map = new Map();
piece_value_map.set('p', 100);
piece_value_map.set('n', 300);
piece_value_map.set('b', 320);
piece_value_map.set('r', 500);
piece_value_map.set('q', 900);
piece_value_map.set('k', 1300);
// Points for checkmate?

// Depth of the minimax search tree.
const maxDepth = 4;

// Returns the total material score for both
// sides for the current position on the board.
export function evaluateBoard(game) {
    let score = {
        w_score: 0,
        b_score: 0
    }

    // Get the piece positions using FEN
    let piecePos = game.fen().substring(0, game.fen().indexOf(' '));

    // Split piece pos string at '/' (by rank).
    let piecePosArr = piecePos.split('/');

    // Loop through each rank and add the appropriate
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
                case 'K':
                case 'k':
                    if (currPiece === 'K') score.w_score += King;
                    else score.b_score += King;
                    break;
                default:
                    break;
            }
        }
    }

    return score;
}

// Evaluates the gain for given side.
function evaluate_gain(scores, side) {
    return (side === 'w') ? scores.w_score - scores.b_score : scores.b_score - scores.w_score;
}

// Returns the optimal score and corresponding best move.
export function minimax(depth, game, isMax, side) {
    // Object that holds the best score and
    // best move. This is returned.
    var obj = {
        bestScore: 0,
        bestMove: '',
        bestMoves: [],
    };

    // Base case. When the number of moves to search or 
    // no legal moves left is reached.
    if (depth == 0 || game.isGameOver) {
        if (game.isGameOver) {
            obj.bestScore = Infinity;
            return obj;
        }
        // Calculate the gain.
        let scores = evaluateBoard(game);
        obj.bestScore = evaluate_gain(scores, side)
        return obj;
    }

    // Order the moves from best to worst.
    let ordered_moves = order_moves(game.moves({ verbose: true }));
    
    // Create a new game and load the current position.
    let updatedGame = new Chess(game.fen());

    if (isMax) {
        // Maximizing.
        obj.bestScore = -Infinity;
        for (let i = 0; i < ordered_moves.length; i++) {
            updatedGame.move(ordered_moves[i]); // make each possible moves from current position
            let score = minimax(depth-1, updatedGame, false, side).bestScore;
            if (obj.bestScore < score) {
                obj.bestScore = score; // assign better score.
                obj.bestMove = ordered_moves[i]; // assign current move because score is better if move is made.
                obj.bestMoves.push(ordered_moves[i]);
            }
        }
    } else {
        // Minimizing.
        obj.bestScore = Infinity;
        for (let i = 0; i < ordered_moves.length; i++) {
            updatedGame.move(ordered_moves[i]); // make each possible moves from current position
            let score = minimax(depth-1, updatedGame, true, side).bestScore;
            if (obj.bestScore > score) {
                obj.bestScore = score;
                obj.bestMove = ordered_moves[i];
                obj.bestMoves.push(ordered_moves[i]);
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
        bestMoves: [],
    };

    // Base case. When the depth is reached or
    // the game is over, return
    // the gain for the side being calculated.
    if (depth == 0 || game.isGameOver) {
        if (game.isGameOver) { // Checkmate.
            obj.bestScore = Infinity; // Should return a infinite gain.
            return obj;
        }
        // Calculate the gain and return it.
        let scores = evaluateBoard(game);
        obj.bestScore = evaluate_gain(scores, side);
        return obj;
    }

    // Order the moves from best to worst.
    let ordered_moves = order_moves(game.moves({ verbose: true }));

    // Create a new game and load the current position.
    let updatedGame = new Chess(game.fen());

    if (isMax) {
        // Maximizing.
        // Go through each legal moves.
        for (let i = 0; i < ordered_moves.length; i++) {
            updatedGame.move(ordered_moves[i]);
            // Get the best gain for this move.
            let score = alpha_beta(depth-1, updatedGame, false, alpha, beta, side).bestScore;
            // If there is a better move found.
            if (score > alpha) {
                alpha = score;
                obj.bestScore = alpha;
                obj.bestMove = ordered_moves[i];
                obj.bestMoves.push(ordered_moves[i]);
            }
            // If move returns a gain greater than
            // the current beta, cutoff. This
            // is because the minimizer would never
            // choose this move or any subsequent moves.
            if (score >= beta) {
                return obj;
            }
        }
        return obj;
    } else {
        // Minimizing.
        for (let i = 0; i < ordered_moves.length; i++) {
            updatedGame.move(ordered_moves[i]);
            let score = alpha_beta(depth-1, updatedGame, true, alpha, beta, side).bestScore;
            if (score < beta) {
                beta = score;
                obj.bestScore = beta;
                obj.bestMove = ordered_moves[i];
                obj.bestMoves.push(ordered_moves[i]);
            }
            if (score <= alpha) {
                return obj;
            }
        }
        return obj;
    }
}


// Alpha beta function using unordered moves.
export function alpha_beta_unordered(depth, game, isMax, alpha, beta, side) {
    // Object that holds the best score and
    // best move. This is returned.
    var obj = {
        bestScore: 0,
        bestMove: '',
        bestMoves: [],
    };

    // Base case. When the depth is reached or
    // the game is over, return
    // the gain for the side being calculated.
    if (depth == 0 || game.isGameOver) {
        // Calculate the gain and return it.
        let scores = evaluateBoard(game);
        obj.bestScore = evaluate_gain(scores, side);
        return obj;
    }

    // Get the moves in alphabetical order.
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
            // If there is a better move found.
            if (score > alpha) {
                alpha = score;
                obj.bestScore = score;
                obj.bestMove = moves[i];
                obj.bestMoves.push(moves[i]);
            }
            // If move returns a gain greater than
            // the current beta, cutoff. This
            // is because the minimizer would never
            // choose this move or any subsequent moves.
            if (score >= beta) {
                return obj;
            }
        }
        return obj;
    } else {
        // Minimizing.
        for (let i = 0; i < moves.length; i++) {
            updatedGame.move(moves[i]);
            let score = alpha_beta(depth-1, updatedGame, true, alpha, beta, side).bestScore;
            if (score < beta) {
                beta = score;
                obj.bestScore = score;
                obj.bestMove = moves[i];
                obj.bestMoves.push(moves[i]);
            }
            if (score <= alpha) {
                return obj;
            }
        }
        return obj;
    }
}

// This function orders the nodes in
// the alpha-beta tree for optimal pruning.
export function order_moves(moves) {
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

    // Loop through each move.
    for (let i = 0; i < moves.length; i++) {
        let move = moves[i];
        let piece = move.piece;
        let gain = 0;

        // MVV-LVA Captures
        if (move.hasOwnProperty('captured')) {
            let piece_captured = move.captured;
            gain += (10*piece_value_map.get(piece_captured)) - (piece_value_map.get(piece));
        }
        // Promotions
        if (move.hasOwnProperty('promotion')) {
            // Should be around same as 10*Q - P value.
            gain += 9000;
        }
        // Checkmate
        if (move.san.charAt(move.san.length-1) === '#') {
            // Game over. Bring it to the front.
            gain += Infinity;
        }

        // Associate gain with the move.
        move_gain_map.set(move.san, gain);
    }

    // Order moves by gain.
    let move_gain_ordered = new Map([...move_gain_map.entries()].sort((a, b) => b[1] - a[1]));
    return Array.from(move_gain_ordered.keys());
}