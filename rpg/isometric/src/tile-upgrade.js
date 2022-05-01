/**target schema
{
 "version":int,
 "tileData":[{
  "depth":int,
  "pallete":string,
  "objects":[string],
  "collision":bool,//true=cannot walk over;false=can walk over
 }]
}
 */
function upgradeTileData(data){
 switch(data.version){
  case 1:return upgradeFromV1(data);
  default: throw new Error("Unsupported version of tile data: '" + data.version + "'");
 }
};
function tileData(depth,pallete,objects,collision){
 return {
  depth,
  pallete,
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
  version:data.version,
  tileData:data.tileDepth.map((r,gy)=>r.map((d,gx)=>{
   // HACK: draw a tree
   if (gx===9 && gy===14) {
    var objects=["tree1"];
   }
   return tileData(d,"green",objects,!!objects);
  }))
 };
}