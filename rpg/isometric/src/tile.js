function initTileFunctions(tileSets, tileData){
 return {
  tileSets,
  tileData:tileData.tileData,
  getTileIndex: function(x,y){
   //offset x,y so 0,0 is center of top-left corner tile
   var ox=x+tileSets.tileWidthHalf;
   var oy=y+tileSets.tileHeightHalf;
   var gx=Math.floor(ox/tileSets.tileWidth);
   var gy=Math.floor(oy/tileSets.tileHeight)*2;
   var nx=(ox%tileSets.tileWidth)/tileSets.tileWidth;
   var ny=(oy%tileSets.tileHeight)/tileSets.tileHeight;
   var w=nx+ny;
   if(w<0.5){--gx;--gy;}
   else if(w>1.5){++gy;}
   else{
    var v=nx-ny;
    if(v<-0.5){--gx;++gy;}
    else if(v>0.5){--gy;}
   }
   return {x:gx,y:gy};
  },
  getGroundDepthFromTile: function(tile){
   if(tile.x<0 || tile.y<0 || tile.y>=this.tileData.length || tile.x>=this.tileData[0].length){
    return 0;
   }else{
    return this.tileData[tile.y][tile.x].depth;
   }
  },
  getGroundFromTile: function(tile){
   return this.getGroundDepthFromTile(tile)*32;
  },
  getGround: function(x,y){
   var tile=this.getTileIndex(x,y);
   return this.getGroundFromTile(tile);
  },
  isMajorTile: function(x,y){
   return (x*2+y)%2===0;
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