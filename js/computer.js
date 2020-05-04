/**
 *  The unbeatable tic-tac-toe was built based on the Newell and Simon's program. https://en.wikipedia.org/wiki/Tic-tac-toe.
 *  This file is used to generate the computer player's move. The basic helper methods are located on the top and they advance
 *  as you go down. The primary executed method (computerTurn) is located on line 281. Below the primary executed method is
 *  a testing method.
 *  @Author Teresa Wang
 *
 */

class Computer {
    constructor(playerShape,computerShape){
        this.board = ['', '', '', '', '', '', '', '', ''];
        this.playerShape=playerShape;
        this.computerShape=computerShape;
    }

    /*---------------------------------------HELPER FUNCTIONS----------------------------------------*/

    /**
     * @param i                 index of list
     * @param player            'X' or 'O'
     * @returns {boolean}       True if list[i] is the same shape as the player shape
     */
    isElementSameShape(i, player) {
        return this.board[i] === player;
    }

    /**
     * @param i                 index of list
     * @returns {boolean}       True if list[i] is empty ''
     */
    isBlockEmpty(i) {
        return this.isElementSameShape(i, '');
    }

    /**
     * @param i                 index of list
     * @returns {boolean}       True if index is on the first column
     */
    isOnFirstCol(i) {
        return i % 3 === 0;
    }

    /**
     * @param i                 index of list
     * @param player            'X' or 'O'
     * @returns {boolean}       True if list[i-1] is the same shape as provided
     */
    isLeftElementSameShape(i, player) {
        return this.isElementSameShape(i - 1, player);
    }

    /**
     * @param i                     current index
     * @param player                'X' or 'O'
     * @returns {boolean}           True if the block directly above is occupied by the shape of the player
     */
    isAboveElementSameShape(i, player) {
        return this.board[i - 3] === player;
    }

    /**
     * Find empty block in row ASSUMING that two blocks are consecutively filled and the current position is the second of the two blocks
     * @param i                 index of list
     * @returns {number}        index or -1
     */
    indexOfSpaceInRow(i) {
        if (i % 3 === 1) {
            return (this.board[i + 1] === '') ? i + 1 : -1;
        } else {
            return (this.board[i - 2] === '') ? i - 2 : -1;
        }
    }

    /**
     * @param i                 current index
     * @returns {number}        index of empty block in the column of the current index
     */
    indexOfSpaceInCol(i) {
        if (i >= 6) {
            return (this.board[i - 6] === '') ? i - 6 : -1;
        } else {
            return (this.board[i + 3] === '') ? i + 3 : -1;
        }
    }

    /**
     * @param player            'X' or 'O'
     * @returns {number}        index of a diagonal empty space or -1
     */
    indexOfSpaceInDiagonal(player) {
        for (let i = 0; i < this.board.length; i += 2) {
            if (i !== 4 && this.board[i] === player && this.board[8 - i] === ""){
                return 8 - i;
            }
        }
        return -1;
    }

    /**
     * Solve/block cases where a user has two in a row with one empty block on the row/column
     *
     * @param player           'X' or 'O'
     * @returns {*|number|number}       index or -1
     */
    twoInRow(player) {
        for (let i = 0; i < this.board.length; i++) {
            if (this.isElementSameShape(i, player)) {
                let a;
                if (!this.isOnFirstCol(i) && this.isLeftElementSameShape(i, player) && (a = this.indexOfSpaceInRow(i)) >= 0) {//two in a row
                    return a;
                } else if (i >= 3 && this.isAboveElementSameShape(i, player) && (a = this.indexOfSpaceInCol(i)) >= 0) {//two in a column
                    return a
                } else if (i === 4 && this.isElementSameShape(4, player) && (a = this.indexOfSpaceInDiagonal(player)) >= 0) { // diagonal
                    return a;
                } else if (this.isOnFirstCol(i) && this.isElementSameShape(i + 1, '') && this.isElementSameShape(i + 2, player)) {
                    return i + 1;
                } else if (i < 3 && this.isElementSameShape(i, player) && this.isElementSameShape(i + 3, '') && this.isElementSameShape(i + 6, player)) {
                    return i + 3;
                } else if (i === 0 && this.isElementSameShape(i, player) && this.isElementSameShape(4, '') && this.isElementSameShape(8, player)) {
                    return 4;
                } else if (i === 2 && this.isElementSameShape(i, player) && this.isElementSameShape(4, '') && this.isElementSameShape(6, player)) {
                    return 4;
                }
            }
        }
        return -1;
    }

    /**
     * If list[index] is replaced by the shape of the player, how many two-in-a-rows can you create?
     *      Checks in the diagonal/vertical/horizontal directions from the index.
     *
     * @param player            'X' or 'O'
     * @param index             index of possible location of player
     * @returns {number}        number of 2-in-a-rows created
     */
    twoFilledOneSpace(player,index) {
        let count = 0;                      //count number of "two filled, one space" patterns if list[index] equals playerShape
        this.board[index] = player;     //temporarily place the shape on the block

        let col=index%3;
        let row=Math.floor(index/3);

        //check diagonal
        let hash = {'O': 0, 'X': 0, "": 0};
        if (index === 0 || index === 2 || index === 6 || index === 8) {//check diagonal if corner index
            hash[this.board[index]]++;
            hash[this.board[8 - index]]++;
            hash[this.board[4]]++;
            if (hash[player] === 2 && hash[""] === 1) {
                count++;
            }
        }else if(index===4){  //check both diagonals if center index. ([0,4,8] and [2,4,6])
            for(let i=0;i<=2;i+=2){
                hash = {'O': 0, 'X': 0, "": 0};
                hash[this.board[i]]++;
                hash[this.board[4]]++;
                hash[this.board[8-i]]++;
                if (hash[player] === 2 && hash[""] === 1) {
                    count++;
                }
            }
        }

        //check vert
        hash = {'O': 0, 'X': 0, "": 0};
        hash[this.board[col]]++;
        hash[this.board[3 + col]]++;
        hash[this.board[6 + col]]++;

        if (hash[player] === 2 && hash[""] === 1) {
            count++;
        }
        //check horiz
        hash = {'O': 0, 'X': 0, "": 0};
        hash[this.board[3*row]]++;
        hash[this.board[3*row+1]]++;
        hash[this.board[3*row+2]]++;

        if (hash[player] === 2 && hash[""] === 1) {
            count++;
        }

        // Remove temporarily added piece on the block
        this.board[index]="";

        return count;

    }

    /**
     * This method goes through each empty block on the board and sees this causes a viable fork.
     * For analyzing computer turn, the first index where you can create a fork is returned, or -1.
     * For analyzing player turn, this method will count the number possible forks that can be created.
     *      If the count is greater than one, then we must make computer have two in a row (one step to win)
     *      If the count is one, we return that index
     *      else return -1
     * @param player           'X' or 'O'
     * @returns {number}
     */
    fork(player){
        let count=0;
        let index;
        for(let i=0; i<this.board.length; i++){
            if(this.board[i]==='' && this.twoFilledOneSpace(player,i)>=2){
                if(player===this.computerShape){
                    return i;
                }
                count++;
                index=i;
            }
        }

        if(count>1){ //only for this.playerShape (not this.computerShape)
            for(let i=1; i<this.board.length; i+=2){
                if(this.board[i]==='' && this.twoFilledOneSpace(this.computerShape,i)>=1){
                    return i;
                }
            }
        }else if(count===1){//only for this.playerShape (not this.computerShape)
            return index;
        }return -1;

    }

    /**
     * This finds an index which is diagonal to the enemy corner piece.
     *
     * @returns {number}        return index or -1
     */
    indexOppositeEnemyCorner() {
        for (let i = 0; i < this.board.length; i += 2) {
            if (i !== 4) {
                if (this.board[i] === this.playerShape && this.board[8 - i] === '') {
                    return 8 - i;
                }
            }
        }
        return -1;
    }

    /**
     * This returns an index of available corner block.
     *
     * @returns {number}        return index or -1
     */
    indexEmptyCorner() {
        for (let i = 0; i < this.board.length; i += 2) {
            if (i !== 4) {
                if (this.board[i] === '') {
                    return i;
                }
            }
        }
        return -1;
    }

    /**
     * This returns an available side block. Side excludes the corner blocks as well as the middle block.
     *
     * With our implementation of tic-tac-toe, this method will only be called as a last resort.
     * This means that the center and corners must be already filled and there must be at least one empty side block available.
     *
     * @returns {number}        return index or -1
     */
    indexEmptySides() {
        for (let i = 1; i < this.board.length; i += 2) {
            if (this.board[i] === "") {
                return i;
            }
        }
        return -1;
    }

    /* ---------------------------------------------------PRIMARY FUNCTION--------------------------------------------------*/
    /**
     *  This method updates the board list with player move and then selects the computer's move
     *  and modifies the board list.
     * @param index
     */
    computerTurn(index=-1) {
        if(index!==-1) {
            this.board[index] = this.playerShape;                        // update player move
        }

        let funResultStorage;                                       //Return value of helper method that is satisfied

        if ((funResultStorage = this.twoInRow(this.computerShape)) >= 0) {
            return funResultStorage;
        } else if ((funResultStorage = this.twoInRow(this.playerShape)) >= 0) {
            return funResultStorage;
        } else if ((funResultStorage = this.fork(this.computerShape)) >= 0) {
            return funResultStorage;
        } else if ((funResultStorage = this.fork(this.playerShape)) >= 0) {
            return funResultStorage;
        } else if (this.isBlockEmpty(funResultStorage=4)) {
            return funResultStorage;
        } else if ((funResultStorage = this.indexOppositeEnemyCorner()) >= 0) {
            return funResultStorage;
        } else if ((funResultStorage = this.indexEmptyCorner()) >= 0) {
            return funResultStorage;
        } else if ((funResultStorage = this.indexEmptySides()) >= 0) {
            return funResultStorage;
        }

    }










    /* ----------------------------------------------- Test ---------------------------------------------------*/
    // test(){
    //     //save original shapes
    //     let cs=this.computerShape;
    //     let ps=this.playerShape;
    //
    //     //replace shapes
    //     this.computerShape='X';
    //     this.playerShape='O';
    //
    //     /* TWO IN A ROW - ROW*/
    //     this.board=[
    //         'X','X','',
    //         '','','',
    //         '','',''
    //     ];
    //     console.log('Left consecutive row: ' + (this.twoInRow('X')===2).toString());
    //     this.board=[
    //         '','','',
    //         'X','X','',
    //         '','',''
    //     ];
    //     console.log('Left consecutive row: ' + (this.twoInRow('X')===5).toString());
    //     this.board=[
    //         '','','',
    //         '','','',
    //         'X','X',''
    //     ];
    //     console.log('Left consecutive row: ' + (this.twoInRow('X')===8).toString());
    //
    //
    //
    //     this.board=[
    //         '','X','X',
    //         '','','',
    //         '','',''
    //     ];
    //     console.log('Right consecutive row: ' + (this.twoInRow('X')===0).toString());
    //     this.board=[
    //         '','','',
    //         '','X','X',
    //         '','',''
    //     ];
    //     console.log('Right consecutive row: ' + (this.twoInRow('X')===3).toString());
    //     this.board=[
    //         '','','',
    //         '','','',
    //         '','X','X'
    //     ];
    //     console.log('Right consecutive row: ' + (this.twoInRow('X')===6).toString());
    //
    //
    //
    //     this.board=[
    //         'X','','X',
    //         '','','',
    //         '','',''
    //     ];
    //     console.log('Gap row: ' + (this.twoInRow('X')===1).toString());
    //     this.board=[
    //         '','','',
    //         'X','','X',
    //         '','',''
    //     ];
    //     console.log('Gap row: ' + (this.twoInRow('X')===4).toString());
    //     this.board=[
    //         '','','',
    //         '','','',
    //         'X','','X'
    //     ];
    //     console.log('Gap row: ' + (this.twoInRow('X')===7).toString());
    //
    //
    //
    //     /* TWO IN A ROW - COLUMN*/
    //     this.board=[
    //         'X','','',
    //         'X','','',
    //         '','',''
    //     ];
    //     console.log('Top consecutive col: ' + (this.twoInRow('X')===6).toString());
    //     this.board=[
    //         '','X','',
    //         '','X','',
    //         '','',''
    //     ];
    //     console.log('Top consecutive col: ' + (this.twoInRow('X')===7).toString());
    //     this.board=[
    //         '','','X',
    //         '','','X',
    //         '','',''
    //     ];
    //     console.log('Top consecutive col: ' + (this.twoInRow('X')===8).toString());
    //
    //
    //
    //     this.board=[
    //         '','','',
    //         'X','','',
    //         'X','',''
    //     ];
    //     console.log('Bottom consecutive col: ' + (this.twoInRow('X')===0).toString());
    //     this.board=[
    //         '','','',
    //         '','X','',
    //         '','X',''
    //     ];
    //     console.log('Bottom consecutive col: ' + (this.twoInRow('X')===1).toString());
    //     this.board=[
    //         '','','',
    //         '','','X',
    //         '','','X'
    //     ];
    //     console.log('Bottom consecutive col: ' + (this.twoInRow('X')===2).toString());
    //
    //
    //
    //     this.board=[
    //         'X','','',
    //         '','','',
    //         'X','',''
    //     ];
    //     console.log('Gap col: ' + (this.twoInRow('X')===3).toString());
    //     this.board=[
    //         '','X','',
    //         '','','',
    //         '','X',''
    //     ];
    //     console.log('Gap col: ' + (this.twoInRow('X')===4).toString());
    //     this.board=[
    //         '','','X',
    //         '','','',
    //         '','','X'
    //     ];
    //     console.log('Gap col: ' + (this.twoInRow('X')===5).toString());
    //
    //
    //
    //     /* TWO IN A ROW - Diagonal*/
    //     this.board=[
    //         'X','','',
    //         '','X','',
    //         '','',''
    //     ];
    //     console.log('Top diag: ' + (this.twoInRow('X')===8).toString());
    //     this.board=[
    //         '','','X',
    //         '','X','',
    //         '','',''
    //     ];
    //     console.log('Top diag: ' + (this.twoInRow('X')===6).toString());
    //
    //
    //
    //     this.board=[
    //         '','','',
    //         '','X','',
    //         'X','',''
    //     ];
    //     console.log('Bottom diag: ' + (this.twoInRow('X')===2).toString());
    //     this.board=[
    //         '','','',
    //         '','X','',
    //         '','','X'
    //     ];
    //     console.log('Bottom diag: ' + (this.twoInRow('X')===0).toString());
    //
    //
    //
    //     this.board=[
    //         'X','','',
    //         '','','',
    //         '','','X'
    //     ];
    //     console.log('Gap diag: ' + (this.twoInRow('X')===4).toString());
    //     this.board=[
    //         '','','X',
    //         '','','',
    //         'X','',''
    //     ];
    //     console.log('Gap diag: ' + (this.twoInRow('X')===4).toString());
    //
    //     /* FORK */
    //     this.board=[
    //         '','','X',
    //         '','O','',
    //         'X','','O'
    //     ];
    //     console.log('Fork: ' + (this.fork(this.computerShape)===0).toString());
    //     this.board=[
    //         'O','','X',
    //         '','O','',
    //         'X','',''
    //     ];
    //     console.log('Fork: ' + (this.fork(this.computerShape)===8).toString());
    //     this.board=[
    //         'X','','O',
    //         '','O','',
    //         '','','X'
    //     ];
    //     console.log('Fork: ' + (this.fork(this.computerShape)===6).toString());
    //     this.board=[
    //         'X','','',
    //         '','O','',
    //         'O','','X'
    //     ];
    //     console.log('Fork: ' + (this.fork(this.computerShape)===2).toString());
    //
    //
    //     this.board=[
    //         'X','O','X',
    //         'O','','',
    //         '','',''
    //     ];
    //     console.log('Fork: ' + (this.fork(this.computerShape)===4).toString());
    //     this.board=[
    //         'X','','',
    //         'O','','',
    //         'X','O',''
    //     ];
    //     console.log('Fork: ' + (this.fork(this.computerShape)===2).toString());
    //     this.board=[
    //         '','','',
    //         'O','','',
    //         'X','O','X'
    //     ];
    //     console.log('Fork: ' + (this.fork(this.computerShape)===2).toString());
    //     this.board=[
    //         '','','X',
    //         '','','O',
    //         'O','','X'
    //     ];
    //     console.log('Fork: ' + (this.fork(this.computerShape)===0).toString());
    //
    //
    //     /*OPPOSITE CORNERS*/
    //     this.board=[
    //         'O','','',
    //         '','','',
    //         '','',''
    //     ];
    //     console.log('Opposite Corners: ' + (this.indexOppositeEnemyCorner()===8).toString());
    //     this.board=[
    //         '','','O',
    //         '','','',
    //         '','',''
    //     ];
    //     console.log('Opposite Corners: ' + (this.indexOppositeEnemyCorner()===6).toString());
    //     this.board=[
    //         '','','',
    //         '','','',
    //         '','','O'
    //     ];
    //     console.log('Opposite Corners: ' + (this.indexOppositeEnemyCorner()===0).toString());
    //     this.board=[
    //         '','','',
    //         '','','',
    //         'O','',''
    //     ];
    //     console.log('Opposite Corners: ' + (this.indexOppositeEnemyCorner()===2).toString());
    //
    //     /*EMPTY CORNER*/
    //     this.board=[
    //         '','','O',
    //         '','','',
    //         'O','','O'
    //     ];
    //     console.log('Opposite Corners: ' + (this.indexEmptyCorner()===0).toString());
    //     this.board=[
    //         'O','','',
    //         '','','',
    //         'O','','O'
    //     ];
    //     console.log('Opposite Corners: ' + (this.indexEmptyCorner()===2).toString());
    //     this.board=[
    //         'O','','O',
    //         '','','',
    //         'O','',''
    //     ];
    //     console.log('Opposite Corners: ' + (this.indexEmptyCorner()===8).toString());
    //     this.board=[
    //         'O','','O',
    //         '','','',
    //         '','','O'
    //     ];
    //     console.log('Opposite Corners: ' + (this.indexEmptyCorner()===6).toString());
    //
    //
    //
    //     /*EMPTY SIDES*/
    //     this.board=[
    //         '','','',
    //         'O','','O',
    //         '','O',''
    //     ];
    //     console.log('Opposite Corners: ' + (this.indexEmptySides()===1).toString());
    //     this.board=[
    //         '','O','',
    //         'O','','',
    //         '','O',''
    //     ];
    //     console.log('Opposite Corners: ' + (this.indexEmptySides()===5).toString());
    //     this.board=[
    //         '','O','',
    //         'O','','O',
    //         '','',''
    //     ];
    //     console.log('Opposite Corners: ' + (this.indexEmptySides()===7).toString());
    //     this.board=[
    //         '','O','',
    //         '','','O',
    //         '','O',''
    //     ];
    //     console.log('Opposite Corners: ' + (this.indexEmptySides()===3).toString());
    //
    //     //reset back to original
    //     this.board = ['', '', '', '', '', '', '', '', ''];
    //     this.computerShape=cs;
    //     this.playerShape=ps;
    // }

}


