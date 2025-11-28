import { Component } from '@angular/core';
import {  FormsModule} from "@angular/forms";
import { inject } from '@angular/core';
import {
  Firestore,
  collection,
  doc,
  deleteDoc,
  updateDoc,
  addDoc,
} from '@angular/fire/firestore';
import {  Storage, ref, uploadBytes, getDownloadURL} from '@angular/fire/storage';
import {  CommonModule,  NgOptimizedImage} from "@angular/common";
import {  ProductosService} from "../../service/productos-service";
import * as XLSX from 'xlsx'
import {  ColeccionesDeProductosService} from "../../service/colecciones-de-productos-service";
import {  MatFormField,  MatLabel} from "@angular/material/input";
import {  MatOption,  MatSelect} from "@angular/material/select";
import {  MatButton} from "@angular/material/button";
import { NewProductsService } from "../../service/new-products-service";


@Component({
  selector: 'app-admin-panel',
  imports: [
    FormsModule,
    CommonModule,
    MatFormField,
    MatLabel,
    MatSelect,
    MatOption,
    MatButton,
    NgOptimizedImage,
  ],
  templateUrl: './admin-panel.html',
  styleUrl: './admin-panel.scss'
})
export class AdminPanelComponent {
  private firestore = inject(Firestore);
  private storage = inject(Storage);

  constructor(
      public productosService: ProductosService,
      public coleccionesService: ColeccionesDeProductosService,
      public newProductsService: NewProductsService,
  ) {}
  
  // Datos del formulario
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
  mostrarModalGuardar: boolean = false; /*modal elmergente guardar cambios si o no*/
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
      addDoc(collection(this.firestore, 'productos'), data);
    }

    this.resetFormulario();
  }

  async eliminarProductosSeleccionados() {
    if (this.productosService.productosSeleccionados.length === 0) {
      console.log('⚠️ No hay productos seleccionados para eliminar.');
      return;
    }

    const eliminaciones = [];

    for (const p of this.productosService.productosSeleccionados) {
      const docRef = doc(this.firestore, 'productos', p.id);
      try {
        await deleteDoc(docRef);
        console.log(`✅ Producto eliminado: ${p.nombre}`);
      } catch (error) {
        console.error(`❌ Error al eliminar ${p.nombre}:`, error);
      }
      eliminaciones.push(p);
    }

    console.log('🧹 Eliminación múltiple completada.');
    this.productosService.productosSeleccionados = [];
    this.productosService.filtrarProductos(); // Para actualizar la vista si es necesario
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

  /*guardar cambios si o no*/
  abrirModalGuardado() {
    this.mostrarModalGuardar = true;
  }

  cerrarModalGuardado() {
    this.mostrarModalGuardar = false;
  }

  confirmarGuardado() {
    this.guardarCambiosProducto()
    this.mostrarModalGuardar = false;
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
  
  

  protected readonly length = length;
  
}

