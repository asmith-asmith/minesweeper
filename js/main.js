/*----- constants -----*/
let lookup = {
    clicked: {
        '-1': "*",
        0: 'rgba(22,26,32)',

    },
    unclicked: 'rgba(49,29,35)',
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
    g = 0;
    
    for(let i = 0; i < 10; i++) {
        let newMine = [getRandomArbitrary(0,8), getRandomArbitrary(0,8)]
        while(randomIdx.some(mine => mine[0]  === newMine[0] && mine[1] === newMine[1])) {
        //   console.log("do we ever hit here?")
          newMine = [getRandomArbitrary(0,8), getRandomArbitrary(0,8)]
        }
       randomIdx.push(newMine);
    };

    // console.log(randomIdx, "<------This is in init this is array randomIdx")
    randomIdx.forEach(function(pair){
        board[pair[0]][pair[1]] = -1;
        // console.log(pair[0],pair[1], "<---- The current cell index updating to bomb")
        checkEight(pair[0],pair[1]);
    })
    status = true;
    // console.log(board);
    render();
};

function checkEight(i,j){
    //console log all surrounding 8 indexes
    //when working run logic on it
    // array of all surrounding indices of bomb
    // console.log(i,j, "<-----  Should be the same: The current cell index updating to bomb")
    let eightArray = [];
    eightArray.push([i-1,j-1]);
    eightArray.push([i-1,j]);
    eightArray.push([i-1,j+1]);
    eightArray.push([i,j-1]);
    eightArray.push([i,j+1]);
    eightArray.push([i+1,j-1]);
    eightArray.push([i+1,j]);
    eightArray.push([i+1,j+1]);
    // console.log(eightArray, '<----- Array of the surrounding indices')
    // will be array of all bounds checked indices of cells surrounding bomb
    let realArray = []
    realArray = boundsCheck(eightArray);
    // console.log(realArray)
    realArray.forEach(function(cell){
        if(board[cell[0]][cell[1]] !== -1){
            board[cell[0]][cell[1]] +=1;
        }
    });
    // console.log(board, "<---- Now the board looks like this")

};

function render(){
    renderBoard();
    // renderMessage();
}

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
    if(board[colIdx][rowIdx] === -1){
        div.innerHTML = lookup.clicked["-1"];
    } else if(board[colIdx][rowIdx] === 0){
        div.style.backgroundColor = lookup.clicked["0"];
    } else {
        div.innerHTML = board[colIdx][rowIdx];
    }
    console.log(board[colIdx][rowIdx])
    checkWin(board[colIdx][rowIdx]);
    
}

function checkWin(chosen){
    if(chosen === -1){
        msgEl.innerHTML = "YOU DEAD";
        init();
    } else if(chosen > 0){
        msgEl.innerHTML = "Close Call";
    } else{
        msgEl.innerHTML = "CLEARED SPACE";
    }
}
function getRandomArbitrary(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
};

function placeFlag(evt){
    let cell = evt.target.id;
    let div = document.getElementById(cell)
    div.style.background = "repeating-linear-gradient(45deg, rgba(22,26,32), rgba(22,26,32) 10px, rgba(38,34,40) 10px, rgba(38,34,40) 20px)";
}

function boundsCheck(eightArray){
    // console.log(eightArray, "<---- Should be the same: Array of the surrounding indices")
    let goodArray = [];
    eightArray.forEach(function(pair){
        if(pair[0] >= 0 && pair[0] <= 8 && pair[1] >= 0 && pair[1] <= 8){
            goodArray.push(pair)
            // console.log(pair, "<---- This pair passed the test")
        }
    });
    // console.log(goodArray, "<--- Array of all indexes surrounding bomb that passed the test")
    return goodArray;
};

var myVar = setInterval(myTimer, 1000);

function myTimer() {
    document.getElementById("clock").innerHTML = g;
    g++;
}




// let goodArray = [];
//     sArray.forEach(function(pair){
//         if(pair[0]-1>=0&&pair[0]+1<=)
//     });

// for(let i = 0; i < 12; i++){
//     randomIdx.push(getRandomArbitrary(0,5))
// };
// for(let i = 0, j = 11; i < 5; i++, j--){
//     board[randomIdx[i]][randomIdx[j]] = -1;
//   };
// console.log(board)

// board[i-1][j-1] +=1;
// (board[i-1][j]) +=1;
// (board[i-1][j+1]) +=1;
// (board[i][j-1]) +=1;
// (board[i][j+1]) +=1;
// (board[i+1][j-1]) +=1;
// (board[i+1][j]) +=1;
// (board[i+1][j+1]) +=1;


// for(let i = 0; i < 5; i++){
//     board[randomIdx[i][0]][randomIdx[i][1]] = -1;
//     console.log((randomIdx[i][0]),([randomIdx[i][1]]), "This is in the loop that is updating board woth these random indices")
//     checkEight((randomIdx[i][0]),([randomIdx[i][1]]));
// };