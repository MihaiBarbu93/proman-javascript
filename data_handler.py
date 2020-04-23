import persistence, connection, bcrypt


def get_card_status(status_id):
    """
    Find the first status matching the given id
    :param status_id:
    :return: str
    """
    statuses = persistence.get_statuses()
    return next((status['title'] for status in statuses if status['id'] == status_id), 'Unknown')


def get_boards(user_id):
    """
    Gather all boards
    :return:
    """
    return persistence.get_boards(user_id)


def get_cards_for_board(board_id):
    all_cards = persistence.get_cards()
    matching_cards = []
    for card in all_cards:
        if card['board_id'] == board_id:
            # card['status_id'] = get_card_status(card['status_id'])  # Set textual status for the card
            matching_cards.append(card)
    return matching_cards


@connection.connection_handler
def _insert_board(cursor, title):
    cursor.execute(f'''
                    INSERT INTO boards VALUES  (default,'{title}');
                    ''')


@connection.connection_handler
def _insert_private_board(cursor, title, user_id):
    cursor.execute(f'''
                    INSERT INTO boards VALUES  (default,'{title}', {user_id});
                    ''')


@connection.connection_handler
def update_board(cursor, data):
    cursor.execute(f"""
        UPDATE boards SET title = '{data["title"]}' WHERE id = {data["id"]};
    """)


@connection.connection_handler
def delete_board(cursor, board_id):
    cursor.execute(f"""
        DELETE FROM cards WHERE cards.board_id={board_id}""")
    cursor.execute(f"""
        DELETE FROM boards WHERE boards.id={board_id}
    """)


@connection.connection_handler
def delete_card(cursor, id):
    cursor.execute(f"""
                    DELETE FROM cards WHERE id={id};
                    """)


# @connection.connection_handler
# def delete_card(cursor, id):
#     cursor.execute(f"""
#                     DELETE FROM cards WHERE id={id};
#                     """)

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
def archive_card(cursor, id):
    cursor.execute(f'''
                    INSERT INTO archive
                    SELECT id,board_id,title, status_id,order_priority
                    FROM cards
                    WHERE cards.id={id};
                    ''')


@connection.connection_handler
def revived_card(cursor, id):
    cursor.execute(f'''
                    INSERT INTO cards
                    SELECT id,board_id,title, status_id,order_priority
                    FROM archive
                    WHERE archive.id={id};
                    ''')

@connection.connection_handler
def remove_from_archive(cursor,id):
    cursor.execute(f'''
                    DELETE FROM archive WHERE id={id};
                    ''')

@connection.connection_handler
def get_archived_cards(cursor,board_id):
    cursor.execute(f'''
                    SELECT * FROM archive WHERE board_id={board_id}
                    ''')
    result=cursor.fetchall()
    return result



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
def get_user_id(cursor,username):
    print(username)
    cursor.execute(f"""
                    SELECT id FROM users
                    WHERE username='{username}'
                    """)
    result = cursor.fetchone()
    return result


# @connection.connection_handler
# def get_user_id(cursor,username):
#     cursor.execute(f"""
#                     SELECT id FROM users
#                     WHERE username='{username}'
#                     """)
#     result = cursor.fetchone()
#     return result


@connection.connection_handler
def update_card_status(cursor, card_id, status):
    cursor.execute(f"""
                    UPDATE cards
                    SET status_id={status}
                    WHERE id={card_id}
    """)