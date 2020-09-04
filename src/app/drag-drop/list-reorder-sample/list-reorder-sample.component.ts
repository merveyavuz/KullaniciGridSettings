import {
    Component,
    ElementRef,
    QueryList,
    ViewChild,
    ViewChildren
} from "@angular/core";
import {
    IDragBaseEventArgs,
    IDragMoveEventArgs,
    IgxDragDirective,
    IgxDragLocation
} from "igniteui-angular";

@Component({
    selector: "app-list-reorder-sample",
    templateUrl: "./list-reorder-sample.component.html",
    styleUrls: ["./list-reorder-sample.component.scss"]
})
export class ListReorderSampleComponent {
    @ViewChildren("dragDirRef", { read: IgxDragDirective })
    public dragDirs: QueryList<IgxDragDirective>;

    @ViewChild("listContainer", { read: ElementRef })
    public listContainer: ElementRef;
    classText ="public class User    {        public string Id { get; set; }        public string name { get; set; }         public string created_at { get; set; }        public string updated_at { get; set; }         public string email { get; set; }        public string testanadditionalfield { get; set; } }";

  jsonText: string;
    public kullaniciGridSettings = [];
    Props = [];

    public newIndex = null;
    public animationDuration = 0.3;
    private listItemHeight = 55;

    selectedSetting;
    selectedSettingName;
    selectedType;
    hidden: boolean;
    public items: string[] = ["string", "boolean", "date", "number"];
    selectedSType;

    convert(){
      this.kullaniciGridSettings = [];
      this.Props = [];
      var words = this.classText.match(/("[^"]+"|[^"\s]+)/g);
   
      for(let i = 0; i< words.length; i++){
       if(words[i] === "string"){
           this.Props.push({ propName: "string", prop: words[i+1]})
       }
       else if(words[i] === "DateTime" || words[i] === "DateTime?"){
           this.Props.push({ propName: "date", prop:words[i+1]})
       }
       else if(words[i] === "bool" || words[i] === "bool?"){
           this.Props.push({ propName: "boolean", prop:words[i+1]})
       }
       else if(words[i] === "int" || words[i] === "int?" || words[i] === "decimal"|| words[i] === "decimal?" || words[i] === "double"|| words[i] === "double?"){
           this.Props.push({ propName: "number", prop:words[i+1]})
       }
      }
      let order = 0;
   
      for(let i = 0; i< this.Props.length; i++){
          this.kullaniciGridSettings.push({
              "settingName": this.Props[i].prop,
              "order": i,
              "pinned":false,
              "filterable":true,
              "groupable":false,
              "editable":false,
              "sortable":true,
              "hidden":false,
              "hasSummary":false,
              "resizable":true,
              "movable":true,
              "minWdith":null,
              "maxWidth":"400",
              "width":"200",
              "type":this.Props[i].propName
          })
      }

      this.updateJson();
    }

    idleriCikar(){

      this.kullaniciGridSettings = this.kullaniciGridSettings.filter(x => x.settingName.slice(-2) !== "Id");

      this.kullaniciGridSettings = this.kullaniciGridSettings.filter(x => x.settingName.slice(-2) !== "ID");
    }
    
    updateJson(){
      this.jsonText ="{";
      this.kullaniciGridSettings.forEach(x=>{
          this.jsonText += "\"" +x.settingName+"\":";
          var copied = Object.assign({}, x);
          delete copied.settingName;
          this.jsonText += JSON.stringify(copied, null, 2) +",";
      });
      this.jsonText = this.jsonText.substring(0, this.jsonText.length - 1);
      this.jsonText +="}";

      if(this.kullaniciGridSettings.length === 0){
        this.jsonText ="";
      }
    }

    openEdit(setting){
      this.selectedSetting = setting;
      this.selectedSettingName = setting.settingName;
      this.selectedType = setting.type;
      this.hidden = false;
    }

    iptal(){
       this.selectedSetting = "";
      this.selectedSettingName = "";
      this.selectedType = "";
    }

    updateSetting(){
    let objIndex = this.kullaniciGridSettings.findIndex((obj => obj.order == this.selectedSetting.order));
    
    this.kullaniciGridSettings[objIndex].type = this.selectedType;

    if(this.hidden){
      this.kullaniciGridSettings[objIndex].hidden = "true"
    }else{
       this.kullaniciGridSettings[objIndex].hidden = "false"
    }
    
    
    this.updateJson(); 
    }

    removeSetting(setting){
      this.kullaniciGridSettings = this.kullaniciGridSettings.filter(x => x.order !== setting.order);
      this.updateJson(); 
    }

    public getDragDirectiveRef(id: number): IgxDragDirective {
        return this.dragDirs.find((item) => item.data.id === id);
    }

    public onDragStart(event: IDragBaseEventArgs, dragIndex: number) {
        // Record the current index as basis for moving up/down.
        this.newIndex = dragIndex;
        // Sets specific class when dragging.
        event.owner.data.dragged = true;
    }

    public onDragEnd(event: IDragBaseEventArgs, itemIndex: number) {
        if (this.newIndex !== null) {
            // When we have moved the dragged element up/down, animate it to its new location.
            const moveDown = this.newIndex > itemIndex;
            // If the new position is below add the height moved down, otherwise subtract it.
            const prefix = moveDown ? 1 : -1;
            // The height that the new position differs from the current. We know that each item is 55px height.
            const movedHeight = prefix * Math.abs(this.newIndex - itemIndex) * this.listItemHeight;
            const originLocation = event.owner.originLocation;
            event.owner.transitionTo(
                new IgxDragLocation(originLocation.pageX, originLocation.pageY + movedHeight),
                { duration: this.animationDuration }
            );
        } else {
            // Otherwise animate it to its original position, since it is unchanged.
            event.owner.transitionToOrigin({ duration: this.animationDuration });
        }
    }

    public onTransitioned(event: IDragBaseEventArgs, itemIndex: number) {
        // We can have other items transitioned when they move to free up space where the dragged element would be.
        if (event.owner.data.dragged && this.newIndex != null && this.newIndex !== itemIndex) {
            // If the element finished transitioning is the one were dragging,
            // We can update all elements their new position in the list.
            this.shiftElements(itemIndex, this.newIndex);
            event.owner.setLocation(event.owner.originLocation);
            this.newIndex = null;
        }
        // Disables the specific class when dragging.
        event.owner.data.dragged = false;
    }

    public onDragMove(event: IDragMoveEventArgs, itemIndex: number) {
        const containerPosY = this.listContainer.nativeElement.getBoundingClientRect().top;
        // Relative position of the dragged element to the list container.
        const relativePosY = event.nextPageY - containerPosY;

        let newIndex = Math.floor(relativePosY / this.listItemHeight);
        newIndex = newIndex < 0 ? 0 : (newIndex >= this.kullaniciGridSettings.length ? this.kullaniciGridSettings.length - 1 : newIndex);
        if (newIndex === this.newIndex) {
            // If the current new index is unchanged do nothing.
            return;
        }

        const movingDown = newIndex > itemIndex;
        if (movingDown && newIndex > this.newIndex ||
            (!movingDown && newIndex < this.newIndex && newIndex !== itemIndex)) {
            // If we are moving the dragged element down and the new index is bigger than the current
            // this means that the element we are stepping into is not shifted up and should be shifted.
            // Same if we moving the dragged element up and the new index is smaller than the current.
            const elementToMove = this.getDragDirectiveRef(this.kullaniciGridSettings[newIndex].order);
            const currentLocation = elementToMove.location;
            const prefix = movingDown ? -1 : 1;
            elementToMove.transitionTo(
                new IgxDragLocation(currentLocation.pageX, currentLocation.pageY + prefix * this.listItemHeight),
                { duration: this.animationDuration }
            );
        } else {
            // Otherwise if are moving up but the new index is still bigger than the current, this means that
            // the item we are stepping into is already shifted and should be returned to its original position.
            // Same if we are moving down and the new index is still smaller than the current.
            const elementToMove = this.getDragDirectiveRef(this.kullaniciGridSettings[this.newIndex].order);
            elementToMove.transitionToOrigin({ duration: this.animationDuration });
        }

        this.newIndex = newIndex;
    }

    private shiftElements(draggedIndex: number, targetIndex: number) {
        // Move the dragged element in DOM to the new position.
        const movedElem = this.kullaniciGridSettings.splice(draggedIndex, 1);
        this.kullaniciGridSettings.splice(targetIndex, 0, movedElem[0]);
  
        
        
        

        this.dragDirs.forEach((dir) => {
            if (this.kullaniciGridSettings[targetIndex].order !== dir.data.id) {
                // Reset each element its location since it will be repositioned in the DOM except the element we drag.
                dir.setLocation(dir.originLocation);
                dir.data.shifted = false;
            }
        });     

        this.processJson(draggedIndex, targetIndex)
        this.updateJson(); 
    }

    processJson(draggedIndex, targetIndex){

      [this.kullaniciGridSettings[draggedIndex].order, 
      this.kullaniciGridSettings[targetIndex].order] = [this.kullaniciGridSettings[targetIndex].order, this.kullaniciGridSettings[draggedIndex].order];

       this.kullaniciGridSettings.sort(this.compare);
    }

    compare(a, b) {
    if (a.order < b.order) {
      return -1;
    }
    if (a.order > b.order) {
      return 1;
    }
    return 0;
  }
}
