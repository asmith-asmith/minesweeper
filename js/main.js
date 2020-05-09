/*----- constants -----*/
let lookup = {
    '-1': 'red',
    null: 'grey',
    1: 'green'
};

/*----- app's state (variables) -----*/
let board;
let randomIdx = [];
let status;


/*----- cached element references -----*/
const markerEls = Array.from(document.querySelectorAll('#board> div'));

const msgEl = document.getElementById('msg');

const timerEl = document.getElementById('timer');

/*----- event listeners -----*/
document.getElementById('board').addEventListener('click', playGame)

document.getElementById('reset').addEventListener('click', init);

/*----- functions -----*/


// oficially first click cant be a bomb
//On first click init or before?

init();

function init(){
    board = [
        [null,null,null,null,null,null],
        [null,null,null,null,null,null],
        [null,null,null,null,null,null],
        [null,null,null,null,null,null],
        [null,null,null,null,null,null],
        [null,null,null,null,null,null]
    ];
    
    for(let i =0; i < 6; i++) {
        let newMine = [getRandomArbitrary(0,5), getRandomArbitrary(0,5)]
        while(randomIdx.some(mine => mine[0]  === newMine[0] && mine[1] === newMine[1])) {
          console.log("do we ever hit here?")
          newMine = [getRandomArbitrary(0,5), getRandomArbitrary(0,5)]
        }
       randomIdx.push(newMine)
    };
    for(let i = 0; i < 5; i++){
        board[randomIdx[i][0]][randomIdx[i][1]] = -1;
    };

    console.log(board);
    render();
};

function checkEight(){
    //console log all surrounging 8 indexes
    //when working run logic on it
    


};

function render(){
    renderBoard();
    // renderMessage();
}

function renderBoard(){
    board.forEach(function(e){
        e.forEach(function(cell){
            
        });
    });
}


// click event listner
function playGame (){

}


function getRandomArbitrary(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
};


// for(let i = 0; i < 12; i++){
//     randomIdx.push(getRandomArbitrary(0,5))
// };
// for(let i = 0, j = 11; i < 5; i++, j--){
//     board[randomIdx[i]][randomIdx[j]] = -1;
//   };
// console.log(board)