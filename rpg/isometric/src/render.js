function initRenderer(tiles, tilemap, player, viewport) {
 // TODO: refactor this
 var tree1=new Image();
 tree1.src="./assets/tree-1.png";
 // ===========
 return {
  seeBehindTileOpacity: 1,
  seeBehindTileOpacityMin: 0.1,
  seeBehindTileOpacityMax: 1,
  drawImage: function(img,x,y){
   tilemap.drawImage(img,x,y);
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
  redraw: function(playerTile){
   tilemap.clearRect(0,0,viewport.width,viewport.height);
   var isTileWithinPlayerSight=tiles.getSurroundingTiles(playerTile.x,playerTile.y,3);
   var pd=tiles.tileDepth[playerTile.y][playerTile.x];
   for(var gy=0;gy<tiles.tileDepth.length;++gy){
    var r=tiles.tileDepth[gy];
    var rAbove;
    if(gy>1){
     rAbove=tiles.tileDepth[gy-1];
    }
    var isEvenRow=gy%2===0;
    var y=(gy-1)*tiles.tileSets.tileHeightHalf;
    for(var gx=0;gx<r.length;++gx){
     var d=r[gx];
     var x=isEvenRow ? gx*tiles.tileSets.tileWidth-tiles.tileSets.tileWidthHalf : gx*tiles.tileSets.tileWidth;
     var tileIsWithinPlayerSight=isTileWithinPlayerSight(gx,gy);
     var gx1=null,leftAboveD=null,rightAboveD=null;
     if(d<0 && gy>1){
      if(isEvenRow){
       rightAboveD=rAbove[gx];
       gx1=gx-1 //reuse var. left/above is previous column for even rows
       if(gx1>=0){
        leftAboveD=rAbove[gx1];
       }
      }else{
       leftAboveD=rAbove[gx];
       gx1=gx+1 //reuse var. right/above is same column for odd rows
       if(gx1<r.length){
        rightAboveD=rAbove[gx1];
       }
      }
     }
     if(d<0 && player.isBelowGround){
      var clearPathToCurrentSection=tileIsWithinPlayerSight && (
        (d-pd)<=2 || tiles.getPath(gx,gy,playerTile.x,playerTile.y).every(a => (tiles.tileDepth[a.y][a.x]-pd)<=2)
       );
      if(clearPathToCurrentSection){
       tilemap.globalAlpha=1.0;
      }else{
       tilemap.globalAlpha=this.seeBehindTileOpacity;
       d=0;
      }
     }else{
      tilemap.globalAlpha=this.seeBehindTileOpacity;
     }
     this.drawTile(d,x,y,leftAboveD,rightAboveD,"green");//tileIsWithinPlayerSight?"blue":"green");
     // HACK: draw a tree
     if (gx===9 && gy===14) {
      this.drawImage(tree1,x-16,y-60);
     }
    }
    if(playerTile.y===gy){
     tilemap.globalAlpha=1.0;
     this.drawImage(player.image,player.x-player.xSizeOffset,player.y-player.ySizeOffset+player.height);
    }
   }
  }
 };
};