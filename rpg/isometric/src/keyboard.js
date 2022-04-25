function addKeyboardListener(player) {
 var keyboardListener = {
  pause: false,
  onKeydown: function(e){
   if(this.pause) return;
   switch (e.which) {
    case 32: player.jump(); break;
    case 37: player.moveLeft(); break;
    case 38: player.moveUp(); break; //key-up
    case 39: player.moveRight(); break;
    case 40: player.moveDown(); break; //key-down
    default: return; // exit this handler for other keys
   }
   e.preventDefault();
  },
  onKeyUp: function(e){
   if(this.pause) return;
   switch (e.which) {
    case 37: player.stopMoveHorizontal(); break;
    case 38: player.stopMoveVertical(); break; //key-up
    case 39: player.stopMoveHorizontal(); break;
    case 40: player.stopMoveVertical(); break; //key-down
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