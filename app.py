from flask import Flask, render_template, jsonify, request
from tic_tac_toe import TicTacToe

app = Flask(__name__)
game = TicTacToe()

@app.route('/')
def index():
    game.reset_game()
    return render_template('index.html')

@app.route('/move', methods=['POST'])
def move():
    data = request.get_json()
    row, col = data['row'], data['col']

    if game.make_move(row, col):
        winner = game.check_win()
        draw = game.check_draw()
        if not winner and not draw:
            game.switch_player()

        return jsonify({
            'board': game.board,
            'currentPlayer': game.current_player,
            'winner': winner,
            'draw': draw
        })

    return jsonify({'error': 'Invalid move'}), 400

@app.route('/reset', methods=['POST'])
def reset():
    game.reset_game()
    return jsonify({
        'board': game.board,
        'currentPlayer': game.current_player
    })

if __name__ == '__main__':
    app.run(debug=True, port=5001)
