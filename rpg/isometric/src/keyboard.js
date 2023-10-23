function addKeyboardListener(player) {
 var preventKeyRepeat=[];
 preventKeyRepeat[32]=true;
 var keysPressed=[];
 var keyboardListener = {
  pause: false,
  onKeydown: function(e){
   if(this.pause) return;
   if(preventKeyRepeat[e.which]){
    if(keysPressed[e.which]) return;
    keysPressed[e.which]=true;
   }
   switch (e.which) {
    //space sometimes not registered as pressed when multiple arrow keys pressed.
    //while testing, space not registered while pressing down and left keys.
    //TODO: workaround to map to different keys.
    case 32/*space*/: player.jump(); break;
    // arrow keys
    case 37: player.moveLeft(); break;
    case 38: player.moveUp(); break;
    case 39: player.moveRight(); break;
    case 40: player.moveDown(); break;
    default: return; // exit this handler for other keys
   }
   e.preventDefault();
  },
  onKeyUp: function(e){
   if(this.pause) return;
   if(preventKeyRepeat[e.which]){
    keysPressed[e.which]=false;
   }
   switch (e.which) {
    case 37: player.stopMoveHorizontal(); break;
    case 38: player.stopMoveVertical(); break;
    case 39: player.stopMoveHorizontal(); break;
    case 40: player.stopMoveVertical(); break;
    default: return; // exit this handler for other keys
   }
   e.preventDefault();
  },
  remove: function(){
   document.removeEventListener("keydown",this.onKeydown);
   document.removeEventListener("keyup",this.onKeyUp);
  }
 };
 document.addEventListener("keydown",keyboardListener.onKeydown);
 document.addEventListener("keyup",keyboardListener.onKeyUp);
 return keyboardListener;
};