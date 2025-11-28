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
            withRouterConfig({ onSameUrlNavigation: 'reload' }) // esta linea fuerza que se refresque el componente si se vuelve a introducir la url
        ),
        provideFirebaseApp(() => initializeApp(firebaseConfig)),
        provideFirestore(() => getFirestore()),
        provideAuth(() => getAuth()),
        provideStorage(() => getStorage()),
    ]
}).catch(err => console.error(err));
