function getPlayer() {
 var player = {
  x: 0,
  y: 0,
  isBelowGround: false,
 
  xSpeed: 0,
  xSpeedPower: 4,//4 normal; 6 debug; //const
  ySpeed: 0,
  ySpeedPower: 3,//2 normal; 4 debug; //const //slightly faster straight vertical movement feels more natural
 
  height: 0,
  jumpHeight: 0,
  jumpPower: 12, //const
  gravity: 2, //const
 
  image: new Image(),
  xSizeOffset: 11, //const //half img width
  ySizeOffset: 40, //const
  marker: new Image(),
  markerXSizeOffset: 3, //const //half img width
  markerYSizeOffset: 10, //const
 
  moveLeft: function(){
   this.xSpeed=this.xSpeedPower;
  },
  moveUp: function(){
   this.ySpeed=this.ySpeedPower;
  },
  moveRight: function(){
   this.xSpeed=-this.xSpeedPower;
  },
  moveDown: function(){
   this.ySpeed=-this.ySpeedPower;
  },
  stopMoveHorizontal: function(){
   this.xSpeed=0;
  },
  stopMoveVertical: function(){
   this.ySpeed=0;
  },
  jump: function(){
   this.jumpHeight=this.jumpPower;
  },
  update: function(tiles){
   // collision detection: walls
   if(this.xSpeed!=0){
    var nextpx=this.x-this.xSpeed;
    var pground=tiles.getGround(nextpx,this.y);
    if(this.height<=pground){
     this.x=nextpx;
    }
   }
   if(this.ySpeed!=0){
    //adjust speed so that moving in diagonal motion aligns with the grid
    var nextpy=this.y-(this.xSpeed===0?this.ySpeed:this.ySpeed>0?2:-2);
    var pground=tiles.getGround(this.x,nextpy);
    if(this.height<=pground){
     this.y=nextpy;
    }
   }
   // collision detection: ground
   var playerTile=tiles.getTileIndex(this.x,this.y);
   var pground=tiles.getGroundFromTile(playerTile);
   if(this.height<pground || this.jumpHeight!==0){
    this.height-=this.jumpHeight;
    this.jumpHeight-=this.gravity;
   }
   if(this.height>=pground){
    this.jumpHeight=0;
    this.height=pground;
   }
   // detecting "underground"
   if(this.height>10 ){
    this.isBelowGround=true;
   }else if(this.height<=0 ){
    this.isBelowGround=false
   }
  }
 };
 player.image.src="./assets/player.png";
 player.marker.src="./assets/player-marker.png";
 return player;
};