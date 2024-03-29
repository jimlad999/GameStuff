function initEnvironment(tileset){
 return {
  tileset,
  mapData:{},
  tileData:[],
  numTilesX:0,
  numTilesY:0,
  update: function(mapData){
   this.mapData=mapData;
   this.tileData=mapData.tileData;
   //assume perfect rectangular/square maps
   this.numTilesX=this.tileData[0].length;
   this.numTilesY=this.tileData.length;
   this.tileset.clearPalettesAndObjects();
   this.mapData.palettes.forEach(p => this.tileset.setPalette(p));
   this.mapData.objects.forEach(o => this.tileset.setObject(o));
  },
  setPalette: function(palette){
   if(this.mapData.palettes.indexOf(palette)===-1){
    this.tileset.setPalette(palette);
    this.mapData.palettes.push(palette);
   }
  },
  setObject: function(obj){
   if(!this.mapData.objects.some(o=>o.key===obj.key)){
    this.tileset.setObject(obj)
    this.mapData.objects.push(obj);
   }
  },
  getTileIndex: function(worldX,worldY){
   //offset world x,y so 0,0 is center of top-left corner tile
   var ox=worldX+tileset.tileWidthHalf;
   var oy=worldY+tileset.tileHeightHalf;
   var gx=Math.floor(ox/tileset.tileWidth);
   var gy=Math.floor(oy/tileset.tileHeight)*2;
   var nx=(ox%tileset.tileWidth)/tileset.tileWidth;
   var ny=(oy%tileset.tileHeight)/tileset.tileHeight;
   var w=nx+ny;
   var v=nx-ny;
   if(w<0.5){--gx;--gy;}
   else if(w>1.5){++gy;}
   else{
    if(v<-0.5){--gx;++gy;}
    else if(v>0.5){--gy;}
   }
   return {x:gx,y:gy,nx,ny,w,v};
  },
  getTileData: function(tile){
   return this.tileData[tile.y][tile.x]
  },
  getTileDataRow: function(tileY){
   return this.tileData[tileY];
  },
  getGroundDepthFromTile: function(tile){
   if(tile.x<0 || tile.y<0 || tile.y>=this.numTilesY || tile.x>=this.numTilesX){
    return 0;
   }else{
    return this.getTileData(tile).depth;
   }
  },
  getGroundFromTileData: function(tileData){
   return !tileData?0:tileData.depth*tileset.wallHeight;
  },
  getGroundFromTile: function(tile){
   return this.getGroundDepthFromTile(tile)*tileset.wallHeight;
  },
  getGround: function(worldX,worldY){
   var tile=this.getTileIndex(worldX,worldY);
   return this.getGroundFromTile(tile);
  },
  isMajorTile: function(tileX,tileY){
   return (tileX*2+tileY)%2===0;
  },
  getPushDirections: function(tile){
   var isTileMajorTile=this.isMajorTile(tile.x,tile.y);
   return (
    isTileMajorTile
    ?tile.nx>0.5
     ?tile.ny>0.5?["right","down"]:["right","up"]
     :tile.ny>0.5?["left","down"]:["left","up"]
    :tile.w>1.5?["left","up"]
     :tile.w<0.5?["right","down"]
      :tile.v>0.5?["left","down"]
       :tile.v<-0.5?["right","up"]
        :[]
   );
  },
  /** return true if collision detected */
  checkCollision: function(worldX,worldY,height){
   var tile=this.getTileIndex(worldX,worldY);
   var tileData=this.getTileData(tile);
   if(tileData.collision){
    return {
     collision:true,
     push:this.getPushDirections(tile)
    };
   }
   var ground=this.getGroundFromTileData(tileData);
   if(height<ground){
    return {
     collision:true,
     push:this.getPushDirections(tile)
    };
   }
   return {
    collision:false,
    push:[]
   };
  },
  getSurroundingTiles: function(centerX,centerY,radius){
   var yRadius=radius*2;
   var isCenterMajorTile=this.isMajorTile(centerX,centerY);
   function getSurroundingTilesInner(x,y){
    var xDiff=x-centerX;
    var xDiffAbs=Math.abs(xDiff);
    var yDiff=y-centerY;
    var yDiffAbs=Math.abs(yDiff);
    var xDiffCheck=isCenterMajorTile?xDiff<0:xDiff>0;
    var xRadius=radius-(xDiffCheck?Math.floor(yDiffAbs/2):Math.ceil(yDiffAbs/2));
    return xDiffAbs<=xRadius && yDiffAbs<=yRadius;
   };
   return getSurroundingTilesInner;
  },
  getPath: function(fromX,fromY,toX,toY){
   var isToMajorTile=this.isMajorTile(toX,toY);
   function getPathRecursive(fromX,fromY,toX,toY,path){
    var yDiff=fromY-toY;
    var yDiffIsEven=(yDiff%2)===0;
    var xDiff=fromX-toX;
    if(xDiff===0){
     var yIncr=yDiff<0?2:-2;
     var y=fromY;
     if(!yDiffIsEven){
      y+=yDiff<0?1:-1;
      path.push({x:fromX,y:fromY});
     }
     for(;y!==toY;y+=yIncr){
      path.push({x:toX,y});
     }
     return path;
    }else if(yDiff===0){
     var x=fromX;
     var xIncr=xDiff<0?1:-1;
     for(;x!==toX;x+=xIncr){
      path.push({x,y:toY});
     }
     return path;
    }else{
     // only recursive branch
     // when the path starts lining up either vertically or horizontally
     // then then it is a straight line so just finish the path off.
     path.push({x:fromX,y:fromY});
     fromY+=yDiff<0?1:-1;
     if(xDiff<0 && yDiffIsEven!==isToMajorTile){
      fromX+=1;
     }else if(xDiff>0 && yDiffIsEven===isToMajorTile){
      fromX-=1;
     }
     return getPathRecursive(fromX,fromY,toX,toY,path);
    }
   };
   return getPathRecursive(fromX,fromY,toX,toY,[]);
  },
  getPathContainsFunc: function(fromX,fromY,toX,toY){
   var path=this.getPath(fromX,fromY,toX,toY);
   function pathContains(x,y){
    return path.some(a => a.x===x && a.y===y);
   };
   return pathContains;
  }
 };
};