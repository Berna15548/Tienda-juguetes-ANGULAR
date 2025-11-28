
export interface productCollectionCard {
    id?: any;
    name: string;
    description: string;
    image: string;
    lista_productos_coleccion: string[]
}

export interface newProductsCollection {
    id?: any;
    productId: string;
}

export interface Producto {
    id?: any;
    nombre: string;
    precio: number;
    descripcion: string;
    imagen: string;
    categoria: string;
    stock: number;
    seleccionado?: boolean;
    marca: string;
    rango_edades: RangoEdad;
    descuento: number;
}

export const RANGOS_EDAD = [
    "0-3",
    "4-7",
    "8-10",
    "11+",
    "Todas las edades"
] as const; 

export type RangoEdad = typeof RANGOS_EDAD[number];

export interface DatosUsuario {
    mail_usuario: string;
    compras_realizadas: compras_realizadas[];
}

export interface carritoDeCompras {
    id_producto: any;
    cantidad_producto: number;
    valor_total: number;
}

export interface compras_realizadas {
    compra: carritoDeCompras;
    totalCompra: number;
    fecha: Date;
}
