function addMouseListener(environment, viewport){
 var mouse={
  x:0,
  y:0,
  screenX:0,
  screenY:0,
  getEqualFunc:function(){
   var mx=this.x,my=this.y;
   function match(x,y){
    return x===mx && y===my;
   };
   return match;
  }
 };
 document.addEventListener("mousemove",function(e){
  var tile=environment.getTileIndex(e.offsetX+viewport.x-viewport.widthHalf,e.offsetY+viewport.y-viewport.heightHalf);
  //mouse can be duck typed as a "tile"
  mouse.x=tile.x;
  mouse.y=tile.y;
  mouse.screenX=e.offsetX;
  mouse.screenY=e.offsetY;
 });
 return mouse;
}