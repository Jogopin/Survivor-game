class ElementOnBoard {
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
    this.coordXY[0]=coordinatesXY[0]
    this.coordXY[1]=coordinatesXY[1]
  }
  move(direction) {
    switch (direction) {
      case `left`:
        if (this.coordXY[0] <= 0) {
          // dont allow the movement out of the board
          this.coordXY[0] = 0;
          this.domElem.style.left = "0" + this.units;
        } else {
          this.coordXY[0] -= this.steps;
          this.domElem.style.left = this.coordXY[0] + this.units;
        }

        break;

      case `right`:
        if (this.coordXY[0] >= this.boarWidth - this.width) {
          // dont allow the movement out of the board
          this.coordXY[0] = this.boarWidth - this.width;
        } else {
          this.coordXY[0] += this.steps;

          this.domElem.style.left = this.coordXY[0] + this.units;
        }
        break;

      case `down`:
        if (this.coordXY[1] <= 0) {
          // dont allow the movement out of the board
          this.coordXY[1] = 0;
          this.domElem.style.bottom = `0` + this.units;
        } else {
          this.coordXY[1] -= this.steps;
          this.domElem.style.bottom = this.coordXY[1] + this.units;
        }

        break;

      case `up`:
        if (this.coordXY[1] >= this.boardHeight - this.height) {
          // dont allow the movement out of the board
          this.coordXY[1] = this.boardHeight - this.height;
        } else {
          this.coordXY[1] += this.steps;
          this.domElem.style.bottom = this.coordXY[1] + this.units;
        }

        break;
    }
  }

}

class Player extends ElementOnBoard {

  constructor(width, height, steps) {
    super(width, height, steps);

    this.coordXY[0] = this.boarWidth / 2 - this.width / 2;
    this.coordXY[1] = this.boardHeight / 2 - this.height / 2;

    this.domElem.className = `player`;
    this.rotateFaceEventListener = null;
    this.pressedKeyArray = [false, false, false, false]; //  [ArrowUP,ArrowRight,ArrowDown,ArrowLeft]
    //note: when 2 keys are pressed both values in the array are true

    this.changeCoordinates(this.coordXY);
    this.rotateFace()

    this.gunChamber=10
    this.bulletsAvailable=0
    this.timeBetweenShoot=0.3
    this.chargingCounter=0

  }
  movesPlayer(){
    if (this.pressedKeyArray[0]) this.move(`up`);
    if (this.pressedKeyArray[1]) this.move(`right`);
    if (this.pressedKeyArray[2]) this.move(`down`);
    if (this.pressedKeyArray[3]) this.move(`left`); 
  }
  rotateFace(){
    
    this.rotateFaceEventListener =  (e) => {
      let playerBoundingRect = this.domElem.getBoundingClientRect();
      let playerCenter = {
        x: playerBoundingRect.left + playerBoundingRect.width / 2,
        y: playerBoundingRect.top + playerBoundingRect.height / 2,
      };
      let angle =
        Math.atan2(e.pageX - playerCenter.x, -(e.pageY - playerCenter.y)) *
        (180 / Math.PI);
      this.domElem.style.transform = `rotate(${angle}deg)`;
    }
    
    document.addEventListener("mousemove",this.rotateFaceEventListener);

  }
  displayGunChamber(){

  }
}

class Zombie extends ElementOnBoard {
  constructor(width, height, steps) {
    super(width, height, steps);
    this.domElem.className = `zombie`;
    this.randomFace()
    this.changeCoordinates(this.randomPosition());
  }
  randomFace(){
    let n =Math.floor(Math.random()*3 +1)
    this.domElem.style.backgroundImage=`url(./css/img/zombie${n}.png)`
    
  }
  randomPosition() {
    let posibility = Math.floor(Math.random() * 4); // 4==> one per each border

    // note: the board is 800 width 600 height
    switch (posibility) {
      case 0:
        this.coordXY[0] = Math.random() * (800 - this.width);
        this.coordXY[1] = 0;
        break;
      case 1:
        this.coordXY[0] = Math.random() * (800 - this.width);
        this.coordXY[1] = 600 - this.height; 
        break;
      case 2:
        this.coordXY[0] = 0;
        this.coordXY[1] = Math.random() * (600 - this.height);
        break;
      case 3:
        this.coordXY[0] = 800 - this.width;
        this.coordXY[1] = Math.random() * (600 - this.height);
        break;
    }
    return this.coordXY;
  }
  moveTowards(elem) {
    //the hypotenuse is the absolute distance between the player and the zombie
    let hypotenuse = Math.sqrt(
      (elem.coordXY[0] - this.coordXY[0]) ** 2 +
        (elem.coordXY[1] - this.coordXY[1]) ** 2
    );
    // the distance in the X-axis between the zombie and the player is D(x)=hypotenuse*cos(angle)
    // the distance in the Y-axis between the zombie and the player is D(y)=hypotenuse*sen(angle)

    // cosAng and senAng are the cosine and sine of the angle formed by the hypotenuse and x-axis
    let cosAng = (elem.coordXY[0] - this.coordXY[0]) / hypotenuse;
    let senAng = (elem.coordXY[1] - this.coordXY[1]) / hypotenuse;

    // the function of a straight line is X=a*t+Xo and Y=b*t+Yo where a=Vx, b=Vy, Xo= this.coordXY[0] and Yo=this.coordXY[1] (initial position)
    // the  derivative of the functions are Vx=a and Vy=b
    // the velocity towards the player (V(t)) is constant, Vx=V(t)cos(angle) and Vy=V(t)sen(angle)

    // Vt=this.steps  and we are calculating for every interval--> t=1

    //X=a*t+Xo and Y=b*t+Yo
    this.coordXY[0] = this.steps * cosAng + this.coordXY[0];
    this.coordXY[1] = +this.steps * senAng + this.coordXY[1];
    this.changeCoordinates(this.coordXY);

  }

}
class ZombieF extends Zombie {
  constructor(width, height) {
    super(width, height);
    this.steps = 3;
    this.domElem.className = `zombie zombieB`;

    this.changeCoordinates(this.randomPosition());
  }
}
class BabyZombie extends ElementOnBoard{
  constructor(fatherCoordXY,width, height, steps) {
    super(width, height, steps);
    this.domElem.className = `zombie baby-zombie`;
    this.domElem.style.backgroundImage=`url(./css/img/zombieBoss.png)`
    
    //  important: prepare a deep copy of the coordinates of the player
    this.coordXY[0] = fatherCoordXY[0]
    this.coordXY[1] = fatherCoordXY[1]

    this.origin=[this.coordXY[0],this.coordXY[1]]
    this.changeCoordinates(this.origin);
  }
  moveTowards(elem) {
    //the hypotenuse is the absolute distance between the player and the zombie
    let hypotenuse = Math.sqrt(
      (elem.coordXY[0] - this.coordXY[0]) ** 2 +
        (elem.coordXY[1] - this.coordXY[1]) ** 2
    );
    // the distance in the X-axis between the zombie and the player is D(x)=hypotenuse*cos(angle)
    // the distance in the Y-axis between the zombie and the player is D(y)=hypotenuse*sen(angle)

    // cosAng and senAng are the cosine and sine of the angle formed by the hypotenuse and x-axis
    let cosAng = (elem.coordXY[0] - this.coordXY[0]) / hypotenuse;
    let senAng = (elem.coordXY[1] - this.coordXY[1]) / hypotenuse;

    // the function of a straight line is X=a*t+Xo and Y=b*t+Yo where a=Vx, b=Vy, Xo= this.coordXY[0] and Yo=this.coordXY[1] (initial position)
    // the  derivative of the functions are Vx=a and Vy=b
    // the velocity towards the player (V(t)) is constant, Vx=V(t)cos(angle) and Vy=V(t)sen(angle)

    // Vt=this.steps  and we are calculating for every interval--> t=1

    //X=a*t+Xo and Y=b*t+Yo
    this.coordXY[0] = this.steps * cosAng + this.coordXY[0];
    this.coordXY[1] = +this.steps * senAng + this.coordXY[1];
    this.changeCoordinates(this.coordXY);
  }
}
class ZombieBoss extends Zombie{
  constructor(width, height) {
    super(width, height);
    this.steps = 1;
    this.life=8;
    this.domElem.className = `zombie zombie-boss`;
    this.domElem.style.backgroundImage=`url(./css/img/zombieBoss.png)`
    this.coordXYPast=[]
    
    this.changeCoordinates(this.randomPosition());
    this.elemCenter=[this.coordXY[0]+this.width/2,this.coordXY[1]+this.height/2]
  }
  giveBirthZombies(sec){
    this.elemCenter=[this.coordXY[0]+this.width/2,this.coordXY[1]+this.height/2]
    if (game.intervalCounter % (sec * game.fps) === 1) {
        game.zombies.push(new BabyZombie(this.elemCenter,25,25,2));
        
    }
  }
  

}

class Bullet extends ElementOnBoard {
  constructor(directionCoordXY, width, height, steps) {
    super(width, height, steps);
    this.directionCoordXY = directionCoordXY;

    //  important: prepare a deep copy of the coordinates of the player
    this.coordXY[0] = game.player.coordXY[0]+game.player.width/2;
    this.coordXY[1] = game.player.coordXY[1]+game.player.height/2;

    this.domElem.className = `bullet`;
    
    this.angles = this.calculateSenCos(this.directionCoordXY);
    

    this.changeCoordinates(this.coordXY);

    
  }
  move() {
    this.coordXY[0] = this.coordXY[0] + this.steps * this.angles[0];

    this.coordXY[1] = this.coordXY[1] + this.steps * this.angles[1];

    this.changeCoordinates(this.coordXY);
  }
  calculateSenCos(mouseCoordXY) {
    //this method calculates
    //same aproach as before with zombie class, but we need this only once
    let hypotenuse = Math.sqrt(
      (mouseCoordXY[0] - this.coordXY[0]) ** 2 +
        (mouseCoordXY[1] - this.coordXY[1]) ** 2
    );

    let cosAng = (mouseCoordXY[0] - this.coordXY[0]) / hypotenuse;
    let senAng = (mouseCoordXY[1] - this.coordXY[1]) / hypotenuse;

    return [cosAng, senAng];
  }
  changeCoordinates(coordinatesXY) {
    this.domElem.style.left = coordinatesXY[0] + this.units;
    this.domElem.style.bottom = coordinatesXY[1] + this.units;
  }
  collitionDetector(elem1, elem2) {
    if (
      elem1.coordXY[0] < elem2.coordXY[0] + elem2.width &&
      elem1.coordXY[0] + elem1.width > elem2.coordXY[0] &&
      elem1.coordXY[1] < elem2.coordXY[1] + elem2.height &&
      elem1.height + elem1.coordXY[1] > elem2.coordXY[1]
    ) {
      return true;
    } else {
      return false;
    }
  }
}

