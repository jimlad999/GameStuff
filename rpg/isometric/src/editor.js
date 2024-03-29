function initEditor(mouse,environment,canvas){
 var mapDataFilename=document.getElementById("map-data-filename");
 var saveMapData=document.getElementById("save-map-data");
 var loadMapData=document.getElementById("load-map-data");
 var addPalette=document.getElementById("add-palette");
 var addObject=document.getElementById("add-object");
 var addNpc=document.getElementById("add-npc");
 var brushSize=document.getElementById("brush-size");
 var highlightSelected=document.getElementById("editor-highlight-selected");
 var editorPalettes=document.getElementById("editor-palettes");
 var editorObjects=document.getElementById("editor-objects");
 var editorNpcs=document.getElementById("editor-npcs");
 var editorInfoDepth=document.getElementById("editor-info-depth");
 var editorInfoPalette=document.getElementById("editor-info-palette");
 var editorInfoX=document.getElementById("editor-info-x");
 var editorInfoY=document.getElementById("editor-info-y");
 var editorInfoMajor=document.getElementById("editor-info-major");
 var editorModePaint=document.getElementById("editor-mode-paint");
 var editorModeFlatten=document.getElementById("editor-mode-flatten");
 var lastMouseX,lastMouseY;

 //init editor assets
 environment.tileset.setEditorHighlightPalette("editor-highlight");

 var editor={
  active:true,
  action:null,
  currentSelectedElement:null,
  currentSelectedMode:null,
  currentSelectedKey:null,
  brushSize:1,
  highlightPalette:"editor-highlight",
  highlightSelectedTiles:false,
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
  getTilesToUpdate:function(){
   var tilesToUpdate=[];
   if(this.brushSize<2){
    if(mouse.y<environment.numTilesY){
    var r=environment.getTileDataRow(mouse.y);
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
     maxYlen=environment.numTilesY-1,//-1 because we use <= in for loop
     gy=mouseYstart>0?mouseYstart:0,
     gyEnd=mouseYend<maxYlen?mouseYend:maxYlen;
    for(;gy<=gyEnd;++gy){
     var r=environment.getTileDataRow(gy),
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
   return tilesToUpdate;
  },
  update:function(){
   if(this.action!==null){
    var updateFunction=null;
    if(this.action==="paint" && this.currentSelectedMode && typeof this.currentSelectedKey === "string"){
     switch(this.currentSelectedMode){
      //functions come from tile-upgrade.js
      case "palette":updateFunction=updateTileDataPalette; break;
      case "object":updateFunction=updateTileDataObject; break;
     }
    }else if(this.action==="flatten" && typeof this.currentSelectedKey === "number"){
     updateFunction=updateTileDataDepth;
    }
    if(updateFunction && this.currentSelectedKey!==null){
     var tilesToUpdate=this.getTilesToUpdate();
     if(tilesToUpdate.length>0){
      tilesToUpdate.forEach(tileData => {
       updateFunction(tileData,this.currentSelectedKey);
      });
     }
    }
   }else if(lastMouseX!==mouse.x || lastMouseY!==mouse.y){
    lastMouseX=mouse.x;
    lastMouseY=mouse.y;
    var r=environment.getTileDataRow(mouse.y);
    if(r){
     var tile=r[mouse.x];
     if(tile){
      editorInfoX.textContent=mouse.x;
      editorInfoY.textContent=mouse.y;
      editorInfoDepth.textContent=tile.depth;
      editorInfoPalette.textContent=tile.palette;
      editorInfoMajor.textContent=environment.isMajorTile(mouse.x,mouse.y);
     }
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
  if(editorModePaint.checked){
   editor.action="paint";
  }else if(editorModeFlatten.checked){
   var tileData=environment.getTileData(mouse);
   editor.currentSelectedKey=tileData.depth;
   editor.action="flatten";
  }
 });
 canvas.addEventListener("mouseup",function(){
  if(editor.action!==null){
   editor.action=null;
  }
 });
 canvas.addEventListener("mouseout",function(){
  if(editor.action!==null){
   editor.action=null;
  }
 });
 canvas.addEventListener("wheel",function(e){
  var updateFunction;
  //functions come from tile-upgrade.js
  if(e.deltaY<0){
   updateFunction=updateTileDataDepthDecrease;
  }else if(e.deltaY>0){
   updateFunction=updateTileDataDepthIncrease;
  }
  if(updateFunction){
   var tilesToUpdate=editor.getTilesToUpdate();
   if(tilesToUpdate.length>0){
    tilesToUpdate.forEach(tileData => {
     updateFunction(tileData);
    });
   }
  }
 });
 document.addEventListener("keydown",function(e){
   switch (e.which) {
    case 27/*escape*/: editor.clearSelection(); break;
    default: return; // exit this handler for other keys
   }
   e.preventDefault();
 });
 saveMapData.addEventListener("click",function(){
  var file = new Blob([JSON.stringify(environment.mapData)], {type: "application/json"});
  var filename=mapDataFilename.value||"new_map_data";
  var a = document.createElement("a"),
  url = URL.createObjectURL(file);
  a.href = url;
  a.download = `${filename}.json`;
  document.body.appendChild(a);
  a.click();
  setTimeout(function(){
   document.body.removeChild(a);
   window.URL.revokeObjectURL(url);
  },0);
 });
 loadMapData.onchange=function(e){
  var filename=this.value.replace(/.*[\/\\]/, '').replace(".json","");
  mapDataFilename.value=filename;
  var reader=new FileReader()
  reader.onload=function(e) {
   environment.tileset.palettes.forEach(p=>document.getElementById(`palette-${p}`).remove());
   environment.tileset.objects.forEach(o=>document.getElementById(`mapobject-${o}`).remove());
   environment.update(ensureMapDataUpToDate(JSON.parse(e.target.result)));
   setTimeout(function(){
    environment.tileset.palettes.forEach(p => editor.addPaletteToEditor(p));
    environment.tileset.objects.forEach(o => editor.addObjectToEditor(o));
   },10);
  };
  reader.readAsText(e.target.files[0])
 };
 addPalette.onchange=function(){
  var palette=this.value.replace(/.*[\/\\]/, '').replace(".png","");
  environment.setPalette(palette);
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
 highlightSelected.addEventListener("click",function(){
  editor.highlightSelectedTiles=this.checked;
 });
 editorModePaint.onchange=function(){
  editor.clearSelection();
 };
 editorModeFlatten.onchange=function(){
  editor.clearSelection();
 };

 return editor;
}