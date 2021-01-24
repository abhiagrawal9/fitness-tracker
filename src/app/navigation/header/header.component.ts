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
  isAuth = false;
  authSub: Subscription;
  @Output() toggleSideNav = new EventEmitter<void>();

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

  ngOnDestroy(): void {
    this.authSub.unsubscribe();
  }

  onLogout(): void {
    this.authService.logout();
  }
}
