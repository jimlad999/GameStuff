/**target schema
{
 "version":int,
 "palettes":[string],
 "objects":[{
  "key":string,
  "xOffset":int,
  "yOffset":int,
  "imageSrc":string
 }],
 "tileData":[][{
  "depth":int,
  "palette":string,
  "objects":[string],
  "collision":bool,//true=cannot walk over;false=can walk over
 }]
}
 */
var currentTileDataVersion=3;
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
  case 2:return upgradeFromV2(mapData);
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
 var defaultPalette="green";
 return {
  version:currentTileDataVersion,
  palettes:[defaultPalette],
  objects:[],
  tileData:data.tileDepth.map((r,gy)=>r.map((d,gx)=>{
   return tileData(d,defaultPalette);
  }))
 };
};
function upgradeFromV2(data){
 var p={};
 data.tileData.forEach(r=>r.forEach(d=>p[d.palette]=true));
 return {
  version:currentTileDataVersion,
  palettes:Object.keys(p),
  objects:[],
  tileData:data.tileData
 };
};