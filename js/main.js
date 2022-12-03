class Player{
    constructor(){
       
        this.width = 30;
        this.height = 30;
        this.units = `px`

        //initial point of the element  pointX pointY on the board

        this.pointX = 400-this.width/2;//from 0 to 800 left--->rigth
        this.pointY = 300-this.height/2;//from 0 to 600 bottom--->top
        
        this.steps = 4 //amount of steps it moves per interval
        
        this.playerElem = null;

        this.pressedKeyArray=[false,false,false,false]//  [ArrowUP,ArrowRight,ArrowDown,ArrowLeft]
        //note: when 2 keys are pressed both values in the array are true 
        
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
           case `left`:
               this.pointX-=this.steps
               this.playerElem.style.left=this.pointX+this.units
              
               break;
           case `right`:
               this.pointX+=this.steps
               this.playerElem.style.left=this.pointX+this.units
               
               break;
           case `down`:
               this.pointY-=this.steps
               this.playerElem.style.bottom=this.pointY+this.units
               
               break;
           case `up`:
               this.pointY+=this.steps
               this.playerElem.style.bottom=this.pointY+this.units
              
               break;
    
    
       
    }
}
}


const player = new Player




// **********************************************eventlistener

//change  the elements inside player.pressedKeyArray when we press one Arrow Key 
document.addEventListener(`keydown`, (e) => {
    //console.log(e.key) // if I keep pressed one key and  press another one, it will console log the second one
    if(e.key===`ArrowUp`){
        player.pressedKeyArray[0]=true
        
    }else if(e.key===`ArrowRight`){
        player.pressedKeyArray[1]=true
    }else if(e.key===`ArrowDown`){
        player.pressedKeyArray[2]=true
    }else if(e.key===`ArrowLeft`){
        player.pressedKeyArray[3]=true
    }
});

// only when we stop pressing the key, it will change to false  the element in player.pressedKeyArray
document.addEventListener(`keyup`, (e) => {
    
    if(e.key===`ArrowUp`){
        player.pressedKeyArray[0]=false
        //console.log(player.pressedKeyArray) 
    }else if(e.code===`ArrowRight`){
       // console.log(player.pressedKeyArray)
        player.pressedKeyArray[1]=false
    }else if(e.code===`ArrowDown`){
        player.pressedKeyArray[2]=false
    }else if(e.code===`ArrowLeft`){
        player.pressedKeyArray[3]=false
    }
});

//**************************************************** */

let millisecond=0 //Game time
let seconds = 0
let fps=60 // frames per second

//globalInterval, it sets the framerate at which everything moves
const globalInterval = setInterval(()=>{
    
    if(millisecond%fps===0) seconds ++ 
    //player movement depending of player.pressedKeyArray
    if(player.pressedKeyArray[0]) player.move(`up`)
    if(player.pressedKeyArray[1]) player.move(`right`)
    if(player.pressedKeyArray[2]) player.move(`down`)
    if(player.pressedKeyArray[3]) player.move(`left`)
    
    
},1000/fps)
