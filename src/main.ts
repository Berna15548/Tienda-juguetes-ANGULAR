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

    //  >>>>>>      REEMPLAZAR CONTENIDO DE firebaseConfig CON TU PROPIO FIREBASE   <<<<<<<
const firebaseConfig = {
    apiKey: "",
    authDomain: "",
    projectId: "",
    storageBucket: "",
    messagingSenderId: "",
    appId: "",
    measurementId: ""
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
