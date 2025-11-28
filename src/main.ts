import { bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/app';
import {
    provideRouter,
    withRouterConfig
} from '@angular/router';
import { routes } from './app/app.routes';

import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideStorage, getStorage } from '@angular/fire/storage';

const firebaseConfig = {
    apiKey: "AIzaSyAyi8zxqje3IKoAEeEeXNARiQmlFuWna-E",
    authDomain: "tienda-juguetes.firebaseapp.com",
    projectId: "tienda-juguetes",
    storageBucket: "tienda-juguetes.firebasestorage.app",
    messagingSenderId: "481781740553",
    appId: "1:481781740553:web:01ea86a671e146a0a9f4d8",
    measurementId: "G-N0YDLQ4QC9"
};

bootstrapApplication(App, {
    providers: [
        provideRouter(
            routes,
            withRouterConfig({ onSameUrlNavigation: 'reload' })
        ),
        provideFirebaseApp(() => initializeApp(firebaseConfig)),
        provideFirestore(() => getFirestore()),
        provideAuth(() => getAuth()),
        provideStorage(() => getStorage()),
    ]
}).catch(err => console.error(err));
