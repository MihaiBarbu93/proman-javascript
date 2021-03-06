import connection

@connection.connection_handler
def _read_table(cursor,table_name):
    """
    Reads content of a .csv file
    :param file_name: relative path to data file
    :return: OrderedDict
    """
    cursor.execute(f'''
                    SELECT * FROM {table_name}

                    ''')
    result = cursor.fetchall()
    return result





# def _get_data(data_type, file, force):
#     """
#     Reads defined type of data from file or cache
#     :param data_type: key where the data is stored in cache
#     :param file: relative path to data file
#     :param force: if set to True, cache will be ignored
#     :return: OrderedDict
#     """
#     if force or data_type not in _cache:
#         _cache[data_type] = _read_table(file)
#     return _cache[data_type]


def get_statuses():
    return _read_table('statuses')

@connection.connection_handler
def get_boards(cursor, user_id=None):
    if user_id == None:
        user_id ='null'
    cursor.execute(f'''
                        SELECT * FROM boards WHERE user_id IS NULL OR user_id={user_id} ORDER BY id

                        ''')
    result = cursor.fetchall()
    return result

def get_cards():
    return _read_table('cards')
