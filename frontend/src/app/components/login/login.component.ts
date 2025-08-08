import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule
  ],
  template: `
    <div class="login-container">
      <mat-card class="login-card">
        <h1>{{ 'LOGIN.TITLE' | translate }}</h1>
        <form [formGroup]="form" (ngSubmit)="onSubmit()">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>{{ 'LOGIN.EMAIL' | translate }}</mat-label>
            <input matInput formControlName="email" type="email" required />
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>{{ 'LOGIN.PASSWORD' | translate }}</mat-label>
            <input matInput formControlName="password" type="password" required />
          </mat-form-field>

          <button mat-raised-button color="primary" class="full-width" type="submit" [disabled]="form.invalid">
            {{ 'LOGIN.SUBMIT' | translate }}
          </button>
        </form>
      </mat-card>
    </div>
  `,
  styles: [`
    .login-container {
      padding: 80px 0;
      min-height: calc(100vh - 64px);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .login-card {
      width: 100%;
      max-width: 400px;
      padding: 20px;
    }

    .full-width {
      width: 100%;
    }

    h1 {
      text-align: center;
      margin-bottom: 1rem;
    }
  `]
})
export class LoginComponent {
  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {}

  onSubmit() {
    if (this.form.valid) {
      const { email, password } = this.form.value;
      this.auth.login(email!, password!).subscribe(() => {
        this.router.navigate(['/admin']);
      });
    }
  }
}
