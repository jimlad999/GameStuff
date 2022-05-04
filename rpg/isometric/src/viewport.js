function initViewport(position/*any {x,y}*/,canvas){
 return {
  position,
  bounds:null,//{minX,maxX,minY,maxY}
  width: canvas.width,
  widthHalf: canvas.width/2,
  height: canvas.height,
  heightHalf: canvas.height/2,
  get x(){
   if(this.bounds){
    if(this.position.x < this.bounds.minX) return this.bounds.minX;
    if(this.position.x > this.bounds.maxX) return this.bounds.maxX;
   }
   return this.position.x;
  },
  get y(){
   if(this.bounds){
    if(this.position.y < this.bounds.minY) return this.bounds.minY;
    if(this.position.y > this.bounds.maxY) return this.bounds.maxY;
   }
   return this.position.y;
  },
  follow: function(position){
   this.position=position;
  },
  limitTo: function(bounds){
   if(bounds.minX<=bounds.maxX && bounds.minY<=bounds.maxY){
    this.bounds=bounds;
   }else{
    console&&console.log("WARN: bounds not feasible given current canvas size",bounds);
    this.bounds=null;
   }
  },
  limitToBoundsOfEnvironment: function(environment){
   this.limitTo({
    minX:this.widthHalf,
    maxX:environment.tileset.tileWidth * environment.numTilesX - this.widthHalf - environment.tileset.tileWidthHalf,
    minY:this.heightHalf,
    maxY:environment.tileset.tileHeightHalf * (environment.numTilesY-1) - this.heightHalf
   });
  }
 };
};