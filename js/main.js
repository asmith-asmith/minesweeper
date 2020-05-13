/*----- constants -----*/
let lookup = {
    clicked: {
        '-1': "*",
        0: 'white', //rgba(22,26,32)
    },
    unclicked: 'grey' //rgba(49,29,35)
};
/*----- app's state (variables) -----*/
let board;
let boardStatus;
let randomIdx = [];
let status;
let g = 0;
var myVar;
/*----- cached element references -----*/
const markerEls = Array.from(document.querySelectorAll('#board> div'));

const msgEl = document.getElementById('msg');

const timerEl = document.getElementById('timer');
/*----- event listeners -----*/
// document.getElementById('board').addEventListener('click', playGame);
// document.getElementById('board').addEventListener('contextmenu', placeFlag);
document.getElementById('reset').addEventListener('click', init);
/*----- functions -----*/
// oficially first click cant be a bomb
//On first click init or before?

init();

function init(){
    board = [];
    board = [
        [0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0]
    ];
    boardStatus = [
        [false,false,false,false,false,false,false,false,false],
        [false,false,false,false,false,false,false,false,false],
        [false,false,false,false,false,false,false,false,false],
        [false,false,false,false,false,false,false,false,false],
        [false,false,false,false,false,false,false,false,false],
        [false,false,false,false,false,false,false,false,false],
        [false,false,false,false,false,false,false,false,false],
        [false,false,false,false,false,false,false,false,false],
        [false,false,false,false,false,false,false,false,false]
    ];
    myVar = setInterval(myTimer, 1000);
    document.getElementById('board').addEventListener('click', playGame);
    document.getElementById('board').addEventListener('contextmenu', placeFlag);
    g = 0;
    
    // Getting my mines
    // First get 10 sets of random __ indices
    for(let i = 0; i < 10; i++) {
        let newMine = [getRandomArbitrary(0,8), getRandomArbitrary(0,8)]
        while(randomIdx.some(mine => mine[0]  === newMine[0] && mine[1] === newMine[1])) {
          newMine = [getRandomArbitrary(0,8), getRandomArbitrary(0,8)]
        }
       randomIdx.push(newMine);
    };
    randomIdx.forEach(function(pair){
        board[pair[0]][pair[1]] = -1;
        boardStatus[pair[0]][pair[1]] = true;
        checkEight(pair[0],pair[1]);
    });
    console.log(board);
    status = true;
    render();
};
// This function updates the indices surrounding the bombs with the number of bombs it is touching
// It does this by upadating the 0 + 1 for each bomb it touchess
function checkEight(i,j){
    // array of all surrounding indices of bomb
    let eightArray = [];
    eightArray = getEight(i,j);

    // array of all real surrounding indices of bomb
    let realArray = []
    realArray = boundsCheck(eightArray);
    
    realArray.forEach(function(cell){
        if(board[cell[0]][cell[1]] !== -1){
            board[cell[0]][cell[1]] +=1;
        }
    });
};


// This function serves to create an array of 8 indices surrounding a cell
// It includes out of bounds indices
function getEight(i,j){
    let eightArray = [];
    eightArray.push([i-1,j-1]);
    eightArray.push([i-1,j]);
    eightArray.push([i-1,j+1]);
    eightArray.push([i,j-1]);
    eightArray.push([i,j+1]);
    eightArray.push([i+1,j-1]);
    eightArray.push([i+1,j]);
    eightArray.push([i+1,j+1]);
    return eightArray;
};

// Renders a fresh board with all grey elements 
function render(){
    renderBoard();
    msgEl.innerHTML = "Caution!";
};

function renderBoard(){
    board.forEach(function(e,colIdx){
        e.forEach(function(cell,rowIdx){
            let div = document.getElementById(`c${colIdx}r${rowIdx}`)
            div.style.backgroundColor = lookup.unclicked;
            div.innerHTML = ""
        });
    });
}


// click event listner
function playGame(evt){
    let cell = evt.target.id;
    let div = document.getElementById(cell)
    let colIdx = parseInt(cell[1]);
    let rowIdx = parseInt(cell[3]);
    boardStatus[colIdx][rowIdx] = true;
    if(board[colIdx][rowIdx] === -1){
        div.innerHTML = lookup.clicked["-1"];
        document.getElementById('board').removeEventListener('click', playGame);
        document.getElementById('board').removeEventListener('contextmenu', placeFlag);
        myStopFunction();
    } else {
        recursiveFill(colIdx,rowIdx)
    }
    checkWin(board[colIdx][rowIdx]);
    
};

function checkWin(chosen){
    if(isAllClicked()){
        msgEl.innerHTML = "YOU SURVIVED FOR NOW";
        document.getElementById('board').removeEventListener('click', playGame);
        document.getElementById('board').removeEventListener('contextmenu', placeFlag);
        myStopFunction();
    } else{
        if(chosen === -1){
            msgEl.innerHTML = "YOU DEAD";
            // init();
        } else if(chosen > 0){
            msgEl.innerHTML = "Close Call";
        } else{
            msgEl.innerHTML = "CLEARED SPACE";
        }
    };
};

function isAllClicked(){
    let truth = boardStatus.every(function (e) {
        return e.every(function(r){
            return r === true;
        })
    })
    return truth;
};

function recursiveFill(i,j){
    let div = document.getElementById(`c${i}r${j}`)
    if(board[i][j] !== 0){
        div.innerHTML = board[i][j];
        div.style.backgroundColor = lookup.clicked["0"];
        boardStatus[i][j] = true;
        return;
    } else {
        div.style.backgroundColor = lookup.clicked["0"];
        let allEight = getEight(i,j);
        let boundArray = boundsCheck(allEight);
        let boundMinusClicked = getUnclicked(boundArray);

        for(let i = 0; i < boundMinusClicked.length; i++){
            let cell = boundMinusClicked[i];
            let div1 = document.getElementById(`c${cell[0]}r${cell[1]}`)
            if(board[cell[0]][cell[1]] === 0){
                div1.style.backgroundColor = lookup.clicked["0"];
                boardStatus[cell[0]][cell[1]] = true;
                recursiveFill(cell[0],cell[1]);
            } else if(board[cell[0]][cell[1]] !== 0){
                div1.innerHTML = board[cell[0]][cell[1]];
                div1.style.backgroundColor = lookup.clicked["0"];
                boardStatus[cell[0]][cell[1]] = true;
            }
        };
        return;
    }
};

function getRandomArbitrary(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
};

function getUnclicked(allEight){
    let goodArray = [];
    allEight.forEach(function(pair){
        if(boardStatus[pair[0]][pair[1]] === false){
            goodArray.push(pair)
        }
    });
    return goodArray;
}

function boundsCheck(eightArray){
    let goodArray = [];
    eightArray.forEach(function(pair){
        if(pair[0] >= 0 && pair[0] <= 8 && pair[1] >= 0 && pair[1] <= 8){
            goodArray.push(pair)
        }
    });
    return goodArray;
};


// HOW DO I UNFLAG IF I RIGHT CLICK AGAIN 
// HOW DO I REMOVE CONTEXT MENU
function placeFlag(evt){
    let cell = evt.target.id;
    let div = document.getElementById(cell)
    div.style.background = "repeating-linear-gradient(45deg, rgba(22,26,32), rgba(22,26,32) 10px, rgba(38,34,40) 10px, rgba(38,34,40) 20px)";
}


function myTimer() {
    document.getElementById("clock").innerHTML = g;
    g++;
}

function myStopFunction() {
    clearInterval(myVar);
}