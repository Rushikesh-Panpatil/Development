const boxes =  document.querySelectorAll(".box");
const gameinfo = document.querySelector(".game-info");
const newGameBtn = document.querySelector(".btn");

let currentPlayer;
let gameGrid;


const winingPositions = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6]
];

//let's create the function to initialise the game 

function initGame (){
    currentPlayer = "X";
    gameGrid = ["","","","","","","","",""];
    newGameBtn.classList.remove("active");
    gameinfo.innerText = `Current Player - ${currentPlayer}`;

    //ui me boxes empty
         boxes.forEach((box, index) =>{
            box.innerText = "";
               boxes[index].style.pointerEvents = "all";
    //one more thing is missing, initialise box with css properties again
         box.classList =`box box${index+1}`;

       
       });
}

initGame();

function swapTurn(){
    if(currentPlayer === "X"){
        currentPlayer = "O";
    }
    else{
        currentPlayer = "X";
    }
    //Ui update
    gameinfo.innerText = `Current Player - ${currentPlayer}`;
}


function checkGameover(){
    let answer = "";
//all boxes should be non-empty and exactly same in value
    winingPositions.forEach((position)=>{
        if((gameGrid[position[0]] !== "" || gameGrid[position[1]] !== "" || gameGrid[position[2]] !== "")
        && (gameGrid[position[0]] === gameGrid[position[1]])  && (gameGrid[position[1]] === gameGrid[position[2]])){
        

            //check if winner is x
            if(gameGrid[position[0]] === "X"){
                answer = "X";
            }
            else{
                answer ="O";

                //disable pointer event
                boxes.forEach((box) =>{
                    box.style.pointerEvents = "none";
                })
            }

            //now we know X/O is a winner
            boxes[position[0]].classList.add("win");
            boxes[position[1]].classList.add("win");
            boxes[position[2]].classList.add("win");
    }

    });
    
    //it means we have a winner
    if(answer !== ""){
      gameinfo.innerText = `Winner Player -${answer}`;
      newGameBtn.classList.add("active");
      return;
    }

    //let's checkwhen there is tie
    let fillcount =0;
    gameGrid.forEach((box) =>{
        if(box !== "")
            fillcount++;
    });

    //board is filled  ,game is tie
    if(fillcount === 9){
    gameinfo.innerText = "Game Tied !";
    newGameBtn.classList.add("active");
    }

}

function handleClick(index){
    if(gameGrid[index] === ""){
        boxes[index].innerText = currentPlayer;
        gameGrid[index] = currentPlayer;
        boxes[index].computedStyleMap.pointerEvents = "none";

        //swap turn
        swapTurn();
        //check someone is win or not 
        checkGameover();
    }
}


boxes.forEach((box, index) =>{
    box.addEventListener("click",() =>{
        handleClick(index);
    })
});


newGameBtn.addEventListener("click", initGame);
