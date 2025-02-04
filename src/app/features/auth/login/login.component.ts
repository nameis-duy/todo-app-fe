import { Component, inject, NgZone } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthsService } from '../../../core/auth/auths.service';
import { Router, RouterLink } from '@angular/router';
import { JwtService } from '../../../core/services/jwt.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  jwtService = inject(JwtService);
  authService = inject(AuthsService);
  router = inject(Router);
  authForm: FormGroup;

  loginErrorMsg = '';
  ngZone = inject(NgZone);

  constructor() {
    this.authForm = new FormGroup({
      email: new FormControl("", {
        validators: [Validators.required],
        nonNullable: true
      }),
      password: new FormControl("", {
        validators: [Validators.required],
        nonNullable: true
      })
    })
  }

  onSubmit() {
    let observable = this.authService.login(this.authForm.value);
    observable.pipe().subscribe({
      next: (res: any) => {
        if (res) {
          this.jwtService.setToken(res.accessToken);
          this.jwtService.setRefreshToken(res.refreshToken);
          this.router.navigateByUrl('/');
        }
      },
      error: (err) => {
        console.log(err);
        if (err.status === 400) {
          this.ngZone.run(() => {
            this.loginErrorMsg = err.error;
          })
        }
      },
    });
  }

  ngOnInit() {
    const token = this.jwtService.getToken();
    if (token) {
      this.router.navigateByUrl('/');
    }
  }
}