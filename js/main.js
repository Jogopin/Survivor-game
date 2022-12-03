class ELementOnBoard {
  constructor(width, height, steps) {
    this.boarWidth = 800; // this value should come from the class Game when create it
    this.boardHeight = 600; // this value should come from the class Game when create it
    this.className = null;
    this.width = width;
    this.height = height;
    this.steps = steps; //amount of steps it moves per interval

    this.units = `px`;

    //initial point of the element  X=coordXY[0] Y=coordXY[1] on the board
    this.coordXY = [null, null];

    this.domElem = null;
    this.createElement(this.className);
  }
  createElement(className) {
    //create the element
    this.domElem = document.createElement(`div`);
    //add properties
    this.domElem.className = className;
    //size
    this.domElem.style.width = this.width + this.units;
    this.domElem.style.height = this.height + this.units;
    //initial position
    this.domElem.style.position = `absolute`;
    this.domElem.style.left = this.coordXY[0] + this.units;
    this.domElem.style.bottom = this.coordXY[1] + this.units;

    //create the element in the HTML
    const boardElem = document.getElementById(`board`);
    boardElem.appendChild(this.domElem);
  }
  changeCoordinates(coordinatesXY) {
    this.domElem.style.left = coordinatesXY[0] + this.units;
    this.domElem.style.bottom = coordinatesXY[1] + this.units;
  }
  move(direction) {

    switch (direction) {

      case `left`:

        if (this.coordXY[0] <= 0) {// dont allow the movement out of the board
          this.coordXY[0] = 0;
          this.domElem.style.left = "0" + this.units;
        } else {
          this.coordXY[0] -= this.steps;
          this.domElem.style.left = this.coordXY[0] + this.units;
        }

        break;

      case `right`:

        if (this.coordXY[0] >= this.boarWidth-this.width) { // dont allow the movement out of the board
          this.coordXY[0] = this.boarWidth-this.width;
        } else {
          this.coordXY[0] += this.steps;

          this.domElem.style.left = this.coordXY[0] + this.units;
        }
        break;

      case `down`:
        if (this.coordXY[1] <= 0) {// dont allow the movement out of the board
          this.coordXY[1] = 0;
          this.domElem.style.bottom = `0` + this.units;
        } else {
          this.coordXY[1] -= this.steps;
          this.domElem.style.bottom = this.coordXY[1] + this.units;
        }

        break;

      case `up`:
        if (this.coordXY[1] >= this.boardHeight-this.height) {// dont allow the movement out of the board
          this.coordXY[1] = this.boardHeight-this.height;
        } else {
          this.coordXY[1] += this.steps;
          this.domElem.style.bottom = this.coordXY[1] + this.units;
        }

        break;
    }
  }
  
}

class Player extends ELementOnBoard{
    constructor(width,height,steps){
        super(width,height,steps)
        
        
        this.coordXY[0] = (this.boarWidth/2)-this.width/2;
        this.coordXY[1] = (this.boardHeight/2)-this.height/2;
        

        this.domElem.className=`player`
        

    
        this.pressedKeyArray=[false,false,false,false]//  [ArrowUP,ArrowRight,ArrowDown,ArrowLeft]
        //note: when 2 keys are pressed both values in the array are true 
        
        this.changeCoordinates(this.coordXY)
        
    } 
}

class Zombie extends ELementOnBoard{
    constructor(width,height,steps){
        
        super(width,height,steps) 
        this.domElem.className=`zombie`


        
        this.changeCoordinates(this.randomPosition())
        
    }
    randomPosition(){
        let posibility=Math.floor(Math.random()*4) // 4==> one per each border
        
        // note: the board is 800 width 600 height
        switch(posibility){
            case 0:
                this.coordXY[0]=Math.random()*(800-this.width)
                this.coordXY[1]=0
                break;
            case 1:
                this.coordXY[0]=Math.random()*(800-this.width)
                this.coordXY[1]=(600-this.height) // width 
                break;
            case 2:
                this.coordXY[0]=0
                this.coordXY[1]=Math.random()*(600-this.height)
                break;
            case 3:
                this.coordXY[0]=800-this.width
                this.coordXY[1]=Math.random()*(600-this.height)
                break;
        }
        return this.coordXY

    }
    move(){
        //the hypotenuse is the absolute distance between the player and the zombie 
        let hypotenuse=Math.sqrt((player.coordXY[0]-this.coordXY[0])**2+(player.coordXY[1]-this.coordXY[1])**2)
        // the distance in the X-axis between the zombie and the player is D(x)=hypotenuse*cos(angle)
        // the distance in the Y-axis between the zombie and the player is D(y)=hypotenuse*sen(angle)

        // cosAng and senAng are the cosine and sine of the angle formed by the hypotenuse and x-axis
        let cosAng=(player.coordXY[0]-this.coordXY[0])/hypotenuse
        let senAng=(player.coordXY[1]-this.coordXY[1])/hypotenuse


        // the function of a straight line is X=a*t+Xo and Y=b*t+Yo where a=Vx, b=Vy, Xo= this.coordXY[0] and Yo=this.coordXY[1] (initial position)
        // the  derivative of the functions are Vx=a and Vy=b 
        // the velocity towards the player (V(t)) is constant, Vx=V(t)cos(angle) and Vy=V(t)sen(angle)

        // Vt=this.steps  and we are calculating for every interval--> t=1 

        //X=a*t+Xo and Y=b*t+Yo
        this.coordXY[0]=this.steps*cosAng+this.coordXY[0]
        this.coordXY[1]=+this.steps*senAng+this.coordXY[1]
        this.changeCoordinates(this.coordXY)
    }
    collitionDetector(elem1,elem2){
        elem1.coordXY
        elem2.coordXY
        
        if (
            elem1.coordXY[0] < elem2.coordXY[0] + elem2.width &&
            elem1.coordXY[0] + elem1.width > elem2.coordXY[0] &&
            elem1.coordXY[1] < elem2.coordXY[1] + elem2.height &&
            elem1.height + elem1.coordXY[1] > elem2.coordXY[1]
          ) {
            
            console.log("Collition detected!!!!");
          } 
      }
}




const player = new Player(20,20,4)
const zombies = []



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



let timeInSeconds = 0 //total time in seconds
const fps=50 // frames per second, note when 60fps, a warning appears
let intervalCounter=0
const intervalDelay= 1000/fps


//globalInterval, it sets the framerate at which everything moves

const globalInterval = setInterval(() => {

  intervalCounter++;

  //calculates total of Seconds passed
  if (intervalCounter % fps === 0) {
    timeInSeconds++;
    console.log(timeInSeconds, `s`);
  }
  //player movement depending of player.pressedKeyArray
  if (player.pressedKeyArray[0]) player.move(`up`);
  if (player.pressedKeyArray[1]) player.move(`right`);
  if (player.pressedKeyArray[2]) player.move(`down`);
  if (player.pressedKeyArray[3]) player.move(`left`);

  //zombies every 4 sec 
  if (intervalCounter % (4*fps) === 0) {
    zombies.push(new Zombie(30, 30, 2));
    console.log("zombie created")
  }
  if (intervalCounter%3===0){
    zombies.forEach((zombie)=>{
    zombie.move()
    zombie.collitionDetector(player,zombie)
    })
  }

  
}, intervalDelay);

