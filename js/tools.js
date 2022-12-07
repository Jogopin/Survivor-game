const calculatesTimeInSec=function(){
    if (game.intervalCounter % game.fps === 0) {
        game.timeInSeconds++;
        ;
      }
}
const updateScore = function () {
  if (game.intervalCounter %  (0.5*game.fps) === 0) {
    
    game.scoreElem.innerText = `${game.calculateScore()}`;
  }
};
const reloadGun = function () {
  //only allows shoot every timeBetweenShoot
  if (game.intervalCounter % (game.player.timeBetweenShoot * game.fps) === 0) {
    game.player.chargingCounter++;
  }

  if (game.intervalCounter % (game.fps / 2) === 0) {// one more bullet every  0.5 sec
    
   

    if(game.player.bulletsAvailable<=game.player.gunChamber){
      game.player.bulletsAvailable++;
       game.bulletsIndicatorArray.push(game.createBulletIndicator())
    }
  }
};

const computeTwoDigitNumber = function(value) {
    let twoDig = `0` + new String(value);

    if (twoDig.length > 2) {
      return twoDig.slice(1, 3);
    }

    return twoDig;
  }

  const collitionDetector = function(elem1,elem2){
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



  const collitionDetectorCircles = function(elem1,elem2){

    //this is not finished and can`t be implemented
    
    
    let textAngle = elem1.domElem.style.transform
    let angle=getTransform(textAngle)
    let hr=Math.sqrt((elem1.width/2)**2+(elem1.width/2)**2)
    let elem1Center=null
    if(angle>=0){
       elem1Center=[(elem1.coordXY[0])+hr*Math.sin((Math.PI/4)+angle),elem1.coordXY[1]+hr*Math.cos((Math.PI/4)+angle)] 
    }else{
      elem1Center=[(elem1.coordXY[0])+hr*Math.sin((-Math.PI/4)+angle),elem1.coordXY[1]+hr*Math.cos((-Math.PI/4)+angle)]

    }
    
    const dx= elem1Center[0]-(elem2.coordXY[0]+elem2.width/2)
    const dy= elem1Center[1]-(elem2.coordXY[1]+elem2.height/2)
    
    const hypotenuse = Math.sqrt((dx * dx) + (dy * dy));
    if(hypotenuse<((elem1.width/2)+(elem2.width/2))){
 
      return true
    }else{
      return false
    }
    
    
  }

//  {

  let getTransform = function (text) {
  
    let sol = '';
    for (i = 7; i < 13; i++) {
      sol += String(text[i]);
    }
    if(sol[0]=="0") return 0
    
    
   
    return sol*(Math.PI/180);
  };
  