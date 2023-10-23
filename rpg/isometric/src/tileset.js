/**
options:{
 assetsFolder:string,
 tilesFolder:string,
 objectsFolder:string
}
 */
function initTileset(options){
 options=options||{};
 var assetsFolder=options.assetsFolder||"./assets";
 var tilesFolder=options.tilesFolder===null || options.tilesFolder===undefined ? "/tiles" : options.tilesFolder;
 var objectsFolder=options.objectsFolder===null || options.objectsFolder===undefined ? "/objects" : options.objectsFolder;
 var editorFolder=options.editorFolder===null || options.editorFolder===undefined ? "/editor" : options.editorFolder;
 var tileset={
  tileWidth: 64, //const
  tileWidthHalf: 32, //tileW/2; //const
  tileHeight: 32, //const
  tileHeightHalf: 16, //tileH/2; //const
  wallHeight: 32,
  wallHeightHalf: 16, //half wallHeight
  palettes:[],
  objects:[],
  setPalette: function(palette){
   var ground=new Image();
   ground.src=`${assetsFolder}${tilesFolder}/${palette}.png`;
   var sub1=new Image();
   sub1.src=`${assetsFolder}${tilesFolder}/${palette}-1.png`;
   var sub1Left=new Image();
   sub1Left.src=`${assetsFolder}${tilesFolder}/${palette}-1left.png`;
   var sub1Right=new Image();
   sub1Right.src=`${assetsFolder}${tilesFolder}/${palette}-1right.png`;
   var plus1=new Image();
   plus1.src=`${assetsFolder}${tilesFolder}/${palette}+1.png`;
   var shade=new Image();
   shade.src=`${assetsFolder}${tilesFolder}/${palette}-shade.png`;
   this[palette]={
    "0":ground,
    "Sub1":sub1,
    "Sub1Left":sub1Left,
    "Sub1Right":sub1Right,
    "Plus1":plus1,
    "Shade":shade
   };
   this.palettes.push(palette);
  },
  setEditorHighlightPalette: function(palette){
   var ground=new Image();
   ground.src=`${assetsFolder}${editorFolder}/${palette}.png`;
   var sub1=new Image();
   sub1.src=`${assetsFolder}${editorFolder}/${palette}-1.png`;
   var plus1=new Image();
   plus1.src=`${assetsFolder}${editorFolder}/${palette}+1.png`;
   this[palette]={
    "0":ground,
    "Sub1":sub1,
    "Sub1Left":sub1,
    "Sub1Right":sub1,
    "Plus1":plus1,
    "Shade":null
   };
  },
  setObject: function(obj){
   var image=new Image();
   image.src=`${assetsFolder}${objectsFolder}/${obj.imageSrc}`;
   this[obj.key]={
    image,
    obj,
    get xOffset(){return this.obj.xOffset;},
    get yOffset(){return this.obj.yOffset;}
   };
   this.objects.push(obj.key);
  },
  clearPalettesAndObjects: function(){
   this.palettes.forEach(p => delete this[p]);
   this.palettes.length=0;
   this.objects.forEach(o => delete this[o]);
   this.objects.length=0;
  }
 };
 return tileset;
}