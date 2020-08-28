import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { AppComponent } from "./app.component";
import { 
	IgxDragDirective,
	IgxDropDirective,
	IgxIconModule,
	IgxListModule,
	IgxDragDropModule,
IgxButtonModule,
IgxDialogModule,
IgxInputGroupModule,
IgxCheckboxModule,
IgxSelectModule
 } from "igniteui-angular";
import { ListReorderSampleComponent } from "./drag-drop/list-reorder-sample/list-reorder-sample.component";



@NgModule({
  bootstrap: [AppComponent],
  declarations: [
    AppComponent,
		ListReorderSampleComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
		IgxIconModule,
		IgxListModule,
		IgxDragDropModule,
    IgxButtonModule, 
		IgxDialogModule,
		IgxInputGroupModule,    
		IgxCheckboxModule,
		IgxSelectModule,
    FormsModule
  ],
  providers: [],
  entryComponents: [],
  schemas: []
})
export class AppModule {}
