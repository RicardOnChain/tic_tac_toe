function Gameboard () {

    const squareSide = 3
    const board = []

    for (let row=0; row<squareSide; row++){                         // create board based on squareSide size
        board[row]=[]
        for (let column=0; column<squareSide; column++){
            board[row].push(cell("start"))                                 
        }
    }

    const getBoard = () => board                                    //allows function to return the board state without exposing the variable to external mutation

    const cell = (input) => {
    
        if (input == "start"){value = ""}                           //defines the content of each cell
        else { value = this.token}
        return value    
    }

    const render = () => {

        console.log(board)
    }

    return {getBoard, render}
}




function Player (){

    const players=[
        {
            name: "A",
            token: "X"
        },
        {
            name: "B",
            token: "O"
        }
    ]

    let activePlayer = players[0]
    
    
    const getActivePlayer = () => activePlayer
    
    const switchTurn = () => {
    
        activePlayer = activePlayer === players[0] ? players[1] : players[0]
        console.log(`It's ${activePlayer.name} turn now`)
    
    }

    
    return {getActivePlayer}
    
}


function Flow() {
    
    const playToken = (row, column) => {
        
        if (Gameboard().getBoard()[row][column] != "") {                        //aborts play token in case cell has been already played
            return (console.log("You can't play on that row"))
        }
        
        else{
            Gameboard().getBoard()[row][column] = getActivePlayer().token 
            Gameboard().render()
            Flow().checkEndGame()
            switchTurn()
            
        }
        
    }

    const checkEndGame = () =>{
        
        
        
    }
    
    return{checkEndGame, playToken}

    
    
}