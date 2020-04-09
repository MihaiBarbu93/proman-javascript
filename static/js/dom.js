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
            dom.showColumns(boards);
        });
    },
    showBoards: function (boards) {
        // shows boards appending them to #boards div
        // it adds necessary event listeners also


        let boardsContainer = document.querySelector('.board-container');


        for (let board of boards) {
            let boardLi =
              `
                <section class="board" id="board` +board.id +`">
                    <div class="board-header">
                        <span class="board-title" id="board-title-` +
              board.id +
              `" contenteditable="true">${board.title}</span>
                        <button class="board-add" id="add-card-btn-${board.id}">Add Card</button>
                        <button id="${board.id}" class="board-toggle btn btn-link" data-toggle="collapse" data-target="#collapse${board.id}" aria-expanded="false" aria-controls="collapseOne">
                        <i class="fas fa-chevron-down"></i></button>
                    </div>
                    <div id="collapse${board.id}" class="collapse">
                        <div class="board-columns"></div>
                    </div>
                </section>
                
            `;

            boardsContainer.innerHTML += boardLi
            
        }

        
        let titles = document.getElementsByClassName("board-title")
        for (let title of titles){
            title.addEventListener('blur', function(e){

                dom.updateBoardTitle(e.target.id)})}



        const addCardButtons = document.getElementsByClassName('board-add');
        for (let btn of addCardButtons){
            btn.addEventListener('click', function(){
                dom.addCard(btn);
            })
        }
    },

    showColumns : function (boards) {


        let boardColumnContainers = document.querySelectorAll('.board-columns');


        let expand_buttons = document.getElementsByClassName("board-toggle")
    
        
        for (let expand_button of expand_buttons) {
            expand_button.addEventListener('click', async function (e) {
            
                if(e.target.className == 'fas fa-chevron-down'){
                    var boardId = parseInt(e.target.parentNode.id);
                }else{
                    var boardId = parseInt(e.target.id);
                }

                dom.loadCards(boardId)


                let allStatuses = []
                fetch('/get-statuses')
                    .then((response) => response.json())
                    .then(responseJson => {

                        let boardsCollection = document.getElementsByClassName("board");
                        for (let board of boardsCollection) {
                            if (board.id.substr(-1) == boardId) {
                                for (let i = 0; i < responseJson.length; i++) {
                                    if (parseInt(responseJson[i]["board_id"]) == 0 || board.id.substr(-1) == responseJson[i]["board_id"]) {
                                        allStatuses.push(responseJson[i]["title"]);
                                        
                                    }
                                }
                            }
                        }

           
                        for (let board of boards) {
                            if (board.id == boardId) {
                                
                                boardColumnContainers[board.id - 1].innerHTML = "";
                                for (let i = 0; i < allStatuses.length; i++) {
                                    let boardColumn = `<div class="board-column" id="board-column`+responseJson[i]['id']+`">
                                <div class="board-column-title">${allStatuses[i]}</div>
                                <div class="board-column-content" id="${allStatuses[i]}"></div>
                                </div>`;

                                    boardColumnContainers[board.id - 1].innerHTML += boardColumn;
                                    
                                }
                                let addColumnButton = `<button id="board_col_id_`+board.id+`" class="column-add" data-board-id="`+board.id+`">Add Column</button>`;
                                boardColumnContainers[board.id - 1].innerHTML += addColumnButton;
                                dom.addColumn()
                            }
                        }
                    })
            })
        }
    },


    addColumn: function () {

        let addColumnButtons = document.getElementsByClassName("column-add");

        for (let addColumnButton of addColumnButtons) {
            addColumnButton.addEventListener('click', async function () {
                let modal = document.getElementById("addColumnModal");
                let close_btn = document.getElementById("close_column_modal");
                addColumnButton.addEventListener("click", function (event) {
                modal.style.display = "block";
                let boardId = $(this).data('boardId');
                $(".modal-body #boardId").val(boardId);
                });
                close_btn.addEventListener("click", function (event) {
                modal.style.display = "none";
                });     
            })
        }

    },

    loadCards: function (boardId) {

         // retrieves cards and makes showCards calle

        const requestCards = new XMLHttpRequest();
        requestCards.onreadystatechange = function(){
            if(requestCards.readyState == 4 && requestCards.status == 200){
                let cards = JSON.parse(requestCards.response);
                dom.showCards(cards, boardId);
            }
        }
        requestCards.open('GET', `/get-cards/${boardId}`, true);
        requestCards.send();

        let Cardtitles = document.getElementsByClassName("card-title")
        console.log(Cardtitles)
        for (let title of Cardtitles){
            console.log(title)

            title.addEventListener('keypress', function(e){
                if (e.keyCode === 13) {
                    e.preventDefault();
                    dom.updateCardTitle(e.target.id)
                }

            });
        }

    },

    test: function(id){
      console.log(id)
    },

    updateCardTitle: function (CardId){
            let cardTitle = CardId;
            console.log("wwwwwwwwwwwwwwwwwwwwwwwwwwwadsasacasc",cardTitle)
            let titleValue = document.getElementById(cardTitle);
            let data = {
                'id': CardId,
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

        fetch('/update-card',settings)
            .then((serverResponse)=>{
                return serverResponse.json();
            })
            .then((jsonResponse)=>{
                console.log(jsonResponse);
            })
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
        const boardColumns = document.getElementsByClassName('board-columns')[boardId - 1]

        for(let boardCol of boardColumns.childNodes){
            try{
                var colContentId = boardCol.childNodes[3].id;
            }
            catch{
                continue;
            }
            for(let card of cards){
                if(colContentId == card['status_id']){
                    let cardElement = document.createElement('div');
                    cardElement.setAttribute('class', 'card');
                    let cardRemove = document.createElement('div');
                    cardRemove.setAttribute('class', 'card-remove');
                    let i = document.createElement('i');
                    i.setAttribute('class', 'fas fa-trash-alt');
                    cardRemove.appendChild(i);
                    cardElement.appendChild(cardRemove);
                    let cardTitle = document.createElement('div');
                    cardTitle.setAttribute('class', 'card-title');
                    cardTitle.setAttribute('id', 'card-id-'+card['id']);
                    cardTitle.setAttribute('contenteditable', true);
                    cardTitle.textContent = card['title'];
                    cardElement.appendChild(cardTitle);
                    boardCol.childNodes[3].appendChild(cardElement);

                }
            }
        }
        // shows the cards of a board
        // it adds necessary event listeners also
    },

    addCard: function(btnPressed){
        console.log(btnPressed)
        const boardId = btnPressed.id.replace('add-card-btn-', '')
        const hiddenInput = document.getElementById('card-boardId')
        hiddenInput.value = boardId
        let modal = document.getElementById('addCardModal');
        
        modal.style.display = 'block';
        let closeBtn = document.getElementById('close_column_modal');
        closeBtn.addEventListener('click', function(){
            modal.style.display = 'none';
        })

        const submitBtn = document.getElementById('submit_card');
        submitBtn.addEventListener('click', function(){
            modal.style.display = 'none';
            dom.loadCards(boardId)
        })

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
    sendColumnInfo: function (col_id,title){

            let data = {
                'id': col_id ,
                'title': title ,
             }

            let settings = {
                'method': 'POST',
                'headers': {
                'Content-Type' : 'application/json',
                'Accept' : 'application/json'
            },
            body: JSON.stringify(data),
            }

        fetch('/add-column',settings)
            .then((serverResponse)=>{
                return serverResponse.json();
            })
            .then((jsonResponse)=>{
                console.log(jsonResponse);
            })
    },
    registerModal: function () {
        let username=document.getElementById("orangeForm-name")
        let password=document.getElementById("orangeForm-pass")
        let reg_modal_btn=document.getElementById("reg_btn")
        let error_mss=document.getElementById("error_message")
        let modal=document.getElementById("modalRegisterForm")
        let close_btn=document.getElementById("reg_md_close")
        close_btn.addEventListener("click",function (event) {
            error_mss.style.display="none"
        })
        reg_modal_btn.addEventListener("click",function (event) {
            event.preventDefault()
            let data = {
                'username': username.value
             }
            fetch(`/check-usr-existence?username=${data['username']}`)
                    .then((serverResponse)=>{
                    return serverResponse.json();
            })
                    .then((jsonResponse)=>{
                    console.log(jsonResponse);
                    if (jsonResponse['state'] == "Exist"){
                        error_mss.style.display="block"
                        username.value=""
                        password.value=""


                    }
                    else {
                        error_mss.style.display="none"
                        let data2 = {
                            'username': username.value,
                            'password': password.value
                            }

                        let settings = {
                            'method': 'POST',
                            'headers': {
                            'Content-Type' : 'application/json',
                            'Accept' : 'application/json'
                        },
                        "body": JSON.stringify(data2),
                        }

                        fetch('/register',settings)
                            .then((serverResponse)=>{
                                return serverResponse.json();
                            })
                            .then((serverResponse)=>{
                                if (serverResponse.success){
                                    modal.classList.remove("show")
                                    modal.nextElementSibling.classList.remove("show")
                                    username.value=""
                                    password.value=""
                                }
                            })

                    }
            })
        })
    },
    loginModal: function () {
        let username=document.getElementById("defaultForm-email")
        let password=document.getElementById("defaultForm-pass")
        let login_modal_btn=document.getElementById("login_btn")
        let error_mss=document.getElementById("login_error_message")
        let modal=document.getElementById("modalLoginForm")
        let login_close_btn=document.getElementById("log_close_btn")
        login_close_btn.addEventListener("click",function (event){
            error_mss.style.display="none"
        })
        login_modal_btn.addEventListener("click",function (event) {
            event.preventDefault()
            let data = {
                'username': username.value,
                'password':password.value
             }
            fetch(`/check-login-credentials?username=${data['username']}&password=${data['password']}`)
                    .then((serverResponse)=>{
                    return serverResponse.json();
            })
                    .then((jsonResponse)=>{
                    console.log(jsonResponse);
                    if (jsonResponse['state'] == "Incorrect"){
                        error_mss.style.display="block"
                        username.value=""
                        password.value=""


                    }
                    else {
                        error_mss.style.display="none"
                        let data3 = {
                            'username': username.value,
                            'password': password.value
                            }
                        let settings = {
                            'method': 'POST',
                            'headers': {
                            'Content-Type' : 'application/json',
                            'Accept' : 'application/json'
                        },
                        "body": JSON.stringify(data3),
                        }

                        fetch('/login',settings)
                            .then((serverResponse)=>{
                                return serverResponse.json();
                            })
                            .then((serverResponse)=>{
                                if (serverResponse.success){
                                    modal.classList.remove("show")
                                    modal.nextElementSibling.classList.remove("show")
                                    modal.style.display="none"
                                    username.value=""
                                    password.value=""
                                    window.location.href="/"
                                }
                            })

                    }
            })
        })
    },

    // here comes more features
};


