// It uses data_handler.js to visualize elements
import { dataHandler } from "./data_handler.js";

export let dom = {
    init: function () {
        // This function should run once, when the page is loaded.
    },
    loadBoards: function () {
        // retrieves boards and makes showBoards called
        dataHandler.getBoards(function(boards){
            dom.showBoards(boards);
        });
    },
    showBoards: function (boards) {
        // shows boards appending them to #boards div
        // it adds necessary event listeners also


        let boardsContainer = document.querySelector('.board-container');



        for(let board of boards){
            let boardLi = `
                <section class="board">
                <div class="board-header"><span class="board-title">${board.title}</span>
                <button class="board-add">Add Card</button>
                <button id="${board.id}" class="board-toggle"><i class="fas fa-chevron-down"></i></button>
                </>
                </section>
                
            `;

            boardsContainer.innerHTML += boardLi

        }
        let expand_buttons = document.getElementsByClassName("board-toggle")
        for (let expand_button of expand_buttons){
            expand_button.addEventListener('click', function(e) {

                dom.loadCards(e.target.id)
            })
        }},
    loadCards: function (boardId) {
        $.get(`/get-cards/${boardId}`, function(data){
                dom.showCards(data, boardId)

            })
        // retrieves cards and makes showCards called
    },
    showCards: function (cards, boardId) {
        let card_list = document.getElementById(`card_list_${boardId}`)
        return cards
        // shows the cards of a board
        // it adds necessary event listeners also
    },
    // here comes more features
};
