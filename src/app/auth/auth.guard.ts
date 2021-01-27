import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
  CanLoad,
  Route,
} from '@angular/router';
import { Observable } from 'rxjs';

import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate, CanLoad {
  constructor(private authService: AuthService, private router: Router) {}

  // Keeping canActivate for knowledge purpose
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    const isAuth = this.authService.isAuth();
    if (isAuth) {
      return true;
    } else {
      this.router.navigate(['login']);
      return false;
    }
  }

  canLoad(route: Route): Observable<boolean> | Promise<boolean> | boolean {
    const isAuth = this.authService.isAuth();
    if (isAuth) {
      return true;
    } else {
      this.router.navigate(['login']);
      return false;
    }
  }
}
