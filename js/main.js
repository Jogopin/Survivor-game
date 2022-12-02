class Player{
    constructor(){
       
        this.width = 30;
        this.height = 30;
        this.units = `px`

        //initial point of the element  pointX pointY on the board

        this.pointX = 400-this.width/2;//from 0 to 800 left--->rigth
        this.pointY = 300-this.height/2;//from 0 to 600 bottom--->top
        
        this.steps = 15 //amount of steps it moves per action
        
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

    move(direction){
        switch(direction){
           case `ArrowLeft`:
               this.pointX-=this.steps
               this.playerElem.style.left=this.pointX+this.units
              
               break;
           case `ArrowRight`:
               this.pointX+=this.steps
               this.playerElem.style.left=this.pointX+this.units
               
               break;
           case `ArrowDown`:
               this.pointY-=this.steps
               this.playerElem.style.bottom=this.pointY+this.units
               
               break;
           case `ArrowUp`:
               this.pointY+=this.steps
               this.playerElem.style.bottom=this.pointY+this.units
              
               break;

       
    }
}
}


const player = new Player

document.addEventListener(`keydown`, (e) => {
//   console.log(e.code, e.key);
   player.move(e.code);
 
});


