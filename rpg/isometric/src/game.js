var green0=new Image();
green0.src="./assets/green.png";
var greenSub1=new Image();
greenSub1.src="./assets/green-1.png";
var greenSub1Left=new Image();
greenSub1Left.src="./assets/green-1left.png";
var greenSub1Right=new Image();
greenSub1Right.src="./assets/green-1right.png";
var greenPlus1=new Image();
greenPlus1.src="./assets/green+1.png";
var greenShade=new Image();
greenShade.src="./assets/green-shade.png";
var blue0=new Image();
blue0.src="./assets/blue.png";
var blueSub1=new Image();
blueSub1.src="./assets/blue-1.png";
var blueSub1Left=new Image();
blueSub1Left.src="./assets/blue-1left.png";
var blueSub1Right=new Image();
blueSub1Right.src="./assets/blue-1right.png";
var bluePlus1=new Image();
bluePlus1.src="./assets/blue+1.png";
var blueShade=new Image();
blueShade.src="./assets/blue-shade.png";
var tileSets={
 tileWidth: 64, //const
 tileWidthHalf: 32, //tileW/2; //const
 tileHeight: 32, //const
 tileHeightHalf: 16, //tileH/2; //const
 wallHeight: 32,
 wallHeightHalf: 16, //half wallHeight
 "green":{
  "0":green0,
  "Sub1":greenSub1,
  "Sub1Left":greenSub1Left,
  "Sub1Right":greenSub1Right,
  "Plus1":greenPlus1,
  "shade":greenShade
 },
 "blue":{
  "0":blue0,
  "Sub1":blueSub1,
  "Sub1Left":blueSub1Left,
  "Sub1Right":blueSub1Right,
  "Plus1":bluePlus1,
  "shade":blueShade
 }
};
var canvas=document.getElementById("tilemap");
var tilemap=canvas.getContext("2d");
var player=getPlayer();
player.x=580;
player.y=630;
var viewport=initViewport(player,canvas);
var keyboardListener=addKeyboardListener(player);
//tile stuff
fetch('http://localhost:9000/assets/tile_depth.json')
  .then(response => response.json())
  .then(tileDepth => {
   var tiles=initTileFunctions(tileSets, tileDepth);
   var renderer=initRenderer(tiles, tilemap, player, viewport);
   var game=initGame(tiles, renderer, player);
   setInterval(game.advanceGameTime, 20);
  });