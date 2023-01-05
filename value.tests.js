// This is where all unit tests are for value.js.
import { Chess } from './chess.js';
import { minimax, alpha_beta, alpha_beta_unordered, order_moves } from './value.js';

// Randomly Generated FENs.
const test_fen1 = '3b4/7P/2p2n1k/2pNq2b/3p2B1/3P2RP/2P2K2/8 w - - 0 1';
const test_fen2 = 'B2br3/5b1n/4RB2/2K2k2/8/NqQP1p2/P5P1/8 w - - 0 1';
const test_fen3 = '8/1P3N2/1N1b1p2/K5nQ/7P/BP4Pk/5P1P/r7 w - - 0 1';
const test_fen4 = '8/Bn2P2N/2k2PP1/P3pp2/1rp5/1P2Pq2/8/6K1 w - - 0 1';
const test_fen5 = '5k2/2n1p3/1p1r1bp1/1R6/2P2Bq1/2QPP3/5P2/2K2N2 w - - 0 1';
const checkmate_fen = '7k/Q7/8/8/8/8/3R4/1K6 w - - 0 1';
const checkmate_fen2 = '7k/Q7/8/8/8/8/3R3r/1K6 w - - 0 1';

// Mid Games:
const mid_fen1 = 'r2q1rk1/1b2ppb1/1p4pp/p1nnN3/P2N4/2P5/1PBB1PPP/R2QR1K1 w - - 0 1';
const mid_fen2 = 'r2q1rk1/1p1b1ppp/p1n1pn2/3p4/1P3B2/P1NQ1N1P/1P3PP1/3RR1K1 w - - 0 1';

const test_depth1 = 4;

// Test order_moves()
function order_moves_test1() {
    let game = new Chess();
    game.load(checkmate_fen);
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
    let game = new Chess(mid_fen2);
    console.log('Moves:', game.moves());

    const t0 = performance.now();
    let obj = minimax(test_depth1, game, true, game.turn());
    const t1 = performance.now();

    console.log(`Minimax ran in: ${(t1-t0)/1000} seconds at a depth of ${test_depth1}.`)
    console.log('Best Moves:', obj.bestMoves);
    console.log('Best Move Chosen:', obj.bestMove);
}

// Test alpha_beta()
// Run a vanilla test using alpha-beta.
function alpha_beta_test1() {
    let game = new Chess(mid_fen2);
    console.log('Moves:', game.moves());

    const t0 = performance.now();
    let obj = alpha_beta(test_depth1, game, true, -Infinity, Infinity, game.turn());
    const t1 = performance.now();
    
    console.log(`Alpha-Beta ran in: ${(t1-t0)/1000} seconds at a depth of ${test_depth1}.`)
    console.log('Best Moves:', obj.bestMoves);
    console.log('Best Move Chosen:', obj.bestMove);
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

// minimax_test1();
alpha_beta_test1();