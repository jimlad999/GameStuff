function getPlayer() {
 var player = {
  x: 0,
  y: 0,
  isBelowGround: false,
 
  xSpeed: 0,
  xSpeedPower: 4,//4 normal; 6 debug; //const
  ySpeed: 0,
  ySpeedPower: 3,//2 normal; 4 debug; //const
 
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
  }
 };
 player.image.src="./assets/player.png";
 player.marker.src="./assets/player-marker.png";
 return player;
};