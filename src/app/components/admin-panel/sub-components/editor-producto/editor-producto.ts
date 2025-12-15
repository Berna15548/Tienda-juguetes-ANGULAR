import { Component } from '@angular/core';
import {AdminService} from "../../../../service/admin-service";
import {FormsModule} from "@angular/forms";
import {MatCard} from "@angular/material/card";
import {MatCardTitle} from "@angular/material/card";
import {MatCardContent} from "@angular/material/card";
import {MatCardActions} from "@angular/material/card";
import {MatButton} from "@angular/material/button";
import {MatDivider} from "@angular/material/divider";
import {MatIcon} from "@angular/material/icon";
import {MatInput} from "@angular/material/input";
import {MatFormField} from "@angular/material/input";
import {MatLabel} from "@angular/material/input";
import {MatCardHeader} from "@angular/material/card";
import {MatAutocompleteTrigger} from "@angular/material/autocomplete";
import {MatAutocomplete} from "@angular/material/autocomplete";
import {MatOption} from "@angular/material/autocomplete";
import {MatIconButton} from "@angular/material/button";
import {MatMiniFabButton} from "@angular/material/button";

@Component({
  selector: 'app-editor-producto',
  imports: [
    FormsModule,
    MatCard,
    MatCardTitle,
    MatCardContent,
    MatCardActions,
    MatButton,
    MatDivider,
    MatIcon,
    MatInput,
    MatFormField,
    MatLabel,
    MatCardHeader,
    MatAutocompleteTrigger,
    MatAutocomplete,
    MatOption,

  ],
  templateUrl: './editor-producto.html',
  styleUrl: '../../admin-panel.scss',
})
export class EditorProducto {

  constructor(public adminService: AdminService) {
  }
  
  

}
