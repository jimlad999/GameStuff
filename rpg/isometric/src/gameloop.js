function initGame(environment, renderer, player){
 return {
  advanceGameTime: function(){
   player.update(environment);
   renderer.redraw();
  }
 };
};