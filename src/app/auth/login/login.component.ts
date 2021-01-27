import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

import { AuthService } from '../auth.service';
import { UiService } from 'src/app/shared/ui.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
  private loadingStateSub: Subscription;
  loginForm: FormGroup;
  isLoading = false;

  constructor(private authService: AuthService, private uiService: UiService) {}

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.required]),
    });
    this.loadingStateSub = this.uiService.loadingStateChanged.subscribe(
      (loadingState: boolean) => {
        this.isLoading = loadingState;
      }
    );
  }

  onSubmit(): void {
    this.authService.login(this.loginForm.value);
  }

  ngOnDestroy(): void {
    if (this.loadingStateSub) {
      this.loadingStateSub.unsubscribe();
    }
  }
}
