function getPlayer() {
 var player = {
  x: 0,
  y: 0,
  isBelowGround: false,//i.e. underground
 
  xSpeed: 0,
  xSpeedPower: 4,//4 normal; 6 debug; //const
  xSpeedPowerHalf: 2,//const
  ySpeed: 0,
  ySpeedPower: 3,//3 normal; 4 debug; //const //slightly faster straight vertical movement feels more natural
  ySpeedPowerHalf: 1,//const
  ySpeedPowerDiagonal: 2,//const //half xSpeedPower //slightly slower so that diagnoal movement aligns with the grid
 
  height: 0,
  jumpSpeed: 0,
  jumpPower: 12, //const
  gravity: 2, //const
  jumpCount: 0,
  maxJumpCount: 2,//const //unlockable feature?
 
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
   if(this.jumpCount>=this.maxJumpCount) return;
   this.jumpSpeed=this.jumpPower;
   ++this.jumpCount;
  },
  update: function(environment){
   var pground=null,
    collisionCheck=null,
    xSpeed=this.xSpeed,
    ySpeed=this.xSpeed===0||this.ySpeed===0?this.ySpeed:this.ySpeed>0?this.ySpeedPowerDiagonal:-this.ySpeedPowerDiagonal;
   // collision detection: walls
   if(xSpeed!=0){
    var nextpx=this.x-xSpeed;
    collisionCheck=environment.checkCollision(nextpx,this.y,this.height);
    if(collisionCheck.collision){
     //push along wall
     if(this.ySpeed===0){
      if(collisionCheck.push.indexOf("up")!==-1){
       ySpeed=this.ySpeedPowerHalf;
      }else if(collisionCheck.push.indexOf("down")!==-1){
       ySpeed=-this.ySpeedPowerHalf;
      }
     }
    }else{
     this.x=nextpx;
    }
   }
   if(ySpeed!=0){
    //adjust speed so that moving in diagonal motion aligns with the grid
    var nextpy=this.y-ySpeed;
    collisionCheck=environment.checkCollision(this.x,nextpy,this.height);
    if(collisionCheck.collision){
     //push along wall
     if(this.xSpeed===0){
      if(collisionCheck.push.indexOf("left")!==-1){
       xSpeed=this.xSpeedPowerHalf;
      }else if(collisionCheck.push.indexOf("right")!==-1){
       xSpeed=-this.xSpeedPowerHalf;
      }else{
       xSpeed=0;
      }
      if(xSpeed!=0){
       var nextpx=this.x-xSpeed;
       collisionCheck=environment.checkCollision(nextpx,this.y,this.height);
       if(!collisionCheck.collision){
        this.x=nextpx;
       }
      }
     }
    }else{
     this.y=nextpy;
    }
   }
   // collision detection: ground
   pground=environment.getGround(this.x,this.y);
   if(this.height>pground || this.jumpSpeed!==0){
    this.height+=this.jumpSpeed;
    this.jumpSpeed-=this.gravity;
   }
   if(this.height<=pground){
    this.jumpSpeed=0;
    this.height=pground;
    this.jumpCount=0;
   }
   // detecting "underground"
   if(this.height<-42 ){
    this.isBelowGround=true;
   }else if(this.height>=-30 ){
    this.isBelowGround=false
   }
  }
 };
 player.image.src="./assets/characters/player.png";
 player.marker.src="./assets/misc/player-marker.png";
 return player;
};