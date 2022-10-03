import { Injectable } from '@angular/core';
import {
  Auth,
  signInWithEmailAndPassword,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  onAuthStateChanged,
  User,
} from '@angular/fire/auth';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user: User;
  userData$: Observable<User>;
  private user$ = new BehaviorSubject<User>(null);

  constructor(private auth: Auth) {
    this.userData$ = this.user$.asObservable();
  }

  load() {
    try {
      onAuthStateChanged(this.auth, (u) => {
        // console.log('onAuthStateChanged', u?.email);

        this.user = u;
        this.user$.next(u);
      });
    } catch (e) {
      throw e;
    }
  }

  async signup(email: string, password: string) {
    try {
      const uc = await createUserWithEmailAndPassword(
        this.auth,
        email,
        password
      );
      return uc.user;
    } catch (e) {
      throw e;
    }
  }

  async signin(email: string, password: string) {
    try {
      const uc = await signInWithEmailAndPassword(this.auth, email, password);
      return uc.user;
    } catch (e) {
      throw e;
    }
  }
  async signinWithGoogle() {
    try {
      const uc = await signInWithPopup(this.auth, new GoogleAuthProvider());
      return uc.user;
    } catch (e) {
      throw e;
    }
  }

  async signout() {
    await signOut(this.auth);
  }
}
