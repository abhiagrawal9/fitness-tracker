import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';

import { AuthData } from './auth.model';
import { User } from './user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public authChange = new Subject<boolean>();
  private user: User;

  constructor(
    private router: Router,
    private angularFireAuth: AngularFireAuth
  ) {}

  registerUser(authData: AuthData): void {
    this.angularFireAuth
      .createUserWithEmailAndPassword(authData.email, authData.password)
      .then((res) => {
        console.log(res);
        this.authChange.next(true);
        this.router.navigate(['/training']);
      })
      .catch((err) => console.log(err));
  }

  login(authData: AuthData): void {
    this.angularFireAuth
      .signInWithEmailAndPassword(authData.email, authData.password)
      .then((res) => {
        console.log(res);
        this.authChange.next(true);
        this.router.navigate(['/training']);
      })
      .catch((err) => console.log(err));
  }

  logout(): void {
    this.user = null;
    this.authChange.next(false);
    this.router.navigate(['/login']);
  }

  getUser(): User {
    return { ...this.user };
  }

  isAuth(): boolean {
    return !!this.user;
  }
}
