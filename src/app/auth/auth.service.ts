import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';

import { AuthData } from './auth.model';
import { TrainingService } from '../training/training.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public authChange = new Subject<boolean>();
  private isAuthenticated = false;

  constructor(
    private router: Router,
    private angularFireAuth: AngularFireAuth,
    private trainingService: TrainingService
  ) {}

  initAuthentication(): void {
    this.angularFireAuth.authState.subscribe((user) => {
      if (user) {
        this.isAuthenticated = true;
        this.authChange.next(true);
        this.router.navigate(['/training']);
      } else {
        this.trainingService.cancelSubscriptions();
        this.isAuthenticated = false;
        this.authChange.next(false);
        this.router.navigate(['/login']);
      }
    });
  }

  registerUser(authData: AuthData): void {
    this.angularFireAuth
      .createUserWithEmailAndPassword(authData.email, authData.password)
      .then(() => {})
      .catch((err) => console.log(err));
  }

  login(authData: AuthData): void {
    this.angularFireAuth
      .signInWithEmailAndPassword(authData.email, authData.password)
      .then(() => {})
      .catch((err) => console.log(err));
  }

  logout(): void {
    this.angularFireAuth.signOut();
  }

  isAuth(): boolean {
    return this.isAuthenticated;
  }
}
