/**
 *  The unbeatable tic-tac-toe was built based on the Newell and Simon's program. https://en.wikipedia.org/wiki/Tic-tac-toe.
 *  This file is used to start the game, to update the board, and to handle the end conditions. The game officially starts
 *  when the user selects the shape of their choice. The shape 'X' goes first. After each move, the board updates. Once all
 *  the blocks are occupied or a three in a row is obtained, the game ends and the result is displayed.
 *  @Author Teresa Wang
 */




/**
 * Possible results after one turn
 * @type {{CONTINUE: string, TIE: string, LOSE: string, WIN: string}}
 */
const results={
    WIN: "You WON!",
    LOSE: "Try again!",
    TIE:"Draw! Try again!",
    CONTINUE:"Continue"
};


/**
 * This function is called when 'X' or 'O is selected by player. It initializes event listeners.
 * For every block on the board, a new event listener is created to update that block and call
 * for the computer's move. The block event listeners will be deleted when the restart button is
 * pressed and the restart event listeners will also be deleted in the process.
 *
 * @param shape     'X' or 'O'
 */
function selectShapeStart(shape){

    //Hide the 'X' and 'O' buttons and display the 'restart' button
    document.getElementById("selection-buttons").style.display='none';
    document.getElementById("restart-button").style.display='inline-block';

    //initialize player/computer shapes and create a new computer
    let playerShape=shape;
    let computerShape=(playerShape==='O')?'X':'O';
    let computer=new Computer(playerShape,computerShape);

    //For every block add an event listener which self-deletes when restart button is pressed
    let elements = document.getElementsByClassName("block");
    elements=Array.from(elements);

    elements.forEach(element => {
        let _listener=function(){
            let result;
            //if block is available and the game is not complete, allow user/computer to make modifications
            if(element.textContent==="" && isComplete(elements,computerShape)===results.CONTINUE) {
                //show player's move on board
                modifyBlock(element,playerShape,'black');

                //computer's turn and show move on board
                if (isComplete(elements,computerShape) === results.CONTINUE) {
                    let index = computer.computerTurn(elements.indexOf(element));
                    computer.board[index] = computerShape;
                    modifyBlock(elements[index],computerShape,'red');
                }
            }
            //if game is complete, display result
            if((result=isComplete(elements,computerShape))!==results.CONTINUE){
                let resultDiv = document.getElementById('result');
                resultDiv.style.display = 'block';
                resultDiv.textContent = result;
            }
        };
        //When restart is pressed, delete the event listener for each block
        function deleteEventHandler(){
            element.removeEventListener("click", _listener);
            document.getElementById('restart-button').removeEventListener('click',deleteEventHandler);
        }
        document.getElementById('restart-button').addEventListener('click',deleteEventHandler);
        element.addEventListener('click',_listener);
    });

    //if computer gets first move, make first move
    if(computerShape==='X'){
        let index=computer.computerTurn();
        computer.board[index] = computerShape;
        modifyBlock(elements[index],computerShape,'red');
    }
}

/**
 * Modify block after a turn by adding the shape('X' or 'O'), color, and disabling the hover feature
 *
 * @param block             identifies which block is being modified
 * @param shape             'X' or 'O'
 * @param color             'red' is computer and 'black' is user
 */
function modifyBlock(block, shape, color){
    block.textContent = shape;
    block.style.color = color;
    block.className += (' no-hover');
}


/**
 * This function checks if the game has ended. If the game ends with win/lose
 * then the winning row/col is highlighted. The result is returned.
 * @param elements          Array of all the blocks (casted from HTMLCollection)
 * @param computerShape     'X' or 'O' assigned to the computer
 * @returns {string}
 */
function isComplete(elements,computerShape){
    //find 3 in a row
    for (let i=0;i<elements.length;i++) {
        let firstElement=elements[i].textContent;
        let isComputer=(firstElement===computerShape);
        if(firstElement!=='') {
            if (i < 3) {
                //if i is in first row, check column
                if (elements[3 + i].textContent === firstElement && elements[6 + i].textContent === firstElement) {
                    elements[i].style.backgroundColor='yellow';
                    elements[3+i].style.backgroundColor='yellow';
                    elements[6+i].style.backgroundColor='yellow';
                    return (isComputer)?results.LOSE:results.WIN;
                }
                //if i is 0 or 2, check diagonal
                if ((i === 0 || i === 2) && elements[4].textContent === firstElement && elements[8 - i].textContent === firstElement){
                    elements[i].style.backgroundColor='yellow';
                    elements[4].style.backgroundColor='yellow';
                    elements[8-i].style.backgroundColor='yellow';
                    return (isComputer)?results.LOSE:results.WIN;
                }
            }
            //if i is in first column,check row
            if (i % 3 === 0 && elements[i + 1].textContent === firstElement && elements[i + 2].textContent === firstElement) {
                elements[i].style.backgroundColor='yellow';
                elements[i+1].style.backgroundColor='yellow';
                elements[i+2].style.backgroundColor='yellow';
                return (isComputer)?results.LOSE:results.WIN;
            }
        }
    }
    //check if all blocks filled
    for (let item of elements){
        if(item.textContent===""){
            return results.CONTINUE;
        }
    }return results.TIE;
}

/**
 * Resets the buttons and blocks to it's original state.
 */
function restart(){

    document.getElementById("selection-buttons").style.display='inline-block';
    document.getElementById("restart-button").style.display='none';

    let elements= Array.from(document.getElementsByClassName("block"));
    elements.forEach(element => {
        element.classList.remove("no-hover");
        element.textContent='';
        element.style.backgroundColor='transparent';
        }
    );

    let resultDiv = document.getElementById('result');
    resultDiv.style.display = 'none';
    resultDiv.textContent = '';
}



