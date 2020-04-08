from flask import Flask, render_template, url_for, request, redirect, jsonify
from util import json_response

import data_handler, persistence
import json

app = Flask(__name__)


@app.route("/", methods=['GET','POST'])
def index():
    """
    This is a one-pager which shows all the boards and cards
    """
    return render_template('index.html')

@app.route('/update-board', methods=["POST"])
def update_board():
    request_content = request.json
    data = {'id': request_content['id'][-1], 'title': request_content['title']}
    data_handler.update_board(data)
    return jsonify({'success': True})



@app.route("/get-boards")
@json_response
def get_boards():
    """
    All the boards
    """
    return data_handler.get_boards()


@app.route("/get-cards/<int:board_id>")
@json_response
def get_cards_for_board(board_id: int):
    """
    All cards that belongs to a board
    :param board_id: id of the parent board
    """
    return data_handler.get_cards_for_board(board_id)


@app.route('/add-board', methods=['GET','POST'])
def add_board():
    if request.method == 'POST':
        title=request.form['board_title']
        data_handler._insert_board(title)
        return redirect(url_for('index'))

@app.route('/add-column', methods=['GET', 'POST'])
def add_column():
    if request.method == 'POST':
        column_title = request.form['column_title']
        board_id = request.form['boardId']
        data_handler._insert_column(column_title, board_id)
        return redirect(url_for('index'))


@app.route("/get-statuses")
def get_all_statuses():
    all_statuses = persistence.get_statuses()
    all_statuses_json = json.dumps(all_statuses)
    return all_statuses_json



def main():
    app.run(debug=True)

    # Serving the favicon
    with app.app_context():
        app.add_url_rule('/favicon.ico', redirect_to=url_for('static', filename='favicon/favicon.ico'))


if __name__ == '__main__':
    main()
