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
 }
}
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
   // HACK: draw a tree
   var palette="green";
   if (gx===9 && gy===14) {
    var objects=["tree1"];
    palette="blue";
   }else if (gx===9 && gy===23) {
    var objects=["tree1"];
    palette="blue";
   }
   return tileData(d,palette,objects,!!objects);
  }))
 };
}