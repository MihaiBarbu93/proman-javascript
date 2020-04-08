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
            dom.loadColumns(boards);
        });
    },
    showBoards: function (boards) {
        // shows boards appending them to #boards div
        // it adds necessary event listeners also


        let boardsContainer = document.querySelector('.board-container');


        for(let board of boards){
            let boardLi = `
                <section class="board">
                    <div class="board-header">
                        <span class="board-title">${board.title}</span>
                        <button class="board-add">Add Card</button>
                        <button id="${board.id}" class="board-toggle btn btn-link" data-toggle="collapse" data-target="#collapse${board.id}" aria-expanded="false" aria-controls="collapseOne">
                        <i class="fas fa-chevron-down"></i></button>
                    </div>
                    <div id="collapse${board.id}" class="collapse show">
                        <div class="board-columns"></div>
                    </div>
                </section>
                
            `;

            boardsContainer.innerHTML += boardLi
            

        }
        let expand_buttons = document.getElementsByClassName("board-toggle")
        console.log(expand_buttons)
        for (let expand_button of expand_buttons) {
            expand_button.addEventListener('click', function (e) {

                
                console.log(expand_button.id);

                dom.loadCards(expand_button.id)
            })
        }
    },

    loadColumns: function () {

        let statuses = ['New', 'In progress', 'Testing', 'Done']
        const boardColumnsContainers = document.querySelectorAll(".board-columns");
        for (let boardColumnsContainer of boardColumnsContainers) {
            for (let i = 0; i < statuses.length; i++) {
                let boardColumn = `<div class="board-column">
                    <div class="board-column-title">${statuses[i]}</div>
                </div>`;
                
                boardColumnsContainer.innerHTML += boardColumn;
            }
        }
    },
    

    loadCards: function (boardId) {
        $.get(`/get-cards/${boardId}`, function (data) {
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
    addBoardModal: function () {
        let addButton=document.getElementById('new_board_btn')
        let modal = document.getElementById("myModal")
        let close_btn= document.getElementById("close_modal")
        addButton.addEventListener('click',function (event) {
            modal.style.display = "block";
        })
        close_btn.addEventListener("click",function (event) {
            modal.style.display = "none";
        })
    },
    // here comes more features
};
