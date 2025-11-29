import {
  Component,
  OnInit
} from '@angular/core';
import {
  CommonModule,
  NgOptimizedImage
} from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Compras} from "../../service/compras";
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatIconModule } from "@angular/material/icon";
import { ProductosService } from "../../service/productos-service";
import { RouterModule } from '@angular/router';
import {  AuthService} from "../../service/auth-service";
import {  CartComponent} from "../cart-component/cart-component";
import {  MatButton} from "@angular/material/button";
import { CatalogosService } from "../../service/catalogos-service";
import {
  RangoEdad,
  RANGOS_EDAD
} from "../../interfaces/interfaces";

@Component({
  selector: 'app-top-bar',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    MatIconModule,
    FormsModule,
    NgOptimizedImage,
    RouterModule, 
    CartComponent,
    MatButton,
  ],
  templateUrl: './top-bar.html',
  styleUrls: ['./top-bar.scss']
})
export class TopBar implements OnInit{

  mostrarResultados = false;
  timeoutBlur: any;
  categorias: string[] = [];
  rangosEdades: RangoEdad[] = [];
  marcas: string[] = [];
  
  constructor(public productosService: ProductosService, 
              public authService: AuthService,
              public compras: Compras,
              public catalogoService : CatalogosService,

  ) {}

  ngOnInit(): void {
    this.productosService.filtrarProductos();

    this.productosService.trendProducts$.subscribe(productos => {
      const categoriasUnicas = new Set<string>();
      productos.forEach(p => {
        if (p.categoria && p.categoria.trim() !== '') {
          categoriasUnicas.add(p.categoria.trim());
        }
      });
      this.categorias = Array.from(categoriasUnicas).sort(); // opcional: ordenarlas
    });

    this.productosService.trendProducts$.subscribe(productos => {
      const marcasUnicas = new Set<string>();
      productos.forEach(p => {
        if (p.marca && p.marca.trim() !== '') {
          marcasUnicas.add(p.marca.trim());
        }
      });
      this.marcas = Array.from(marcasUnicas).sort(); // opcional: ordenarlas
    });

    this.productosService.trendProducts$.subscribe(productos => {
      const rangos = new Set<RangoEdad>();
      productos.forEach(p => {
        if (p.rango_edades) {
          rangos.add(p.rango_edades);
        }
      });
      // aca ordenamos los rangos segun el interfaz de RANGOS_EDAD
      this.rangosEdades = Array.from(rangos).sort(
          (a, b) => RANGOS_EDAD.indexOf(a) - RANGOS_EDAD.indexOf(b)
      );
    });
    
  }

  ocultarResultadosConDelay() {
    this.timeoutBlur = setTimeout(() => {
      this.mostrarResultados = false;
    }, 200);
  }
  



}


