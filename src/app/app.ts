import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {TopBar} from "./share-components/top-bar/top-bar";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; // necesario para animaciones



@Component({
  selector: 'app-root',
  imports: [RouterOutlet, 
    TopBar,
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('portafolio-venta-juguetes');
}
