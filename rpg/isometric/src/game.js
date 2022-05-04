var tileset=initTileset();
var canvas=document.getElementById("tilemap");
var tilemap=canvas.getContext("2d");
var player=getPlayer();
player.x=580;
player.y=630;
var environment=initEnvironment(tileset);
var viewport=initViewport(player,canvas);
var keyboardListener=addKeyboardListener(player);
viewport.limitToBoundsOfEnvironment(environment);
var mouse=addMouseListener(environment, viewport);
//global editor to enable changing active state through browser console
var editor=initEditor(mouse,environment,canvas);
var renderer=initRenderer(environment, tilemap, player, viewport, mouse, editor);
var game=initGame(environment, renderer, player);
setInterval(function(){
 game.advanceGameTime();
 editor.update();
},20);