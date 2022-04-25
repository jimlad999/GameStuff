function initGame(tiles, renderer, player){
 return {
  advanceGameTime: function(){
   // collision detection: walls
   if(player.xSpeed!=0){
    var nextpx=player.x-player.xSpeed
    var pground=tiles.getGround(nextpx,player.y);
    if(player.height<=pground){
     player.x=nextpx;
    }
   }
   if(player.ySpeed!=0){
    var nextpy=player.y-player.ySpeed
    var pground=tiles.getGround(player.x,nextpy);
    if(player.height<=pground){
     player.y=nextpy;
    }
   }
   // collision detection: ground
   var playerTile=tiles.getTileIndex(player.x,player.y);
   var pground=tiles.getGroundFromTile(playerTile);
   if(player.height<pground || player.jumpHeight!==0){
    player.height-=player.jumpHeight;
    player.jumpHeight-=player.gravity;
   }
   if(player.height>=pground){
    player.jumpHeight=0;
    player.height=pground;
   }
   // detecting "underground"
   if(player.height>10 && renderer.seeBehindTileOpacity>renderer.seeBehindTileOpacityMin){
    player.isBelowGround=true;
    // slower fade-out of above ground
    renderer.seeBehindTileOpacity-=0.05;
    if(renderer.seeBehindTileOpacity<renderer.seeBehindTileOpacityMin){
     renderer.seeBehindTileOpacity=renderer.seeBehindTileOpacityMin;
    }
   }else if(player.height<=0 && renderer.seeBehindTileOpacity<1){
    player.isBelowGround=false
    // faster fade-in of above ground so that above ground is revealed faster
    renderer.seeBehindTileOpacity+=0.15;
    if(renderer.seeBehindTileOpacity>renderer.seeBehindTileOpacityMax){
     renderer.seeBehindTileOpacity=renderer.seeBehindTileOpacityMax;
    }
   }
   renderer.redraw(playerTile);
  }
 };
};