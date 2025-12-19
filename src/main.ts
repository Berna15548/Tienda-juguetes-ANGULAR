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
    apiKey: "AIzaSyDwjMyEQ5FXik3bxCVrnIS1ohy-K6oUru8",
    authDomain: "mcfirebase-46ada.firebaseapp.com",
    projectId: "mcfirebase-46ada",
    storageBucket: "mcfirebase-46ada.firebasestorage.app",
    messagingSenderId: "726427296452",
    appId: "1:726427296452:web:795bc5b39438e644e91f91"
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
