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
  selector: 'app-sidenav-list',
  templateUrl: './sidenav-list.component.html',
  styleUrls: ['./sidenav-list.component.scss'],
})
export class SidenavListComponent implements OnInit, OnDestroy {
  @Output() closeSideNav = new EventEmitter<void>();
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

  onCloseSidenav(): void {
    this.closeSideNav.emit();
  }

  onLogout(): void {
    this.onCloseSidenav();
    this.authService.logout();
  }

  ngOnDestroy(): void {
    this.authSub.unsubscribe();
  }
}
