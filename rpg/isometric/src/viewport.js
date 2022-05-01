function initViewport(position/*any {x,y}*/,canvas){
 return {
  get x(){
   return position.x;
  },
  get y(){
   return position.y;
  },
  width: canvas.width,
  widthHalf: canvas.width/2,
  height: canvas.height,
  heightHalf: canvas.height/2
 };
};