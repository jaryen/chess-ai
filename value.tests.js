// This is where all unit tests are for value.js.
import { Chess } from './chess.js';
import { minimax, alpha_beta, order_moves } from './value.js';

const test_fen1 = '3b4/7P/2p2n1k/2pNq2b/3p2B1/3P2RP/2P2K2/8 w - - 0 1';
const test_depth1 = 4;

// Test order_moves()
function order_moves_test1() {
    let game = new Chess();
    game.load(test_fen1);
    let moves = order_moves(game.moves({ verbose: true }));
    console.log(moves);
}

// Test minimiax()
function minimax_test1() {
    let game = new Chess();
    game.load(test_fen1);
    console.log(game.moves());

    let obj = minimax(test_depth1, game, true, game.turn());

    console.log(obj.bestMoves);
}

// Test alpha_beta()
function alpha_beta_test1() {
    let game = new Chess();
    game.load(test_fen1);
    console.log(game.moves());

    let obj = alpha_beta(test_depth1, game, true, -Infinity, Infinity, game.turn());
    
    console.log(obj.bestMoves);
    /* let rand_idx = Math.floor(Math.random() * (obj.bestMoves.length-1));
    let rand_move = obj.bestMoves[rand_idx];
    game.move(rand_move);
    console.log('Move made:', rand_move); */
}

// Call test functions.
const t0 = performance.now();
minimax_test1();
const t1 = performance.now();

console.log(`Time to perform minimax: ${(t1 - t0)/1000} seconds.`);

const t2 = performance.now();
alpha_beta_test1();
const t3 = performance.now();

console.log(`Time to perform alpha beta: ${(t3 - t2)/1000} seconds.`);
