/*----- constants -----*/



/*----- app's state (variables) -----*/
let board;
let randomIdx;


/*----- cached element references -----*/

/*----- event listeners -----*/

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
    for(let i = 0; i < 12; i++){
        randomIdx.push(getRandomArbitrary(0,5))
    };
    console.log()
    function getRandomArbitrary(min, max) {
        return Math.random() * (max - min) + min;
    };
}

function render(){
    renderBoard();
    renderMessage();
}

function renderBoard(){
    board.forEach(function(e){
        e.forEach(function(cell){
            if(cell)
        });
    });
}


