/* This file declares all of the legal moves for the chess
game. */
import { Chess } from './chess.js';
import { evaluateBoard, makePossibleMoves } from './value.js';

export var game = new Chess();
console.log(game.moves());

// Fires when position of board changes.
function onChange(oldPos, newPos) {
    /* console.log('Position changed:');
    console.log('Old position: ' + Chessboard.objToFen(oldPos));
    console.log('New position: ' + Chessboard.objToFen(newPos));
    console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~'); */

    console.log(game.moves()); 
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
}

// update the board position after the piece snap
// for castling, en passant, pawn promotion
function onSnapEnd () {
    board.position(game.fen())
}

var config = {
    draggable: true,
    position: 'start',
    onChange: onChange,
    onDragStart: onDragStart,
    onDrop: onDrop,
    onSnapEnd: onSnapEnd
}

var board = ChessBoard(document.getElementById('myBoard'), config);