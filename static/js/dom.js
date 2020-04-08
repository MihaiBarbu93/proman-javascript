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
                <div class="board-header"><span class="board-title" id="board-title-`+board.id+`" contenteditable="true" >${board.title}</span>
                <button class="board-add">Add Card</button>
                <button id="${board.id}" class="board-toggle"><i class="fas fa-chevron-down"></i></button>
                </>
                </section>
                
            `;

            boardsContainer.innerHTML += boardLi

        }



        let expand_buttons = document.getElementsByClassName("board-toggle")
        let titles = document.getElementsByClassName("board-title")
        for (let title of titles){
            title.addEventListener('blur', function(e){

                dom.updateBoardTitle(e.target.id)})}

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
    updateBoardTitle: function (boardId){
            let boardTitle = boardId;
            let titleValue = document.getElementById(boardTitle);
            let data = {
                'id': boardId,
                'title': titleValue.innerHTML,
             }

            let settings = {
                'method': 'POST',
                'headers': {
                'Content-Type' : 'application/json',
                'Accept' : 'application/json'
            },
            body: JSON.stringify(data),
            }

        fetch('/update-board',settings)
            .then((serverResponse)=>{
                return serverResponse.json();
            })
            .then((jsonResponse)=>{
                console.log(jsonResponse);
            })
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


