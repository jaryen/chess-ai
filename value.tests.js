// This is where all unit tests are for value.js.
import { Chess } from './chess.js';
import { minimax, alpha_beta, alpha_beta_unordered, order_moves } from './value.js';

// Randomly Generated FENs.
const test_fen1 = '3b4/7P/2p2n1k/2pNq2b/3p2B1/3P2RP/2P2K2/8 w - - 0 1';
const test_fen2 = 'B2br3/5b1n/4RB2/2K2k2/8/NqQP1p2/P5P1/8 w - - 0 1';
const test_fen3 = '8/1P3N2/1N1b1p2/K5nQ/7P/BP4Pk/5P1P/r7 w - - 0 1';
const test_fen4 = '8/Bn2P2N/2k2PP1/P3pp2/1rp5/1P2Pq2/8/6K1 w - - 0 1';
const test_fen5 = '5k2/2n1p3/1p1r1bp1/1R6/2P2Bq1/2QPP3/5P2/2K2N2 w - - 0 1';

const test_depth1 = 4;

// Test order_moves()
function order_moves_test1() {
    let game = new Chess();
    game.load(test_fen1);
    let moves = order_moves(game, game.moves({ verbose: true }));
    console.log(moves);
}

function order_moves_test2() {
    let game = new Chess();
    game.load(test_fen5);
    console.log('Unordered Moves:', game.moves());
    let moves = order_moves(game, game.moves({ verbose: true }));
    console.log('Ordered Moves:', moves);
}

// Test minimiax()
function minimax_test1() {
    let game = new Chess();
    game.load(test_fen2);
    console.log(game.moves());

    let obj = minimax(test_depth1, game, true, game.turn());

    console.log(obj.bestMoves);
}

// Test alpha_beta()
function alpha_beta_test1() {
    let game = new Chess();
    game.load(test_fen2);
    console.log(game.moves());

    let obj = alpha_beta(test_depth1, game, true, -Infinity, Infinity, game.turn());
    
    console.log(obj.bestMoves);
}

// Tests alpha_beta on unordered vs.
// ordered moves.
function alpha_beta_test2() {
    let game = new Chess(test_fen5);
    
    const t0 = performance.now();
    let obj_unordered = alpha_beta_unordered(test_depth1, game, true, -Infinity, Infinity, game.turn());
    const t1 = performance.now();

    console.log(`Unordered Performance: ${(t1-t0)/1000} seconds.`);

    const t2 = performance.now();
    let obj_ordered = alpha_beta(test_depth1, game, true, -Infinity, Infinity, game.turn());
    const t3 = performance.now();

    console.log(`Ordered Performance: ${(t3-t2)/1000} seconds.`);

    console.log(obj_unordered.bestMoves);
    console.log(obj_ordered.bestMoves);
}

// Call test functions.
/* const t0 = performance.now();
minimax_test1();
const t1 = performance.now();

console.log(`Time to perform minimax: ${(t1 - t0)/1000} seconds.`);

const t2 = performance.now();
alpha_beta_test1();
const t3 = performance.now();

console.log(`Time to perform alpha beta: ${(t3 - t2)/1000} seconds.`); */

for (let i = 0; i < 10; i++) {
    alpha_beta_test2();
}