import { Component, DestroyRef, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthsService } from '../services/auths.service';
import { JwtService } from '../services/jwt.service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  jwtService = inject(JwtService);
  destroyRef = inject(DestroyRef);
  authService = inject(AuthsService);
  authForm: FormGroup;

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
        console.log(res);
        this.jwtService.setToken(res.accessToken);
        this.jwtService.setRefreshToken(res.refreshToken);
      },
      error: (err) => {
        console.log(err);
        throw err;
      },
    });
  }
}