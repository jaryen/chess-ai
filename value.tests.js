// This is where all unit tests are for value.js.
import { Chess } from './chess.js';
import { alpha_beta, order_moves } from './value.js';


// Test order_moves()
function order_moves_test1() {
    let game = new Chess();
    let fen = '8/4q2P/4N2P/2np4/2p5/1pPp4/pb1P2K1/3k3B w - - 0 1';
    game.load(fen);
    let moves = order_moves(game.moves({ verbose: true }));
    console.log(moves);
}

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

// Call functions
order_moves_test1();