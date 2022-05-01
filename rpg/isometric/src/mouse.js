function addMouseListener(environment, viewport){
 var mouse={
  x:0,
  y:0,
  screenX:0,
  screenY:0
 };
 document.addEventListener("mousemove",function(e){
  var tile=environment.getTileIndex(e.offsetX+viewport.x-viewport.widthHalf,e.offsetY+viewport.y-viewport.heightHalf);
  mouse.x=tile.x;
  mouse.y=tile.y;
  mouse.screenX=e.offsetX;
  mouse.screenY=e.offsetY;
 });
 return mouse;
}