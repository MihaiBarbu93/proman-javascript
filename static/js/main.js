import { dom } from "./dom.js?ddoskdlkslkdk";

// This function is to initialize the application
function init() {
    // init data
    dom.init();
    // loads the boards to the screen
    dom.loadBoards();
    dom.addBoardModal();
    dom.addPrivateBoardModal();
    dom.registerModal()
    dom.loginModal()
}


init();
