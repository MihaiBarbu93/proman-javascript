import persistence,connection


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
    print(matching_cards)
    return matching_cards


@connection.connection_handler
def _insert_board(cursor,title):
    cursor.execute(f'''
                    INSERT INTO boards VALUES  (default,'{title}');
                    ''')


@connection.connection_handler
def get_all_statuses(cursor):
    cursor.execute(f'''
    SELECT title from statuses;
    ''')
    statuses = cursor.fetchall()
    return statuses