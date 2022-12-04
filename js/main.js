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
    moveTowards(elem){
        //the hypotenuse is the absolute distance between the player and the zombie 
        let hypotenuse=Math.sqrt((elem.coordXY[0]-this.coordXY[0])**2+(elem.coordXY[1]-this.coordXY[1])**2)
        // the distance in the X-axis between the zombie and the player is D(x)=hypotenuse*cos(angle)
        // the distance in the Y-axis between the zombie and the player is D(y)=hypotenuse*sen(angle)

        // cosAng and senAng are the cosine and sine of the angle formed by the hypotenuse and x-axis
        let cosAng=(elem.coordXY[0]-this.coordXY[0])/hypotenuse
        let senAng=(elem.coordXY[1]-this.coordXY[1])/hypotenuse


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
            
           return true

          }else{

            return false
          }
      }
}

class Game {
  constructor() {
    this.boarWidth=800
    this.boardHeight=600

    this.player = null;
    this.zombies = [];

    this.timeInSeconds = 0 //total time in seconds

    this.fps = 50 // frames per second, note when 60fps, a warning appears
    this.globalInterval =null
    this.intervalDelay = 1000 / this.fps;
  }
  startGame() {


    this.player = new Player(20, 20, 4);
    this.zombies.push(new Zombie(30, 30, 2))
    this.eventListeners()

    let intervalCounter = 0;
    this.timeInSeconds = 0
    //globalInterval, it sets the framerate at which everything moves
    
    this.globalInterval = setInterval(() => {
      intervalCounter++;

      //calculates total of Seconds passed
      if (intervalCounter % this.fps === 0) {
        this.timeInSeconds++;
        console.log(this.timeInSeconds, `s`);
      }
      //player movement depending of player.pressedKeyArray
      if (this.player.pressedKeyArray[0]) this.player.move(`up`);
      if (this.player.pressedKeyArray[1]) this.player.move(`right`);
      if (this.player.pressedKeyArray[2]) this.player.move(`down`);
      if (this.player.pressedKeyArray[3]) this.player.move(`left`);


      //zombies every 4 sec
      if (intervalCounter % (4 * this.fps) === 0) {
        this.zombies.push(new Zombie(30, 30, 2));
       
      }
      //movement every 3 frames towards the player
      if (intervalCounter % 3 === 0) {
        this.zombies.forEach((zombie) => {
          zombie.moveTowards(this.player);
          if(zombie.collitionDetector(this.player, zombie)){
            game.stopGame()
          };
        });
      }
    },this.intervalDelay);

  }

  eventListeners() {
    // **********************************************eventlistener

    //change  the elements inside player.pressedKeyArray when we press one Arrow Key
    document.addEventListener(`keydown`, (e) => {
      //console.log(e.key) // if I keep pressed one key and  press another one, it will console log the second one
      if (e.key === `ArrowUp`) {
        this.player.pressedKeyArray[0] = true;
      } else if (e.key === `ArrowRight`) {
        this.player.pressedKeyArray[1] = true;
      } else if (e.key === `ArrowDown`) {
        this.player.pressedKeyArray[2] = true;
      } else if (e.key === `ArrowLeft`) {
        this.player.pressedKeyArray[3] = true;
      }
    });

    // only when we stop pressing the key, it will change to false  the element in player.pressedKeyArray
    document.addEventListener(`keyup`, (e) => {
      if (e.key === `ArrowUp`) {
        this.player.pressedKeyArray[0] = false;
        
      } else if (e.code === `ArrowRight`) {
        
        this.player.pressedKeyArray[1] = false;
      } else if (e.code === `ArrowDown`) {
        this.player.pressedKeyArray[2] = false;
      } else if (e.code === `ArrowLeft`) {
        this.player.pressedKeyArray[3] = false;
      }
    });

    //**************************************************** */
  }
  stopGame(){
    clearInterval(this.globalInterval)
    alert(` -----Game Over----
        dont let them eat you!!!!!`)


    //remove the player from the game and HTML
    this.player.domElem.remove()
  }
}  


const game =new Game()
game.startGame()












