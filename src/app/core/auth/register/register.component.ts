import { Component, inject } from '@angular/core';
import { AbstractControl, EmailValidator, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { JwtService } from '../services/jwt.service';
import { AuthsService } from '../services/auths.service';
import { RegisterRequest } from '../../models/register.model';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  jwtService = inject(JwtService);
  authService = inject(AuthsService);
  registerForm: FormGroup;

  constructor() {
    this.registerForm = new FormGroup({
      firstName: new FormControl('', {
        validators: [Validators.required, Validators.maxLength(250)],
        nonNullable: true
      }),
      lastName: new FormControl('', {
        validators: [Validators.required, Validators.maxLength(100)],
        nonNullable: true
      }),
      email: new FormControl('', {
        validators: [Validators.required, Validators.email],
        nonNullable: true
      }),
      password: new FormControl('', {
        validators: [Validators.required, Validators.minLength(6), Validators.maxLength(50)],
        nonNullable: true
      }),
      confirmPassword: new FormControl('', {
        validators: [Validators.required, this.matchedConfirmPassword()],
        nonNullable: true
      }),
    });
  }

  onSubmit() {
    if (this.registerForm.invalid) return;
    let observable = this.authService.register(this.registerForm.value);
    observable.pipe().subscribe({
      next: (res: any) => {
        if (res.isSucceed) {
          console.log(res.message);
        }
      },
      error: (err) => {
        console.log(err);
        throw err;
      },
    });
  }

  matchedConfirmPassword() : ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      console.log(control.value);
      // if (this.registerForm.value.password == control.value) {
      //   return {confirmPassword: {value: "Confirm password not match with password"}}
      // }
      return null;
    };
  }
}
