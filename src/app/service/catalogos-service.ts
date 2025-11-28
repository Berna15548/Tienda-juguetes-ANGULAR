import { Injectable } from '@angular/core';
import {
  RangoEdad
} from "../interfaces/interfaces";
import { ProductosService } from "./productos-service";
import { Router } from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class CatalogosService {
  public catalogoVisible: string[] = [];

  constructor(
      private productosService: ProductosService,
      private router: Router
  ) {}

  setCatalogo(listaIds: string[]) {
    console.log(`Se llamó a setCatalogo()`);
    this.catalogoVisible = listaIds;
  }

  setCatalogoPorCategoria(categoriaElegida: string): Promise<void> {
    return new Promise(resolve => {
      this.productosService.trendProducts$.subscribe(todosLosProductos => {
        const listaDeIds = todosLosProductos
            .filter(item => item.categoria === categoriaElegida)
            .map(item => item.id);

        this.setCatalogo(listaDeIds);
        resolve();
      }).unsubscribe();
    });
  }

  setCatalogoPorEdades(rango: RangoEdad): Promise<void> {
    console.log("se llamo a setCatalogoPorEdades() : rango = " + rango)
    return new Promise(resolve => {
      this.productosService.trendProducts$.subscribe(productos => {
        const listaDeIds = productos
            .filter(p => p.rango_edades?.trim() === rango)
            .map(p => p.id);

        this.setCatalogo(listaDeIds);
        resolve();
      }).unsubscribe();
    });
  }

  setCatalogoPorMarca(marcaElegida: string): Promise<void> {
    return new Promise(resolve => {
      this.productosService.trendProducts$.subscribe(todosLosProductos => {
        const listaDeIds = todosLosProductos
            .filter(item => item.marca === marcaElegida)
            .map(item => item.id);

        this.setCatalogo(listaDeIds);
        resolve();
      }).unsubscribe();
    });
  }


  setCatalogoPorCartaColeccion(coleccionCarta: string[]){
    this.setCatalogo(coleccionCarta)
  }
  
  async IrACatalogoPorCartaColeccion(coleccionCarta: string[]) {
    this.setCatalogoPorCartaColeccion(coleccionCarta);
    await this.router.navigate(['/catalogos']);
  }

  async irACatalogoPorCategoria(categoria: string) {
    await this.setCatalogoPorCategoria(categoria);
    await this.router.navigate(['/catalogos']);
  }

  async irACatalogoPorEdades(rango: RangoEdad) {
    await this.setCatalogoPorEdades(rango);
    await this.router.navigate(['/catalogos']);
  }

  async irACatalogoPorMarca(marca: string) {
    await this.setCatalogoPorMarca(marca);
    await this.router.navigate(['/catalogos']);
  }


  
  
}
