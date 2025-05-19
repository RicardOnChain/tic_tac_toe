function Gameboard () {

    const squareSide = 3
    const board = []
    
    for (let row=0; row<squareSide; row++){                         // create board based on squareSide size
        board[row]=[]
        for (let column=0; column<squareSide; column++){
            board[row].push("")                                 
        }
    }
    
    const getBoard = () => board                                    //allows function to return the board state without exposing the variable to external mutation
    

    return {getBoard}
}




function Player (){

    const players = []

    const dashboardDiv = document.querySelector(".dashboard")

    const PlayersConstructor = function(name,token){                   //creates new players
        this.name = name;
        this.token = token
        this.add = () => players.push(this)
        this.setActivePlayer = () => activePlayer = this
    }
    
    
    let activePlayer = null
    
    const getPlayers = () => players
    
    const getActivePlayer = () => activePlayer
    
    const switchTurn = () => {
        
        activePlayer = activePlayer === players[0] ? players[1] : players[0]
        dashboardDiv.innerText= `It's ${activePlayer.name} turn now`
        
    }
    
    
    return {getActivePlayer, getPlayers, switchTurn, dashboardDiv, PlayersConstructor}
    
}


function Flow() {
    
    const board = Gameboard()                               //Initialize objects
    const player = Player()                                 //Initialize objects
    
    let turns = 1
    
    let winner = ""
    
    const createPlayers = (e) => {
        const formData = new FormData(e.target)
        
        const playerAObject = new player.PlayersConstructor(formData.get("playerAName"), "X")       //invoke player object constructor
        const playerBObject = new player.PlayersConstructor(formData.get("playerBName"), "O")
        
        playerAObject.add()  //use object custom method to add to player array.
        playerAObject.setActivePlayer()
        playerBObject.add()
    }

    const dropToken = (row, column) => {
        
        if (board.getBoard()[row][column] != "") {                        //aborts play token in case cell has been already played
            return (console.log("You can't play on that row"))
        }
        
        else{
            board.getBoard()[row][column] = player.getActivePlayer().token 
            
        }
    }       

    const checkEndGame = () =>{
        
        let winnerCombos= [                                   //All possible winning combos converted to 3 element arrays
            
            {
                name:"topRow",
                array: board.getBoard()[0]
            },
            {
                name:"midRow",
                array: board.getBoard()[1]
            },
            {
                name:"botRow",
                array: board.getBoard()[2]
            },
            {
                name:"leftCol",
                array: [board.getBoard()[0][0],board.getBoard()[1][0], board.getBoard()[2][0]]
            },
            {
                name:"midCol",
                array: [board.getBoard()[0][1],board.getBoard()[1][1], board.getBoard()[2][1]]
            },
            {
                name:"rightCol",
                array: [board.getBoard()[0][2],board.getBoard()[1][2], board.getBoard()[2][2]]
            },
            {
                name:"descendingDiag",
                array: [board.getBoard()[0][0],board.getBoard()[1][1], board.getBoard()[2][2]]
            },
            {
                name:"ascendingDiag",
                array: [board.getBoard()[2][0],board.getBoard()[1][1], board.getBoard()[0][2]]
            },
        ]
        
        
        for (const combo of winnerCombos){                                                   
            
            if (!combo.array.includes("")){                                                                                                     //check if there are empty cells in winnerCombo array
                if (!(combo.array.includes(player.getPlayers()[0].token) && combo.array.includes(player.getPlayers()[1].token))){                 // a winner Row only has 1 token type
                    winner = player.getActivePlayer().name                                                                                      // since we run checkEndGame() after every placedToken, the last player who placed a token is the winner when a winner row is generated
                    player.dashboardDiv.innerText=`Player ${winner} has won the game` 
                    return(winner)
                }
            }        
        }
        
        turns+=1
        if (turns == 9 && winner == "") {player.dashboardDiv.innerText="It's a tie, play again" }                                                     //it's a tie when 9 turns have been played and the winner variable is still empty.
        
        player.switchTurn()
        
        
    }
    
    
    return{winner, dropToken, board, player, checkEndGame, createPlayers}
}




function Interface(){
    
    const game = Flow()                                     //Init Flow object wich initiates all objects
    
    const boardDiv = document.querySelector(".gameboard")
    const form = document.querySelector("form")

    const render = () => {
        
        boardDiv.textContent=""                                                 //clear the board for new rendering
        
        game.board.getBoard().forEach((array, rowIndex) =>{
            array.forEach((value, colIndex) =>{
                
                const cellButton = document.createElement("button")             //display previously placed tokens
                cellButton.innerText = value
                cellButton.dataset.column = colIndex
                cellButton.dataset.row = rowIndex
                cellButton.classList.add("cell")  
                boardDiv.appendChild(cellButton)
            })    
        })
    }
    
    const cellClickHandler = (e) => {                                       //handles the cell click to board update in the backend association  
        const row =parseInt(e.target.dataset.row)
        const col =parseInt(e.target.dataset.column)
        game.dropToken(row,col)
        render()
        game.checkEndGame()


    }
        
    const firstRender= () => {                                              //renders the dashboard start game msgs, player names, restart button & the gameboard 
        
        const playerAname= game.player.getPlayers()[0].name   
        const playerBname= game.player.getPlayers()[1].name   
        const restartButton = document.createElement("button")
        const main = document.querySelector(".main")
        
        document.querySelector("#playerAName").innerText= playerAname      
        document.querySelector("#playerBName").innerText= playerBname       
        
        document.querySelector(".dashboard").innerText= `${playerAname}, make a moove!`
        
        restartButton.innerText = "Restart"                                                  //creates restart button
        restartButton.classList.add("restartButton")

        restartButton.addEventListener("click", () => location.reload())

        main.appendChild(restartButton)

        render()                                                            //render board
        
    }
    
    form.addEventListener("submit", (e)=>{                               //modal click event listener that creates 2 new Players and stores in player array
        e.preventDefault()
        game.createPlayers(e)
        firstRender()
        document.querySelector("dialog").close() 

    })

    document.querySelector("dialog").showModal()              //Initialize staring menu
    
    boardDiv.addEventListener("click" , cellClickHandler)
}

Interface()
