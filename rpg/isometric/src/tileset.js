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
 var tileset={
  tileWidth: 64, //const
  tileWidthHalf: 32, //tileW/2; //const
  tileHeight: 32, //const
  tileHeightHalf: 16, //tileH/2; //const
  wallHeight: 32,
  wallHeightHalf: 16, //half wallHeight
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
  setObject: function(key,xOffset,yOffset,imageSrc){
   //imageSrc is optional. fall back to image with same name as key
   imageSrc=imageSrc||`${key}.png`;
   var image=new Image();
   image.src=`${assetsFolder}${objectsFolder}/${imageSrc}`;
   this[key]={
    image,
    xOffset,
    yOffset
   };
   this.objects.push(key);
  },
  palettes:[],
  objects:[]
 };
 return tileset;
}