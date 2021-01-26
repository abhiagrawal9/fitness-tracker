import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { Subscription } from 'rxjs';

import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  @Output() toggleSideNav = new EventEmitter<void>();
  isAuth = false;
  authSub: Subscription;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authSub = this.authService.authChange.subscribe(
      (isAuthenticated: boolean) => {
        this.isAuth = isAuthenticated;
      }
    );
  }

  onToggleSidenav(): void {
    this.toggleSideNav.emit();
  }

  onLogout(): void {
    this.authService.logout();
  }

  ngOnDestroy(): void {
    this.authSub.unsubscribe();
  }
}
