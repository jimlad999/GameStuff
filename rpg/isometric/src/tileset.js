function initTileset(assetsFolder){
 assetsFolder=assetsFolder||"./assets";
 var tileset={
  tileWidth: 64, //const
  tileWidthHalf: 32, //tileW/2; //const
  tileHeight: 32, //const
  tileHeightHalf: 16, //tileH/2; //const
  wallHeight: 32,
  wallHeightHalf: 16, //half wallHeight
  setPalette: function(palette){
   var ground=new Image();
   ground.src=`${assetsFolder}/${palette}.png`;
   var sub1=new Image();
   sub1.src=`${assetsFolder}/${palette}-1.png`;
   var sub1Left=new Image();
   sub1Left.src=`${assetsFolder}/${palette}-1left.png`;
   var sub1Right=new Image();
   sub1Right.src=`${assetsFolder}/${palette}-1right.png`;
   var plus1=new Image();
   plus1.src=`${assetsFolder}/${palette}+1.png`;
   var shade=new Image();
   shade.src=`${assetsFolder}/${palette}-shade.png`;
   this[palette]={
    "0":ground,
    "Sub1":sub1,
    "Sub1Left":sub1Left,
    "Sub1Right":sub1Right,
    "Plus1":plus1,
    "Shade":shade
   };
  },
  setObject: function(key,xOffset,yOffset,imageSrc){
   //imageSrc is optional. fall back to image with same name as key
   imageSrc=imageSrc||`${key}.png`;
   var image=new Image();
   image.src=`${assetsFolder}/${imageSrc}`;
   this[key]={
    image,
    xOffset,
    yOffset
   };
  }
 };
 return tileset;
}