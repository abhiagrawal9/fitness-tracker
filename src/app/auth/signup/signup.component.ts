import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';

import { AuthService } from '../auth.service';
import { UiService } from 'src/app/shared/ui.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent implements OnInit, OnDestroy {
  private loadingStateSub: Subscription;
  maxDate: Date;
  isLoading = false;

  constructor(private authService: AuthService, private uiService: UiService) {}

  ngOnInit(): void {
    this.maxDate = new Date();
    this.maxDate.setFullYear(this.maxDate.getFullYear() - 18);
    this.loadingStateSub = this.uiService.loadingStateChanged.subscribe(
      (loadingState: boolean) => {
        this.isLoading = loadingState;
      }
    );
  }

  onSubmit(form: NgForm): void {
    this.authService.registerUser({
      email: form.value.email,
      password: form.value.password,
    });
  }

  ngOnDestroy(): void {
    if (this.loadingStateSub) {
      this.loadingStateSub.unsubscribe();
    }
  }
}
