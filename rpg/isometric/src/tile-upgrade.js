/**target schema
{
 "version":int,
 "tileData":[{
  "depth":int,
  "palette":string,
  "objects":[string],
  "collision":bool,//true=cannot walk over;false=can walk over
 }]
}
 */
var currentTileDataVersion=2;
function upgradeTileData(data){
 switch(data.version){
  case 1:return upgradeFromV1(data);
  default: throw new Error("Unsupported version of tile data: '" + data.version + "'");
 }
};
function tileData(depth,palette,objects,collision){
 return {
  depth,
  palette,
  objects:objects||[],
  collision:collision||false
 };
};

//editor helper functions. declared here to be with other "tileData" functions + the schema.
//editor dependency on same method signature. If this is a problem swap to higher order functions.
function updateTileDataDepth(tileData,depth){
 tileData.depth=depth;
};
function updateTileDataPalette(tileData,palette){
 tileData.palette=palette;
};
function updateTileDataObject(tileData,objectKey){
 if(tileData.objects.indexOf(objectKey)===-1){
  tileData.objects.push(objectKey);
 }
};
function updateTileDataCollision(tileData,collision){
 tileData.collision=collision;
};

/**source schema
{
 "version":int,
 "tileDepth":[int]
}
 */
function upgradeFromV1(data){
 return {
  version:currentTileDataVersion,
  tileData:data.tileDepth.map((r,gy)=>r.map((d,gx)=>{
   var palette="green";
   return tileData(d,palette);
  }))
 };
};