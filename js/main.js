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

class Player extends ELementOnBoard {

  constructor(width, height, steps) {
    super(width, height, steps);

    this.coordXY[0] = this.boarWidth / 2 - this.width / 2;
    this.coordXY[1] = this.boardHeight / 2 - this.height / 2;

    this.domElem.className = `player`;

    this.pressedKeyArray = [false, false, false, false]; //  [ArrowUP,ArrowRight,ArrowDown,ArrowLeft]
    //note: when 2 keys are pressed both values in the array are true

    this.changeCoordinates(this.coordXY);
    this.rotateFace()
  }
  rotateFace(){
    
    let playerBoundingRect = this.domElem.getBoundingClientRect();
    let playerCenter= {
        x: playerBoundingRect.left + playerBoundingRect.width/2, 
        y: playerBoundingRect.top + playerBoundingRect.height/2
    };
    
    document.addEventListener("mousemove", e => {
        let angle = Math.atan2(e.pageX - playerCenter.x, - (e.pageY - playerCenter.y) )*(180 / Math.PI);      
        this.domElem.style.transform = `rotate(${angle}deg)`;  
    })

  }
}

class Zombie extends ELementOnBoard {
  constructor(width, height, steps) {
    super(width, height, steps);
    this.domElem.className = `zombie`;
    this.randomFace()
    this.changeCoordinates(this.randomPosition());
  }
  randomFace(){
    let n =Math.floor(Math.random()*3 +1)
    this.domElem.style.backgroundImage=`url(/css/img/zombie${n}.png)`
    
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
        this.coordXY[1] = 600 - this.height; // width
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
class ZombieB extends Zombie {
  constructor(width, height) {
    super(width, height);
    this.steps = 5;
    this.domElem.className = `zombie zombieB`;

    this.changeCoordinates(this.randomPosition());
  }
}
class Bullet extends ELementOnBoard {
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

class Game {
  constructor() {
    this.boardWidth = 800;
    this.boardHeight = 600;
    this.units = `px`;
    this.player = null;
    this.zombies = [];

    this.timeInSeconds = 0; //total time in seconds

    this.scoreElem = document.querySelector(`#board div p`);
    this.score = 0;

    this.fps = 50; // frames per second, note when 60fps, a warning appears
    this.globalInterval = null;
    this.intervalDelay = 1000 / this.fps;

    this.bullets = [];

    this.zombiesKilled = 0;

    this.bulletEventListener = null;
    this.playerEventListenerKeyup = null;
    this.playerEventListenerKeydown = null;

    this.startGameWindow()
  }
  startGame() {
    
    this.player = new Player(30, 30, 4);
    this.zombies.push(new Zombie(30, 30, 2));
    this.zombiesKilled = 0;
    this.bullets = [];
    this.eventListeners();
    this.createScore();



    let intervalCounter = 0;
    this.timeInSeconds = 0;

    //globalInterval, it sets the framerate at which everything moves

    this.globalInterval = setInterval(() => {
      intervalCounter++;

      //calculates total of Seconds passed
      if (intervalCounter % this.fps === 0) {
        this.timeInSeconds++;
        this.scoreElem.innerText = `${this.scoreTotal()}`;
      }
      //player movement depending of player.pressedKeyArray
      if (this.player.pressedKeyArray[0]) this.player.move(`up`);
      if (this.player.pressedKeyArray[1]) this.player.move(`right`);
      if (this.player.pressedKeyArray[2]) this.player.move(`down`);
      if (this.player.pressedKeyArray[3]) this.player.move(`left`);

      //zombies every 4 sec
      if (intervalCounter % (4 * this.fps) === 0) {
        this.zombies.push(new Zombie(40, 40, 2));
      }
      // faster zombies after 12 sec every 3 sec
      if (this.timeInSeconds > 12 && intervalCounter % (3 * this.fps) === 0) {
        this.zombies.push(new Zombie(30, 30, 4));
      }
      //wave of 5 zombies every 15seconds 
      if (intervalCounter % (15 * this.fps) === 0) {
        for (let i = 0; i < 5; i++) {
          let randomSpeed = Math.random() * 5;
          setTimeout(()=>this.zombies.push(new Zombie(30, 30, randomSpeed)),500*i)
        }
      }
      //zombies B every 5 secs
      if (intervalCounter % (5 * this.fps) === 0) {
        this.zombies.push(new ZombieB(40, 40));
      }

      //movement every 1 frame towards the player
      if (intervalCounter % 1 === 0) {
        this.zombies.forEach((zombie) => {
          zombie.moveTowards(this.player);
          if (zombie.collitionDetector(this.player, zombie)) {
            game.stopGame();
          }
        });
      }

      //------------bullets
      //remove bullets out of the board
      this.bullets.forEach((elem, index) => {
        elem.move();
        if (
          elem.coordXY[0] > this.boardWidth ||
          elem.coordXY[0] < 0 ||
          elem.coordXY[1] > this.boardHeight ||
          elem.coordXY[1] < 0
        ) {
          elem.domElem.remove();
          this.bullets.splice(index, 1);
        }
      });
      //------------bullets collition detection
      this.bullets.forEach((bullet, indexBullet) => {
        this.zombies.forEach((zombie, indexZombie) => {
          if (bullet.collitionDetector(bullet, zombie)) {
            
            zombie.domElem.style.backgroundImage= `url(/css/img/blood.png)`
            zombie.domElem.style.filter= `brightness(50%)`
            //remove the zombie

            setTimeout(()=>{zombie.domElem.remove()},2000)
            
            this.zombies.splice(indexZombie, 1);
            //remove the bullet
            bullet.domElem.remove();
            this.bullets.splice(indexBullet, 1);
            //score points

            this.zombiesKilled++;
          }
        });
      });
    }, this.intervalDelay);
  }
  startGameWindow(){
    let startGameElem = document.createElement(`div`);
    //add properties
    startGameElem.className = `start-game small-window`;
    startGameElem.innerHTML = `
    <h2>SURVIVOR</h2>
    
    <button class="btn"id="play">Play!!!</button>
    `;
    //place the element
    document.querySelector("#board").appendChild(startGameElem);

    let play = document.querySelector("#play");
    play.addEventListener(`click`, () => {
      this.startGame();
      startGameElem.remove();
    });
  }

  eventListeners() {
    //****************player movement****************************
    //change  the elements inside player.pressedKeyArray when we press one Arrow Key
    this.playerEventListenerKeydown = (e) => {
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
    };

    // only when we stop pressing the key, it will change to false  the element in player.pressedKeyArray
    this.playerEventListenerKeyup = (e) => {
      if (e.key === `ArrowUp`) {
        this.player.pressedKeyArray[0] = false;
      } else if (e.code === `ArrowRight`) {
        this.player.pressedKeyArray[1] = false;
      } else if (e.code === `ArrowDown`) {
        this.player.pressedKeyArray[2] = false;
      } else if (e.code === `ArrowLeft`) {
        this.player.pressedKeyArray[3] = false;
      }
    };
    document.addEventListener(`keydown`, this.playerEventListenerKeydown);
    document.addEventListener(`keyup`, this.playerEventListenerKeyup);
    //*********************bullets

    this.bulletEventListener = (e) => {
      let mouseCoordXYWindow = boardElem.getBoundingClientRect(); //coordinates of themouse relatives to the screen

      const mouseCoordXY = [
        //converts the coordinates of the mouse in to the axis sistem we are using
        e.pageX - mouseCoordXYWindow.left,
        this.boardHeight + (mouseCoordXYWindow.top - e.pageY),
      ];

      game.bullets.push(new Bullet(mouseCoordXY, 5, 5, 8));
    };
    let boardElem = document.querySelector(`#board`);

    boardElem.addEventListener(`click`, this.bulletEventListener);

    //**************************************************** */
  }
  stopGame() {
    clearInterval(this.globalInterval);

    // create div element
    let gameOverElem = document.createElement(`div`);
    //add properties
    gameOverElem.className = `game-over small-window`;
    gameOverElem.innerHTML = `
    <h2>GAME OVER</h2>
    <h3>Score:  ${this.scoreTotal()}&emsp;&emsp;&emsp;&emsp;&emsp;<span>Time : ${this.showTime()}</span></h3>   
    <button class="btn"id="replay">Replay!!!</button>
    `;
    //place the element
    document.querySelector("#board").appendChild(gameOverElem);

    // replay btn functionality

    let replay = document.querySelector("#replay");
    replay.addEventListener(`click`, () => {
      this.timeInSeconds = 0;

      this.zombies.forEach((zombie) => {
        zombie.domElem.remove();
      });
      this.zombies = [];

      this.bullets.forEach((bullet) => {
        bullet.domElem.remove();
      });
      this.bullets = [];

      this.player.domElem.remove();
      this.score = 0;

      //remove eventlisteners
      let boardElem = document.querySelector(`#board`);
      boardElem.removeEventListener(`click`, this.bulletEventListener);
      document.removeEventListener(`keydown`, this.playerEventListenerKeydown);
      document.removeEventListener(`keyup`, this.playerEventListenerKeyup);

      gameOverElem.remove();

      this.startGame();
    });
  }
  createScore() {
    let scoreBoxWidth = 0;
    let scoreBoxHeight = 0;
    let scoreBoxElem = document.querySelector(`.score`);

    //add properties to the element
    scoreBoxWidth = this.boardWidth * 0.1; //10% the size of the board
    scoreBoxHeight = this.boardHeight * 0.1;
    scoreBoxElem.style.visibility = `visible`;
    scoreBoxElem.style.width = scoreBoxWidth + this.units;
    scoreBoxElem.style.height = scoreBoxHeight + this.units;

    // place the element on the board
    scoreBoxElem.style.bottom =
      this.boardHeight - scoreBoxHeight - scoreBoxHeight / 3 + this.units;
    scoreBoxElem.style.left =
      this.boardWidth - scoreBoxWidth - scoreBoxWidth / 4 + this.units;
  }

  scoreTotal() {
    this.score = this.timeInSeconds + this.zombiesKilled * 10;
    return this.score;
  }
  showTime() {
    let minutes = Math.floor(this.timeInSeconds / 60);
    let seconds = this.timeInSeconds % 60;

    let textTime = `${this.computeTwoDigitNumber(
      minutes
    )}<span>m</span> : ${this.computeTwoDigitNumber(seconds)}<span>s</span>`;

    return textTime;
  }
  computeTwoDigitNumber(value) {
    let twoDig = `0` + new String(value);

    if (twoDig.length > 2) {
      return twoDig.slice(1, 3);
    }

    return twoDig;
  }
}

const game = new Game();


