// auth.service.ts
import { Injectable } from '@angular/core';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public auth = getAuth();
  private userSubject = new BehaviorSubject<User | null>(null);
  user$ = this.userSubject.asObservable();

  constructor() {
    onAuthStateChanged(this.auth, (user) => {
      this.userSubject.next(user);
    });
  }

  get currentUser(): User | null {
    return this.userSubject.value;
  }
}
