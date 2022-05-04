/**target schema
{
 "version":int,
 "tileData":[][{
  "depth":int,
  "palette":string,
  "objects":[string],
  "collision":bool,//true=cannot walk over;false=can walk over
 }]
}
 */
var currentTileDataVersion=2;
function ensureMapDataUpToDate(mapData){
 if(!mapData){
  throw new Error("Invalid map data. Map data cannot be null");
 }
 if(!mapData.hasOwnProperty("version")){
  throw new Error("Invalid map data. Map data must have a version");
 }
 var mapDataVersion=mapData.version;
 if(mapDataVersion===currentTileDataVersion){
  if(!mapData.hasOwnProperty("tileData") || !mapData.tileData){
   throw new Error("Invalid map data. Map data must have tile data");
  }
  if(!Array.isArray(mapData.tileData)){
   throw new Error("Invalid map data. Tile data must be an array");
  }
  return mapData;
 }
 switch(mapData.version){
  case 1:return upgradeFromV1(mapData);
  default: throw new Error("Unsupported version of tile data: '" + mapData.version + "'");
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