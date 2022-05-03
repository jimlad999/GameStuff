function initEditor(mouse,environment,canvas){
 var saveMapData=document.getElementById("save-map-data");
 var loadMapData=document.getElementById("load-map-data");
 var addPalette=document.getElementById("add-palette");
 var addObject=document.getElementById("add-object");
 var addNpc=document.getElementById("add-npc");
 var brushSize=document.getElementById("brush-size");
 var editorPalettes=document.getElementById("editor-palettes");
 var editorObjects=document.getElementById("editor-objects");
 var editorNpcs=document.getElementById("editor-npcs");

 var editor={
  active:true,
  action:null,
  currentSelectedElement:null,
  currentSelectedMode:null,
  currentSelectedKey:null,
  brushSize:1,
  addPaletteToEditor:function(palette){
   var image=environment.tileset[palette]["0"];
   var newElement=document.createElement('palette');
   newElement.id=`palette-${palette}`;
   newElement.dataset.key=palette;
   newElement.style.backgroundImage=`url(${image.src})`;
   newElement.style.width=`${image.width}px`;
   newElement.style.height=`${image.height}px`;
   newElement.addEventListener('click', mouseClickPalette);
   editorPalettes.appendChild(newElement);
  },
  addObjectToEditor:function(objectKey){
   var image=environment.tileset[objectKey].image;
   var newElement=document.createElement('tileobject');
   newElement.id=`mapobject-${objectKey}`;
   newElement.dataset.key=objectKey;
   newElement.style.backgroundImage=`url(${image.src})`;
   newElement.style.width=`${image.width}px`;
   newElement.style.height=`${image.height}px`;
   newElement.addEventListener('click', mouseClickObject);
   editorObjects.appendChild(newElement);
  },
  clearSelection:function(){
   if(this.currentSelectedElement){
   	this.currentSelectedElement.classList.remove("selected");
   }
   this.currentSelectedElement=null;
   this.currentSelectedMode=null;
   this.currentSelectedKey=null;
  },
  updateSelection:function(element, type){
   if(this.currentSelectedElement){
   	this.currentSelectedElement.classList.remove("selected");
   }
   element.classList.add("selected");
   this.currentSelectedElement=element;
   this.currentSelectedMode=type;
   this.currentSelectedKey=element.dataset.key;
  },
  getTileWithinBrushFunc:function(){
   return this.brushSize<2?
    mouse.getEqualFunc():
    environment.getSurroundingTiles(mouse.x,mouse.y,this.brushSize-1);
  },
  update:function(){
   if(this.action==="paint" && this.currentSelectedMode){
    var tilesToUpdate=[];
    if(this.brushSize<2){
     if(mouse.y<environment.tileData.length){
     var r=environment.tileData[mouse.y];
      if(mouse.x<r.length){
       tilesToUpdate.push(r[mouse.x]);
      }
     }
    }else{
     var isTileWithinBrush=this.getTileWithinBrushFunc(),
      brushSize2=this.brushSize*2,
      mouseXstart=mouse.x-brushSize2,
      mouseYstart=mouse.y-brushSize2,
      mouseXend=mouse.x+brushSize2,
      mouseYend=mouse.y+brushSize2,
      maxYlen=environment.tileData.length-1,//-1 because we use <= in for loop
      gy=mouseYstart>0?mouseYstart:0,
      gyEnd=mouseYend<maxYlen?mouseYend:maxYlen;
     for(;gy<=gyEnd;++gy){
      var r=environment.tileData[gy],
       maxXlen=r.length-1,//-1 because we use <= in for loop
       gx=mouseXstart>0?mouseXstart:0,
       gxEnd=mouseXend<maxXlen?mouseXend:maxXlen;
      for(;gx<=gxEnd;++gx){
       if(isTileWithinBrush(gx,gy)){
        tilesToUpdate.push(r[gx]);
       }
      }
     }
    }
    var updateFunction=null;
    switch(this.currentSelectedMode){
     //functions come from tile-upgrade.js
     case "palette":updateFunction=updateTileDataPalette; break;
     case "object":updateFunction=updateTileDataObject; break;
    }
    if(tilesToUpdate.length>0 && updateFunction){
     tilesToUpdate.forEach(tileData => {
      updateFunction(tileData,this.currentSelectedKey);
     });
    }
   }
  }
 };

 function mouseClickPalette(){
  editor.updateSelection(this,"palette");
 }
 function mouseClickObject(){
  editor.updateSelection(this,"object");
 }

 environment.tileset.palettes.forEach(p => editor.addPaletteToEditor(p));
 environment.tileset.objects.forEach(o => editor.addObjectToEditor(o));

 canvas.addEventListener("mousedown",function(){
  editor.action="paint";
 });
 canvas.addEventListener("mouseup",function(){
  if(editor.action==="paint"){
   editor.action=null;
  }
 });
 canvas.addEventListener("mouseout",function(){
  if(editor.action==="paint"){
   editor.action=null;
  }
 });
 document.addEventListener("keydown",function(e){
   switch (e.which) {
    case 27/*escape*/: editor.clearSelection(); break;
    default: return; // exit this handler for other keys
   }
   e.preventDefault();
 });
 addPalette.onchange=function(){
  var palette=this.value.replace(/.*[\/\\]/, '').replace(".png","");
  environment.tileset.setPalette(palette);
  environment.tileset[palette]["0"].addEventListener('load', function(){
   editor.addPaletteToEditor(palette);
  });
 };
 brushSize.onchange=function(){
  var newBrushSize=parseInt(this.value);
  if(newBrushSize>0){
   editor.brushSize=newBrushSize;
  }
 };

 return editor;
}