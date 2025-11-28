const admin = require("firebase-admin");
const fs = require("fs");
const csv = require("csv-parser");

//  >>>>>>>>>>>>>>>> REEMPLAZAR DATOS DE serviceAccountKey.json CON EL SDK DE TU FIREBASE <<<<<<<<<<<
const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

fs.createReadStream("productos.csv")
    .pipe(csv())
    .on("data", async (data) => {
        try {
            await db.collection("productos").add({
                nombre: data.nombre,
                precio: parseFloat(data.precio),
                descripcion: data.descripcion,
                imagen: data.imagen,
                stock: parseInt(data.stock),
                categoria: data.categoria
            });
            console.log("Producto agregado:", data.nombre);
        } catch (error) {
            console.error("Error al agregar producto:", error);
        }
    })
    .on("end", () => {
        console.log("Carga completa de productos.");
    });
