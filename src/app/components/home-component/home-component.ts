import { Component } from '@angular/core';
import { TopBar } from "../../share-components/top-bar/top-bar";
import {
  StoreComponent
} from "../store-component/store-component";

@Component({
  selector: 'app-home-component',
  standalone: true,
    imports: [
        StoreComponent,
    ],
  templateUrl: './home-component.html',
  styleUrl: './home-component.scss'
})
export class HomeComponent {
  constructor() {
    console.log('HomeComponent cargado');
  }

}
