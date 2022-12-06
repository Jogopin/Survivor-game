const calculatesTimeInSec=function(){
    if (game.intervalCounter % game.fps === 0) {
        game.timeInSeconds++;
        ;
      }
}
const updateScore = function () {
  if (game.intervalCounter %  (0.5* game.fps) === 0) {
    game.timeInSeconds++;
    game.scoreElem.innerText = `${game.calculateScore()}`;
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

