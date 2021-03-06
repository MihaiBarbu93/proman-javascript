from flask import Flask, render_template, url_for, request, redirect, jsonify,session
from util import json_response

import data_handler, persistence
import json

app = Flask(__name__)

app.secret_key = b'_5#y2L"F4Q8z\n\xec]/'


@app.route("/", methods=['GET','POST'])
def index():
    if 'username' in session:
        return render_template("index.html", username= session['username'],usr_exist="no")

    """
    This is a one-pager which shows all the boards and cards
    """
    return render_template('index.html',usr_exist="no")


@app.route('/update-board', methods=["POST"])
def update_board():
    request_content = request.json
    data = {'id': request_content['id'], 'title': request_content['title']}
    data_handler.update_board(data)
    return jsonify({'success': True})

@app.route('/remove-card', methods=["POST"])
def remove_card():
    request_content = request.json
    data = {'id': request_content['id']}
    data_handler.archive_card(data['id'])
    data_handler.delete_card(data['id'])
    return jsonify({'success': True})


@app.route('/delete-board', methods=["POST"])
def remove_board():
    request_content = request.json
    board_id = int(request_content['id'])
    data_handler.delete_board(board_id)
    return jsonify({'success': True})


@app.route('/archive-card',methods=["GET"])
def archive_card():
    board_id = request.args.get("board_id")
    return jsonify(data_handler.get_archived_cards(board_id))


@app.route('/retrive-card',methods=["POST"])
def retrive_card():
    card_id=request.get_json()
    print(card_id)
    data_handler.revived_card(card_id['id'])
    data_handler.remove_from_archive(card_id['id'])
    return jsonify({'success': True})




@app.route('/update-card', methods=["POST"])
def update_card():
    request_content = request.json
    data = {'id': request_content['id'][-1], 'title': request_content['title']}
    data_handler.update_card(data)
    return jsonify({'success': True})


@app.route("/get-boards")
@json_response
def get_boards():
    """
    All the boards
    """
    user_id = None
    if 'username' in session:
        user_id = data_handler.get_user_id(session['username'])
        

        return data_handler.get_boards(user_id['id'])
    return data_handler.get_boards(user_id)


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



@app.route('/add-private-board', methods=['GET','POST'])
def add_private_board():
    if request.method == 'POST':
        title = request.form['private_board_title']
        user_id = data_handler.get_user_id(session['username'])
        data_handler._insert_private_board(title, user_id['id'])
        return redirect(url_for('index'))


@app.route('/add-column', methods=['GET', 'POST'])
def add_column():
    if request.method == 'POST':
        column_title = request.form['column_title']
        board_id = request.form['boardId']
        data_handler._insert_column(column_title, board_id)
        return redirect(url_for('index'))


@app.route('/add-card', methods=['POST'])
def add_card():
    if request.method == 'POST':
        card_title = request.form.get('card_title')
        card_status = request.form.get('card_status')
        card_priority = request.form.get('card_priority')
        board_id = request.form.get('boardId')
        data_handler._insert_card(card_title, card_status, card_priority, board_id)
        return redirect('/')


@app.route("/get-statuses")
def get_all_statuses():
    all_statuses = persistence.get_statuses()
    all_statuses_json = json.dumps(all_statuses)
    return all_statuses_json

@app.route("/register", methods=['POST'])
def register():
    if request.method == "POST":
        credentials = request.get_json()
        name = credentials['username']
        password = credentials['password']
        password = data_handler.hash_password(password)
        data_handler.insert_user(name, password)
        return jsonify({'success': True})
    return render_template("index.html")

@app.route("/check-usr-existence",methods=["GET"])
def check_usr_existence():
        usrname=request.args.get('username')
        if data_handler.check_user_existence(usrname):
            return jsonify({"state":"Exist"})
        else:
            return jsonify({"state":"Not Existent"})


@app.route("/login", methods=['POST'])
def login():
    if request.method == 'POST':
        credentials = request.get_json()
        username = credentials['username']
        session['username']=username
        return jsonify({'success': True})
    return render_template("index.html")

@app.route("/check-login-credentials", methods=["GET"])
def check_login_credentials():
    username=request.args.get('username')
    password=request.args.get('password')
    if data_handler.confirm_user(username):
        passs = data_handler.check_credentials(username)['password']
        verfify_password = data_handler.verify_password(password, passs)
        if verfify_password:
            return jsonify({"state": "Correct"})
        else:
            return jsonify({"state": "Incorrect"})
    return jsonify({"state": "Incorrect"})


@app.route("/logout")
def logout():
    session.pop('username', None)
    return redirect(url_for('index'))


@app.route("/update-card-status", methods=['POST'])
def updated_card_status():
    card_status = request.get_json()['card_status']
    card_id = request.get_json()['card_id']
    data_handler.update_card_status(int(card_id[19:]), int(card_status))
    return jsonify({"state": "Correct"})


def main():
    app.run(debug=True)

    # Serving the favicon
    with app.app_context():
        app.add_url_rule('/favicon.ico', redirect_to=url_for('static', filename='favicon/favicon.ico'))


if __name__ == '__main__':
    main()
