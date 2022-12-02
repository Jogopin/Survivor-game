class Player{
    constructor(){
       
        this.width = 25;
        this.height = 25;
        this.units = `px`
        // pointX pointY in the board
        this.pointX = 400-this.width/2;//from 0 to 800 left--->rigth
        this.pointY = 300-this.height/2;//from 0 to 600 bottom--->top
        this.playerElem = null;
        this.createPlayer()
        
    }
    createPlayer(){
        //create the element
        this.playerElem= document.createElement(`div`);
        //add properties    
        this.playerElem.id=`player`
        //size
        this.playerElem.style.width=this.width + this.units
        this.playerElem.style.height=this.height + this.units
        //initial position
        this.playerElem.style.left=this.pointX +this.units
        this.playerElem.style.bottom= this.pointY + this.units
        

        //create the element in the HTML
        const boardElem =document.getElementById(`board`)
        boardElem.appendChild(this.playerElem)



    }

}


const player = new Player
