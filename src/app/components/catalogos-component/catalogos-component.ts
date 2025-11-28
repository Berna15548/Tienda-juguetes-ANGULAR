import { Component, OnInit, OnDestroy } from '@angular/core';
import { CatalogosService } from "../../service/catalogos-service";
import { Producto } from "../../interfaces/interfaces";
import { ProductosService } from "../../service/productos-service";
import { ActivatedRoute, NavigationEnd, Router } from "@angular/router";
import { Subscription } from "rxjs";
import { filter } from "rxjs/operators";
import {
  ProductCard
} from "../../share-components/product-card/product-card";

@Component({
  selector: 'app-catalogos-component',
  templateUrl: './catalogos-component.html',
  imports: [
    ProductCard
  ],
  styleUrl: './catalogos-component.scss'
})
export class CatalogosComponent implements OnInit, OnDestroy {
  public listaCatalogo: Producto[] = [];
  private subs: Subscription = new Subscription();

  constructor(
      private catalogosService: CatalogosService,
      private productosService: ProductosService,
      private router: Router
  ) {}

  ngOnInit(): void {
    // primera carga
    this.acutalizarListaCatalogo();

    // volver a cargar cuando se refresca el componente
    this.subs.add(
        this.router.events
            .pipe(filter(event => event instanceof NavigationEnd))
            .subscribe(() => {
              this.acutalizarListaCatalogo();
            })
    );
  }

  acutalizarListaCatalogo() {
    console.log("se llamo a acutalizarListaCatalogo()");
    this.listaCatalogo = [];

    this.productosService.trendProducts$.subscribe(todosLosProductos => {
      this.listaCatalogo = todosLosProductos.filter(producto =>
          this.catalogosService.catalogoVisible.includes(producto.id)
      );
    });
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
