/* This file declares all of the legal moves for the chess
game. */
import { Chess } from './chess.js';
import { alpha_beta } from './value.js';

export var game = new Chess();
const depth = 4;

// Calls the alpha beta pruning function.
function cpuMove() {
    let obj = alpha_beta(depth, game, true, -Infinity, Infinity, game.turn());
    console.log(obj.bestMoves);

    let rand_idx = Math.floor(Math.random() * (obj.bestMoves.length-1));
    let rand_move = obj.bestMoves[rand_idx];
    game.move(rand_move);
    console.log('Move made:', rand_move);

    board.position(game.fen());
}

// Fires when a piece is picked up.
function onDragStart(source, piece, position, orientation) {
    // do not pick up pieces if the game is over
    if (game.game_over()) return false
    
    // only pick up pieces for the side to move
    if ((game.turn() === 'w' && piece.search(/^b/) !== -1) ||
        (game.turn() === 'b' && piece.search(/^w/) !== -1)) {
        return false
    }
}

// Fires when piece is dropped.
function onDrop (source, target) {
    // see if the move is legal
    var move = game.move({
        from: source,
        to: target,
        promotion: 'q' // NOTE: always promote to a queen for example simplicity
    });

    // illegal move
    if (move === null) return 'snapback';
}

// update the board position after the piece snap
// for castling, en passant, pawn promotion
function onSnapEnd() {
    // Update the board.
    board.position(game.fen());

    window.setTimeout(cpuMove(), 250);
}

// Clears board.
function clearBoard() {
    document.getElementById('myBoard').style.display = "none";
    document.getElementById('clearedBoard').style.display = "block";

    game.clear();
}

// Reset board to starting position.
function resetBoard() {
    document.getElementById('myBoard').style.display = "block";
    document.getElementById('clearedBoard').style.display = "none";

    board.start();
    game.reset();
}

// Displays the FEN by the board.
function showFen() {
    console.log(cleared_board.fen());
}

var config = {
    draggable: true,
    position: 'start',
    onDragStart: onDragStart,
    onDrop: onDrop,
    onSnapEnd: onSnapEnd,
}

var cleared_config = {
    draggable: true,
    dropOffBoard: 'trash',
    sparePieces: true,
}

document.getElementById('getFenBtn').onclick = showFen;
document.getElementById('clearBoard').onclick = clearBoard;
document.getElementById('resetBoard').onclick = resetBoard;

var board = ChessBoard(document.getElementById('myBoard'), config);
var cleared_board = ChessBoard(document.getElementById('clearedBoard'), cleared_config);