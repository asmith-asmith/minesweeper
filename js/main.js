/*----- constants -----*/
let lookup = {
    clicked: {
        '-1': "*",
        0: 'white', //rgba(22,26,32)

    },
    unclicked: 'grey', //rgba(49,29,35)
    flagged: 'green'
};

/*----- app's state (variables) -----*/
let board;
let randomIdx = [];
let status;
let g = 0;


/*----- cached element references -----*/
const markerEls = Array.from(document.querySelectorAll('#board> div'));

const msgEl = document.getElementById('msg');

const timerEl = document.getElementById('timer');

/*----- event listeners -----*/
document.getElementById('board').addEventListener('click', playGame);
document.getElementById('board').addEventListener('contextmenu', placeFlag);


document.getElementById('reset').addEventListener('click', init);



/*----- functions -----*/


// oficially first click cant be a bomb
//On first click init or before?

init();

function init(){
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
    let boardStatus = [
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

    g = 0;
    
    // Getting my mines
    // First get 10 sets of random __ indices
    for(let i = 0; i < 10; i++) {
        let newMine = [getRandomArbitrary(0,8), getRandomArbitrary(0,8)]
        while(randomIdx.some(mine => mine[0]  === newMine[0] && mine[1] === newMine[1])) {
        //console.log("do we ever hit here?")
          newMine = [getRandomArbitrary(0,8), getRandomArbitrary(0,8)]
        }
       randomIdx.push(newMine);
    };

    // console.log(randomIdx, "<------This is in init this is array randomIdx")
    randomIdx.forEach(function(pair){
        board[pair[0]][pair[1]] = -1;
        // console.log(pair[0],pair[1], "<---- The current cell index updating to bomb")
        checkEight(pair[0],pair[1]);
    });

    status = true;
    // console.log(board);
    render();
};


// This function updates the indices surrounding the bombs with the number of bombs it is touching
// It does this by upadating the 0 + 1 for each bomb it touchess
function checkEight(i,j){
    // array of all surrounding indices of bomb
    // console.log(i,j, "<-----  Should be the same: The current cell index updating to bomb")
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
    console.log(board, "<---- Now the board looks like this")
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
function playGame (evt){
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
    
}

function checkWin(chosen){
    if(){
        msgEl.innerHTML = "YOU SURVIVED"<br>"FOR NOW";
    } else{
        if(chosen === -1){
            msgEl.innerHTML = "YOU DEAD";
            // init();
        } else if(chosen > 0){
            msgEl.innerHTML = "Close Call";
        } else{
            msgEl.innerHTML = "CLEARED SPACE";
        }
    }
}


function recursiveFill(i,j){
    if(board[colIdx][rowIdx] !== 0){
        div.innerHTML = board[colIdx][rowIdx];
        div.style.backgroundColor = lookup.clicked["0"];
        return;
    } else {
        div.style.backgroundColor = lookup.clicked["0"];
        console.log('Hitting recursiveFill ', i,j)
        let allEight = getEight(i,j);
        let boundArray = boundsCheck(allEight);

        for(let i = 0; i < boundArray.length; i++){
            let cell = boundArray[i];
            let div1 = document.getElementById(`c${cell[0]}r${cell[1]}`)
            debugger;
            if(board[cell[0]][cell[1]] === 0){
                div1.style.backgroundColor = lookup.clicked["0"];
                console.log(cell[0],cell[1]);
                console.log(cell);
                recursiveFill(cell[0],cell[1]);
            } else {
                console.log("hitting else in recursive",cell[0],cell[1])
                div1.innerHTML = board[cell[0]][cell[1]];
                div1.style.backgroundColor = lookup.clicked["0"];
            }
        };
};

function getRandomArbitrary(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
};

function boundsCheck(eightArray){
    // console.log(eightArray, "<---- Should be the same: Array of the surrounding indices")
    let goodArray = [];
    eightArray.forEach(function(pair){
        console.log(pair);
        if(pair[0] >= 0 && pair[0] <= 8 && pair[1] >= 0 && pair[1] <= 8){
            goodArray.push(pair)
            // console.log(pair, "<---- This pair passed the test")
        }
    });
    // console.log(goodArray, "<--- Array of all indexes surrounding bomb that passed the test")
    return goodArray;
};


// HOW DO I UNFLAG IF I RIGHT CLICK AGAIN 
// HOW DO I REMOVE CONTEXT MENU
function placeFlag(evt){
    let cell = evt.target.id;
    let div = document.getElementById(cell)
    div.style.background = "repeating-linear-gradient(45deg, rgba(22,26,32), rgba(22,26,32) 10px, rgba(38,34,40) 10px, rgba(38,34,40) 20px)";
}

// var myVar = setInterval(myTimer, 1000);

// function myTimer() {
//     document.getElementById("clock").innerHTML = g;
//     g++;
// }

function myStopFunction() {
    clearInterval(myVar);
  }