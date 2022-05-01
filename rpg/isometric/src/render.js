function initRenderer(tiles, tilemap, player, viewport) {
 return {
  seeBehindTileOpacity: 1,
  seeBehindTileOpacityMin: 0.1,
  seeBehindTileOpacityMax: 1,
  drawImage: function(img,x,y){
   tilemap.drawImage(img,x-viewport.x+viewport.widthHalf,y-viewport.y+viewport.heightHalf);
  },
  drawObject: function(imageObject,x,y){
   this.drawImage(imageObject.image,x-imageObject.xOffset,y-imageObject.yOffset);
  },
  drawTile: function(d,x,y,leftAboveD,rightAboveD,tileColour){
   var tileSet=tiles.tileSets[tileColour];
   if(d<0){
    var currentDepth=0;
    for(;currentDepth>d;--currentDepth){
     if(leftAboveD>=currentDepth && rightAboveD>=currentDepth){
      this.drawImage(tileSet["Sub1"],x,y);
     }else if(leftAboveD>=currentDepth){
      this.drawImage(tileSet["Sub1Left"],x,y);
     }else if(rightAboveD>=currentDepth){
      this.drawImage(tileSet["Sub1Right"],x,y);
     }
     y+=tiles.tileSets.wallHeight;
    }
    this.drawImage(tileSet["0"],x,y);
    for(var shadeLevel=0;shadeLevel>d;--shadeLevel){
     this.drawImage(tileSet["shade"],x,y);
    }
    if((leftAboveD<0 && d>leftAboveD) || (rightAboveD<0 && d>rightAboveD)){
     var minDepthEitherSide=rightAboveD==null || leftAboveD<rightAboveD ? leftAboveD : rightAboveD;
     y+=tiles.tileSets.wallHeightHalf;
     for(;currentDepth>minDepthEitherSide;--currentDepth){
      if(leftAboveD>=currentDepth && rightAboveD>=currentDepth){
       this.drawImage(tileSet["Sub1"],x,y);
      }else if(leftAboveD>=currentDepth){
       this.drawImage(tileSet["Sub1Left"],x+tiles.tileSets.tileWidthHalf,y);
      }else if(rightAboveD>=currentDepth){
       this.drawImage(tileSet["Sub1Right"],x-tiles.tileSets.tileWidthHalf,y);
      }
      y+=tiles.tileSets.wallHeight;
     }
    }
   }else if(d>0){
    for(var a=0;a<d;++a){
     y-=tiles.tileSets.wallHeight;
     this.drawImage(tileSet["Plus1"],x,y+tiles.tileSets.wallHeightHalf);
    }
    this.drawImage(tileSet["0"],x,y);
    for(var shadeLevel=0;shadeLevel<d;++shadeLevel){
     this.drawImage(tileSet["shade"],x,y);
    }
   }else{
    this.drawImage(tileSet["0"],x,y);
   }
  },
  updateTerrainOpacity: function(){
   if(player.isBelowGround && this.seeBehindTileOpacity>this.seeBehindTileOpacityMin){
    // slower fade-out of above ground
    this.seeBehindTileOpacity-=0.05;
    if(this.seeBehindTileOpacity<this.seeBehindTileOpacityMin){
     this.seeBehindTileOpacity=this.seeBehindTileOpacityMin;
    }
   }else if(!player.isBelowGround && this.seeBehindTileOpacity<this.seeBehindTileOpacityMax){
    // faster fade-in of above ground so that above ground is revealed faster
    this.seeBehindTileOpacity+=0.15;
    if(this.seeBehindTileOpacity>this.seeBehindTileOpacityMax){
     this.seeBehindTileOpacity=this.seeBehindTileOpacityMax;
    }
   }
  },
  redraw: function(){
   this.updateTerrainOpacity();
   tilemap.clearRect(0,0,viewport.width,viewport.height);
   var playerTile=tiles.getTileIndex(player.x,player.y);
   var isTileWithinPlayerSight=tiles.getSurroundingTiles(playerTile.x,playerTile.y,3);
   var pd=Math.round(player.height/32);
   var drawPlayerMarker=false;
   for(var gy=0;gy<tiles.tileData.length;++gy){
    var r=tiles.tileData[gy];
    var rAbove;
    if(gy>1){
     rAbove=tiles.tileData[gy-1];
    }
    var isEvenRow=gy%2===0;
    var y=(gy-1)*tiles.tileSets.tileHeightHalf;
    for(var gx=0;gx<r.length;++gx){
     var tileData=r[gx];
     var d=tileData.depth;
     var x=isEvenRow ? gx*tiles.tileSets.tileWidth-tiles.tileSets.tileWidthHalf : gx*tiles.tileSets.tileWidth;
     var tileIsWithinPlayerSight=isTileWithinPlayerSight(gx,gy);
     var gx1=null,leftAboveD=null,rightAboveD=null;
     if(d<0 && gy>1){
      if(isEvenRow){
       rightAboveD=rAbove[gx].depth;
       gx1=gx-1 //left/above is previous column for even rows
       if(gx1>=0){
        leftAboveD=rAbove[gx1].depth;
       }
      }else{
       leftAboveD=rAbove[gx].depth;
       gx1=gx+1 //right/above is same column for odd rows
       if(gx1<r.length){
        rightAboveD=rAbove[gx1].depth;
       }
      }
     }
     if(d<0 && player.isBelowGround){
      var clearPathToCurrentSection=tileIsWithinPlayerSight &&
       tiles.getPath(gx,gy,playerTile.x,playerTile.y).every(a => {
        var pathDepth=tiles.tileData[a.y][a.x].depth;
        return pathDepth<0 && (pathDepth-pd)<=2
      });
      if(clearPathToCurrentSection){
       tilemap.globalAlpha=1.0;
      }else{
       tilemap.globalAlpha=this.seeBehindTileOpacity;
       d=0;
      }
     }else{
      tilemap.globalAlpha=this.seeBehindTileOpacity;
      if(player.isBelowGround){
       d=0;
      }
      if(d>=0 && d>pd && !player.isBelowGround &&
       d-pd>2 && gy>playerTile.y && tileIsWithinPlayerSight && Math.abs(gx-playerTile.x)<=1
       ){
       drawPlayerMarker=true;
      }
     }
     this.drawTile(d,x,y,leftAboveD,rightAboveD,tileData.pallete);
     //only draw objects above ground if player is above ground. always draw objects underground as they will be drawn over anyway
     if(d<0 || !player.isBelowGround){
      tileData.objects.forEach(objectKey=>{
       var imageObject=tiles.tileSets[objectKey];
       //d*wallHeight to draw objects on the ground
       //TODO: work out how to draw floating objects?
       this.drawObject(imageObject,x,y+d*tiles.tileSets.wallHeight);
      });
     }
    }
    if(playerTile.y===gy){
     tilemap.globalAlpha=1.0;
     this.drawImage(player.image,player.x-player.xSizeOffset,player.y-player.ySizeOffset-player.height);
    }
   }
   if(drawPlayerMarker){
    tilemap.globalAlpha=1.0;
    this.drawImage(player.marker,player.x-player.markerXSizeOffset,player.y-player.markerYSizeOffset-player.ySizeOffset-player.height-3);
   }
  }
 };
};