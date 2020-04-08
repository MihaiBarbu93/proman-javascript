DROP TABLE cards;
DROP TABLE statuses;
DROP TABLE boards;


CREATE TABLE boards(
        id serial not null ,
        title varchar(20) NOT NULL UNIQUE,
        PRIMARY KEY (id)
);

CREATE TABLE statuses(
        id serial not null ,
        title varchar(20),
        PRIMARY KEY (id)
);

CREATE TABLE cards(
        id serial  NOT NULL ,
        board_id integer ,
        title varchar(20),
        status_id integer ,
        order_priority integer ,
        PRIMARY KEY (id),
        FOREIGN KEY (board_id) REFERENCES boards(id),
        FOREIGN KEY (status_id) REFERENCES statuses(id)
);

INSERT INTO boards (title) VALUES('Board1');
INSERT INTO boards (title) VALUES('Board2');
INSERT INTO statuses (title) VALUES('New');
INSERT INTO statuses (title) VALUES('In progress');
INSERT INTO statuses (title) VALUES('Testing');
INSERT INTO statuses (title) VALUES('Done');
INSERT INTO cards (board_id, title, status_id, order_priority) VALUES(1,'New Card1',1,0)
INSERT INTO cards (board_id, title, status_id, order_priority) VALUES(1,'New Card2',1,1);
INSERT INTO cards (board_id, title, status_id, order_priority) VALUES(1,'In progress card',2,0);
INSERT INTO cards (board_id, title, status_id, order_priority) VALUES(1,'Planing',3,0);
INSERT INTO cards (board_id, title, status_id, order_priority) VALUES(1,'Done Card 1',4,0);
INSERT INTO cards (board_id, title, status_id, order_priority) VALUES(1,'Done Card 1',4,1);
INSERT INTO cards (board_id, title, status_id, order_priority) VALUES(2,'new card 1',1,0);
INSERT INTO cards (board_id, title, status_id, order_priority) VALUES(2,'new card 2',1,1);
INSERT INTO cards (board_id, title, status_id, order_priority) VALUES(2,'in progress card',2,0);
INSERT INTO cards (board_id, title, status_id, order_priority) VALUES(2,'planning',3,0);;
INSERT INTO cards (board_id, title, status_id, order_priority) VALUES(2,'done card 1',4,0);
INSERT INTO cards (board_id, title, status_id, order_priority) VALUES(2,'done card 1',4,1);

