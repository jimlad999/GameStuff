function initGame(tiles, renderer, player){
 return {
  advanceGameTime: function(){
   player.update(tiles);
   renderer.redraw();
  }
 };
};