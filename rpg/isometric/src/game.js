var tileset=initTileset();
tileset.setPalette("green");
tileset.setPalette("blue");
tileset.setObject("tree1",16,48,"tree-1.png");
var canvas=document.getElementById("tilemap");
var tilemap=canvas.getContext("2d");
var player=getPlayer();
player.x=580;
player.y=630;
var viewport=initViewport(player,canvas);
var keyboardListener=addKeyboardListener(player);
//global editor to enable changing active state through browser console
var editor=null;
fetch('http://localhost:9000/assets/tile_depth.json')
  .then(response => response.json())
  .then(data => {
   var environment=initEnvironment(tileset, upgradeTileData(data));
   var mouse=addMouseListener(environment, viewport);
   editor=initEditor(mouse,environment);
   var renderer=initRenderer(environment, tilemap, player, viewport, mouse, editor);
   var game=initGame(environment, renderer, player);
   setInterval(game.advanceGameTime, 20);
  });