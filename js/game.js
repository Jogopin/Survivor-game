class Game {
  constructor() {
    //board settings
    this.boardWidth = 800;
    this.boardHeight = 600;
    this.units = `px`;

    this.timeInSeconds = 0; //total time in seconds
    this.fps = 50;
    this.score = 0;
    this.globalInterval = null;
    this.intervalDelay = 1000 / this.fps;
    this.intervalCounter = 0;

    this.scoreElem = document.querySelector(`#board div p`); //
    this.boardElem = document.querySelector(`#board`);

    this.player = null;
    this.zombies = [];
    this.bullets = [];
    this.zombiesBoss = [];
    this.zombiesKilled = 0;

    this.bulletEventListener = null;

    this.startGameWindow();
    this.loadNewGame();

    this.attachPlayerEventListener();
  }
  startGame() {
    this.zombies.push(new Zombie(30, 30, 2));
    
    this.intervalCounter = 0;

    this.globalInterval = setInterval(() => {
      this.intervalCounter++;

      calculatesTimeInSec();
      updateScore();

      //player movement depending of player.pressedKeyArray
      game.player.movesPlayer();

      //****************//
      //****enemies****//
      //***************//

      this.createZombiePerSec(4);

      //after 10s zombies every 3 sec
      if (this.timeInSeconds > 10) this.createZombiePerSec(3);

      //wave of 5 zombies every 15seconds
      this.createWaveOfZombies(5, 12);

      //zombies B every 5 secs
      this.createZombieFPerSec(7);

      //create a boss
      this.createZombieBoss(15);
      if (this.zombiesBoss.length) {
        this.zombiesBoss.forEach((zombieBoss) => {
          zombieBoss.giveBirthZombies(1.5);
        });
      }

      //movement every 1 frame towards the player
      this.movesZombies();
      this.movesZombiesBoss();

      //****bullets****/
      reloadGun();

      //remove bullets out of the board
      this.removeBulletsOutBoard();
      //------------bullets collition detection
      this.bulletsCollitionDetector();
    }, this.intervalDelay);
  }
  loadNewGame() {
    this.createScore();
    this.player = new Player(30, 30, 4);
    this.zombiesKilled = 0;
    this.bullets = [];
    this.timeInSeconds = 0;
  }
  startGameWindow() {
    let startGameElem = document.createElement(`div`);
    //add properties
    startGameElem.className = `start-game small-window`;
    startGameElem.innerHTML = `
        <h2>SURVIVOR</h2>
        
        <button class="btn"id="play">Play!!!</button>
        `;
    //place the element
    document.querySelector("#board").appendChild(startGameElem);
    //event listener
    let play = document.querySelector("#play");
    play.addEventListener(`click`, () => {
      this.player.domElem.remove();
      document.removeEventListener(
        "mousemove",
        game.player.rotateFaceEventListener
      );

      this.loadNewGame();
      this.attachBulletEventListener();
      this.startGame();
      startGameElem.remove();
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
  calculateScore() {
    this.score = this.timeInSeconds + this.zombiesKilled * 10;
    return this.score;
  }
  showTime() {
    let minutes = Math.floor(this.timeInSeconds / 60);
    let seconds = this.timeInSeconds % 60;

    let textTime = `${computeTwoDigitNumber(
      minutes
    )}<span>m</span> : ${computeTwoDigitNumber(seconds)}<span>s</span>`;

    return textTime;
  }
  attachPlayerEventListener() {
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

    // this.player.rotateFace()
  }
  attachBulletEventListener() {
    this.bulletEventListener = (e) => {
      let mouseCoordXYWindow = this.boardElem.getBoundingClientRect(); //coordinates of themouse relatives to the screen

      const mouseCoordXY = [
        //converts the coordinates of the mouse in to the axis sistem we are using
        e.pageX - mouseCoordXYWindow.left,
        this.boardHeight + (mouseCoordXYWindow.top - e.pageY),
      ];
      //only shoots when has bullets
      if (this.player.bulletsAvailable > 0 && this.player.chargingCounter > 0) {
        game.bullets.push(new Bullet(mouseCoordXY, 5, 5, 8));
        this.player.bulletsAvailable--;
        this.player.chargingCounter = 0;
      }
    };

    this.boardElem.addEventListener(`click`, this.bulletEventListener);
  }
  stopGame() {
    clearInterval(this.globalInterval);

    // create div element
    let gameOverElem = document.createElement(`div`);
    //add properties
    gameOverElem.className = `game-over small-window`;
    gameOverElem.innerHTML = `
            <h2>GAME OVER</h2>
            <h3>Score:  ${this.calculateScore()}&emsp;&emsp;&emsp;&emsp;&emsp;<span>Time : ${this.showTime()}</span></h3>   
            <button class="btn"id="replay">Replay!!!</button>
            `;
    //place the element
    document.querySelector("#board").appendChild(gameOverElem);

    // replay btn functionality

    let replay = document.querySelector("#replay");
    replay.addEventListener(`click`, () => {
      this.timeInSeconds = 0;
      //removing elements of the board
      this.zombies.forEach((zombie) => {
        zombie.domElem.remove();
      });
      this.zombies = [];

      this.bullets.forEach((bullet) => {
        bullet.domElem.remove();
      });

      this.zombiesBoss.forEach((zombie) => {
        zombie.domElem.remove();
      });
      this.zombiesBoss = [];

      this.bullets = [];

      this.player.domElem.remove();
      document.removeEventListener(
        "mousemove",
        game.player.rotateFaceEventListener
      );
      this.score = 0;

      gameOverElem.remove();

      //starts a new game
      this.loadNewGame();
      this.startGame();
    });
  }

  createZombiePerSec(sec) {
    if (this.intervalCounter % (sec * this.fps) === 0) {
      this.zombies.push(new Zombie(40, 40, 2));
    }
  }
  createZombieFPerSec(sec) {
    if (this.intervalCounter % (sec * this.fps) === 0) {
      this.zombies.push(new ZombieF(40, 40));
    }
  }

  createWaveOfZombies(numZombies, sec) {
    //wave of 5 zombies every 15seconds
    if (this.intervalCounter % (sec * this.fps) === 0) {
      for (let i = numZombies; i < numZombies; i++) {
        let randomSpeed = Math.random() * 5;
        setTimeout(
          () => this.zombies.push(new Zombie(30, 30, randomSpeed)),
          500 * i
        );
      }
    }
  }
  createZombieBoss(sec) {
    if (this.intervalCounter % (sec * this.fps) === 0) {
      this.zombiesBoss.push(new ZombieBoss(80, 80));
    }
  }
  movesZombies() {
    if (this.intervalCounter % 1 === 0) {
      this.zombies.forEach((zombie) => {
        zombie.moveTowards(this.player);
        if (collitionDetector(this.player, zombie)) {
          game.stopGame();
        }
      });
    }
  }
  movesZombiesBoss() {
    if (this.intervalCounter % 1 === 0) {
      this.zombiesBoss.forEach((zombie) => {
        zombie.moveTowards(this.player);
        if (collitionDetector(this.player, zombie)) {
          game.stopGame();
        }
      });
    }
  }
  removeBulletsOutBoard() {
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
  }

  bulletsCollitionDetector() {
    this.bullets.forEach((bullet, indexBullet) => {
      this.zombies.forEach((zombie, indexZombie) => {
        if (collitionDetector(bullet, zombie)) {
          zombie.domElem.style.backgroundImage = `url(./css/img/blood.png)`;
          zombie.domElem.style.filter = `brightness(50%)`;

          //remove the blood
          setTimeout(() => {
            zombie.domElem.remove();
          }, 2000);

          this.zombies.splice(indexZombie, 1);

          //remove the bullet
          bullet.domElem.remove();
          this.bullets.splice(indexBullet, 1);

          //score points
          this.zombiesKilled++;
        }
      });
      this.zombiesBoss.forEach((zombie, indexZombie) => {
        if (collitionDetector(bullet, zombie)) {
          zombie.life--;
          //remove the bullet
          bullet.domElem.remove();
          this.bullets.splice(indexBullet, 1);
          // change color and velocity 
          if (zombie.life < 5) {
            zombie.domElem.style.filter = `sepia(0.7)`;
            zombie.steps=2
          }// change color and velocity 
          if(zombie.life<2){
            zombie.steps=3
            zombie.domElem.style.filter = `invert(1)`
          }


          if (zombie.life === 0) {
            zombie.domElem.style.backgroundImage = `url(./css/img/blood.png)`;
            zombie.domElem.style.filter = `brightness(50%)`;
            //score points
            this.zombiesKilled += 20;

            //remove the blood
            setTimeout(() => {
              zombie.domElem.remove();
            }, 4000);

            this.zombiesBoss.splice(indexZombie, 1);
          }
        }
      });
    });
  }
}

const game = new Game();