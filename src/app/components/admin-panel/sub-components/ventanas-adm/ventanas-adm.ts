import { Component } from '@angular/core';
import { AdminService} from "../../../../service/admin-service";

@Component({
  selector: 'app-ventanas-adm',
  imports: [],
  templateUrl: './ventanas-adm.html',
  styleUrl: '../../admin-panel.scss',
})
export class VentanasAdm {

  constructor(public adminService: AdminService) {
  }


}
