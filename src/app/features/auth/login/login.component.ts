import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthsService } from '../../../core/auth/auths.service';
import { Router, RouterLink } from '@angular/router';
import { JwtService } from '../../../core/services/jwt.service';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { LoaderComponent } from "../../../shared/components/loader/loader.component";

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink, CommonModule, LoaderComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  jwtService = inject(JwtService);
  authService = inject(AuthsService);
  toastr = inject(ToastrService);
  router = inject(Router);
  authForm: FormGroup;

  loginErrorMsg = signal('');
  isLoading = signal(false);

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
    this.isLoading.set(true);
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
          this.loginErrorMsg.set(err.error);
          this.isLoading.set(false);
        }
        else {
          this.toastr.error('Server error', 'Error');
          this.isLoading.set(false);
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