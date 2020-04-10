import persistence,connection,bcrypt


def get_card_status(status_id):
    """
    Find the first status matching the given id
    :param status_id:
    :return: str
    """
    statuses = persistence.get_statuses()
    return next((status['title'] for status in statuses if status['id'] == status_id), 'Unknown')


def get_boards():
    """
    Gather all boards
    :return:
    """
    return persistence.get_boards()


def get_cards_for_board(board_id):
    all_cards = persistence.get_cards()
    matching_cards = []
    for card in all_cards:
        if card['board_id'] == board_id:
            card['status_id'] = get_card_status(card['status_id'])  # Set textual status for the card
            matching_cards.append(card)
    return matching_cards


@connection.connection_handler
def _insert_board(cursor, title):
    cursor.execute(f'''
                    INSERT INTO boards VALUES  (default,'{title}');
                    ''')


@connection.connection_handler
def update_board(cursor, data):
    cursor.execute(f"""
        UPDATE boards SET title = '{data["title"]}' WHERE id = {data["id"]};
    """)

@connection.connection_handler
def update_card(cursor, data):
    cursor.execute(f"""
        UPDATE cards SET title = '{data["title"]}' WHERE id = {data["id"]};
    """)

@connection.connection_handler
def _insert_column(cursor, title, board_id):
    cursor.execute(f'''
                    INSERT INTO statuses VALUES  (default,'{title}',{board_id});
                    ''')


@connection.connection_handler
def _insert_card(cursor, card_title, card_status, card_priority, board_id):
    query = f""" INSERT INTO cards VALUES (DEFAULT, {int(board_id)}, '{card_title}', {int(card_status)}, {int(card_priority)}); """
    cursor.execute(query)

@connection.connection_handler
def insert_user(cursor, name, password):
    cursor.execute(f"""
                        INSERT INTO users (username, password)
                        VALUES ('{name}', '{password}');
                        """)


@connection.connection_handler
def check_credentials(cursor, user):
    cursor.execute(f"""
                    SELECT password FROM users
                    WHERE username = '{user}';
                    """)
    result = cursor.fetchone()
    return result

def hash_password(plain_text_password):
    hashed_bytes = bcrypt.hashpw(plain_text_password.encode('utf-8'), bcrypt.gensalt())
    return hashed_bytes.decode('utf-8')


def verify_password(plain_text_password, hashed_password):
    hashed_bytes_password = hashed_password.encode('utf-8')
    return bcrypt.checkpw(plain_text_password.encode('utf-8'), hashed_bytes_password)

def check_user_existence(reg_user):
    for users in persistence._read_table('users'):
        if reg_user == users['username']:
            return True
        else:
            return False

@connection.connection_handler
def confirm_user(cursor, usrname):
    cursor.execute(f"""
                    SELECT username FROM users
                    WHERE username = '{usrname}'; 
                    """)
    result = cursor.fetchall()
    if result != []:
        return True
    else:
        return False


@connection.connection_handler
def update_card_status(cursor, card_id, status):
    cursor.execute(f"""
                    UPDATE cards
                    SET status_id={status}
                    WHERE id={card_id}
    """)