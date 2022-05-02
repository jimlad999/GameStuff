function initEditor(mouse,environment){
 var saveMapData=document.getElementById("save-map-data");
 var loadMapData=document.getElementById("load-map-data");
 var addPalette=document.getElementById("add-palette");
 var addObject=document.getElementById("add-object");
 var editorPalettes=document.getElementById("editor-palettes");
 var editorObjects=document.getElementById("editor-objects");

 var editor={
  active:true,
  currentSelectedElement:null,
  currentSelectedMode:null,
  currentSelectedKey:null,
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
  clearSelection(){
   if(this.currentSelectedElement){
   	this.currentSelectedElement.classList.remove("selected");
   }
   this.currentSelectedElement=null;
   this.currentSelectedMode=null;
   this.currentSelectedKey=null;
  },
  updateSelection(element, type){
   if(this.currentSelectedElement){
   	this.currentSelectedElement.classList.remove("selected");
   }
   element.classList.add("selected");
   this.currentSelectedElement=element;
   this.currentSelectedMode=type;
   this.currentSelectedKey=element.dataset.key;
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

 return editor;
}