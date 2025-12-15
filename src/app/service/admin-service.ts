import { Injectable } from '@angular/core';
import {inject} from "@angular/core";
import {Firestore} from "@angular/fire/firestore";
import {Storage} from "@angular/fire/storage";
import {ProductosService} from "./productos-service";
import ColeccionesDeProductosService from "./colecciones-de-productos-service";
import {NewProductsService} from "./new-products-service";
import {ref} from "@angular/fire/storage";
import {uploadBytes} from "@angular/fire/storage";
import {getDownloadURL} from "@angular/fire/storage";
import {updateDoc} from "@angular/fire/firestore";
import {addDoc} from "@angular/fire/firestore";
import * as XLSX from "xlsx";

import { collection, doc, writeBatch } from 'firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  private firestore = inject(Firestore);
  private storage = inject(Storage);
  public allCategories: string[] = [];
  public filteredCategories: string[] = [];

  constructor(
      public productosService: ProductosService,
      public coleccionesService: ColeccionesDeProductosService,
      public newProductsService: NewProductsService,
  ) {this.loadAllCategories();}

  form = {
    id: null,
    nombre: '',
    precio: 0,
    descripcion: '',
    imagen: '',
    categoria: '',
    stock: 0,
  };

  imagenUrl: string = '';
  mostrarResultados = false;
  mostrarResultadosCartasDeColecciones : boolean = false;
  mostrarResultadosEliminarDescuentos = false;
  mostrarResultadosEliminarProductoNuevo = false
  mostrarResultadosAgregarDescuentos = false;
  mostrarResultadosAgregarNuevosProductos = false;
  timeoutBlur: any;
  mostrarModalGuardarEdicion: boolean = false;
  mostrarModalGuardarProducto: boolean = false;
  mostrarModalEliminar: boolean = false;
  mostrarVentanaAdm: boolean = true;


  ocultarResultadosConDelay() {
    this.timeoutBlur = setTimeout(() => {
      this.mostrarResultadosEliminarDescuentos = false;
      this.mostrarResultadosAgregarDescuentos = false;

      this.mostrarResultadosCartasDeColecciones = false;

      this.mostrarResultadosAgregarNuevosProductos = false;
      this.mostrarResultadosEliminarProductoNuevo = false;
    }, 200);
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    const filePath = `imagenes/${Date.now()}_${file.name}`;
    const fileRef = ref(this.storage, filePath);

    uploadBytes(fileRef, file).then(() => {
      getDownloadURL(fileRef).then(url => {
        this.imagenUrl = url;
        this.form.imagen = url;
      });
    });
  }
  
  guardarProductoNuevo(){
    const data = {
      nombre: this.form.nombre,
      precio: this.form.precio,
      descripcion: this.form.descripcion,
      imagen: this.form.imagen,
      categoria: this.form.categoria,
      stock: this.form.stock,
    };
    if (!this.form.id){
      addDoc(collection(this.firestore, 'productos'), data);
    } else {
      console.log("No se pudo guardar producto porque hay un id pendiente")
    }
    
    this.resetFormulario();
  }

  guardarCambiosProducto() {
    const data = {
      nombre: this.form.nombre,
      precio: this.form.precio,
      descripcion: this.form.descripcion,
      imagen: this.form.imagen,
      categoria: this.form.categoria,
      stock: this.form.stock,
    };

    if (this.form.id) {
      const docRef = doc(this.firestore, 'productos', this.form.id);
      updateDoc(docRef, data);
    } else {
      console.log("No se encontro id de producto a editar")
    }

    this.resetFormulario();
  }
  
  vaciarEditor(){
    this.resetFormulario()
  }

  async eliminarProductosSeleccionados() {
    console.log("Se llamó eliminarProductosSeleccionados");

    if (this.productosService.productosSeleccionados.length === 0) {
      console.log('No hay productos seleccionados para eliminar.');
      return;
    }

    const batch = writeBatch(this.firestore);

    for (const p of this.productosService.productosSeleccionados) {
      const productId = p.id;
      if (productId) {
        batch.delete(doc(this.firestore, 'productos', productId));
      }
    }

    await batch.commit();
    console.log('Productos eliminados físicamente');

    await this.coleccionesService.limpiarColeccionesHuerfanas();

    this.productosService.productosSeleccionados = [];
    console.log('Eliminación completa + limpieza de colecciones');
  }
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  


  cargarEnFormulario(p: any) {
    this.form = { ...p };
    this.imagenUrl = p.imagen;
  }

  resetFormulario() {
    this.form = {
      id: null,
      nombre: '',
      precio: 0,
      descripcion: '',
      imagen: '',
      categoria: '',
      stock: 0,
    };
    this.imagenUrl = '';
  }
  
  abrirModalGuardadoEdicion() {
    this.mostrarModalGuardarEdicion = true;
  }

  cerrarModalGuardadoEdicion() {
    this.mostrarModalGuardarEdicion = false;
  }

  confirmarGuardadoEdicion() {
    this.guardarCambiosProducto()
    this.mostrarModalGuardarEdicion = false;
  }


  abrirModalGuardadoProducto() {
    this.mostrarModalGuardarProducto = true;
  }

  cerrarModalGuardadoProducto() {
    this.mostrarModalGuardarProducto = false;
  }

  confirmarGuardadoProducto() {
    this.guardarProductoNuevo()
    this.mostrarModalGuardarProducto = false;
  }
  /*importar archivo base de datos*/
  importarExcel(event: any): void {
    const archivo = event.target.files[0];
    if (!archivo) return;

    const lector = new FileReader();
    lector.onload = (e: any) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });

      const nombreHoja = workbook.SheetNames[0]; // primera hoja
      const hoja = workbook.Sheets[nombreHoja];
      const productos: any[] = XLSX.utils.sheet_to_json(hoja);

      // Ahora podés recorrer e insertar a Firebase
      for (let prod of productos) {
        // Asegurate de que coincidan los campos
        const producto = {
          nombre: prod.nombre,
          precio: Number(prod.precio),
          descripcion: prod.descripcion,
          imagen: prod.imagen || '', // podés dejar vacío o usar una default
          categoria: prod.categoria,
          stock: Number(prod.stock),
          marca: prod.marca,
          rango_edades: prod.rango_edades,
          descuento: prod.descuento,
        };

        // Guardar en Firebase
        this.productosService.agregarArchivoDeProductos(producto)
            .then(() => console.log('Producto agregado'))
            .catch(error => console.error('Error al agregar producto:', error));
      }
    };
    lector.readAsArrayBuffer(archivo);
  }

  seleccionarTodosFiltrados() {
    const todosSeleccionados = this.productosService.productosFiltrados.every(p => p.seleccionado);

    if (todosSeleccionados) {
      this.productosService.productosFiltrados.forEach(p => {
        p.seleccionado = false;
        this.productosService.toggleSeleccion(p, false);
      });
    } else {
      this.productosService.productosFiltrados.forEach(p => {
        if (!p.seleccionado) {
          p.seleccionado = true;
          this.productosService.toggleSeleccion(p, true);
        }
      });
    }
  }


  abrirModalEliminar() {
    this.mostrarModalEliminar = true;
  }

  cerrarModalEliminar() {
    this.mostrarModalEliminar = false;
  }

  confirmarEliminar() {
    this.eliminarProductosSeleccionados()
    this.mostrarModalEliminar = false;
  }

  async agregarNuevaColeccion(
      nombreInput: HTMLInputElement,
      descripcionInput: HTMLInputElement,
      imagenInput: HTMLInputElement
  ) {
    const nuevoObjeto = {
      name: nombreInput.value,
      description: descripcionInput.value,
      image: imagenInput.value,
      lista_productos_coleccion: this.coleccionesService.listaDeIDsProductosParaPushearEnCartaDeColeccion,
    };

    try {
      const id = await this.coleccionesService.agregarColeccion(nuevoObjeto);
      console.log('Nueva coleccion agregada');

      // Limpiar inputs
      nombreInput.value = '';
      descripcionInput.value = '';
      imagenInput.value = '';
      this.coleccionesService.buscadorProductosCartasDeColecciones = ''
      this.coleccionesService.limpiarProductosFiltradosParaCartasDeColecciones()
      this.coleccionesService.listaDeIDsProductosParaPushearEnCartaDeColeccion = []
    } catch (error) {
      console.error('Error agregando producto:', error);
    }
  }

  borrarNuevoProducto(){
    this.newProductsService.borrarProductoDeListaProductosNuevosService()
  }

  loadAllCategories(): void {
    this.productosService.getProductos().subscribe((productos: any[]) => {
      const categories = productos
          .map(p => p.categoria)
          .filter(c => c && c.trim() !== '');

      this.allCategories = Array.from(new Set(categories));
      this.filteredCategories = this.allCategories.slice();
    });
  }

  filterCategories(value: string | null | undefined): void {
    if (!value) {
      this.filteredCategories = this.allCategories.slice();
      return;
    }

    const filterValue = value.toLowerCase();

    this.filteredCategories = this.allCategories.filter(category =>
        category.toLowerCase().includes(filterValue)
    );
  }
  
  
}
