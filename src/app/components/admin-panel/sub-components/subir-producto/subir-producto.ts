import { Component } from '@angular/core';
import {FormsModule} from "@angular/forms";
import {MatAutocomplete} from "@angular/material/autocomplete";
import {MatAutocompleteTrigger} from "@angular/material/autocomplete";
import {MatButton} from "@angular/material/button";
import {MatCard} from "@angular/material/card";
import {MatCardActions} from "@angular/material/card";
import {MatCardContent} from "@angular/material/card";
import {MatCardHeader} from "@angular/material/card";
import {MatCardTitle} from "@angular/material/card";
import {MatDivider} from "@angular/material/divider";
import {MatFormField} from "@angular/material/form-field";
import {MatIcon} from "@angular/material/icon";
import {MatInput} from "@angular/material/input";
import {MatLabel} from "@angular/material/input";
import {MatOption} from "@angular/material/autocomplete";
import {AdminService} from "../../../../service/admin-service";

@Component({
  selector: 'app-subir-producto',
    imports: [
        FormsModule,
        MatAutocomplete,
        MatAutocompleteTrigger,
        MatButton,
        MatCard,
        MatCardActions,
        MatCardContent,
        MatCardHeader,
        MatCardTitle,
        MatDivider,
        MatFormField,
        MatIcon,
        MatInput,
        MatLabel,
        MatOption
    ],
  templateUrl: './subir-producto.html',
  styleUrl: '../../admin-panel.scss',
})
export class SubirProducto {
    
    constructor(public adminService: AdminService) {
    }

}
