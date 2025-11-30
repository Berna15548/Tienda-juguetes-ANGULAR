import { Component } from '@angular/core';
import {AdminService} from "../../../../service/admin-service";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-editor-producto',
  imports: [
    FormsModule
  ],
  templateUrl: './editor-producto.html',
  styleUrl: '../../admin-panel.scss',
})
export class EditorProducto {

  constructor(public adminService: AdminService) {
  }
  
  

}
