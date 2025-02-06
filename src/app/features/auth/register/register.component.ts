import { Component, inject, signal } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { AuthsService } from '../../../core/auth/auths.service';
import { Router, RouterLink } from '@angular/router';
import { JwtService } from '../../../core/services/jwt.service';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { LoaderComponent } from "../../../shared/components/loader/loader.component";

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, RouterLink, CommonModule, LoaderComponent],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  jwtService = inject(JwtService);
  authService = inject(AuthsService);
  toastr = inject(ToastrService);
  router = inject(Router);
  registerForm: FormGroup;

  isSubmitted = false;
  isLoading = signal(false);

  constructor() {
    this.registerForm = new FormGroup({
      firstName: new FormControl('', {
        validators: [Validators.required, Validators.maxLength(250), Validators.minLength(1)],
        nonNullable: true
      }),
      lastName: new FormControl('', {
        validators: [Validators.required, Validators.maxLength(100), Validators.minLength(1)],
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
        validators: [Validators.required],
        nonNullable: true
      }),
    }, { validators: this.confirmPasswordValidator() });
  }

  onSubmit() {
    this.isLoading.set(true);
    if (this.registerForm.invalid) {
      this.isSubmitted = true;
      this.isLoading.set(false);
      return;
    }
    let observable = this.authService.register(this.registerForm.value);
    observable.pipe().subscribe({
      next: (res: any) => {
        if (res.isSucceed) {
          this.toastr.success('Register successfully', 'Success');
          this.router.navigateByUrl('/login');
        }
      },
      error: (err) => {
        this.toastr.error('Server error', 'Error');
        console.log(err);
        this.isLoading.set(false);
        throw err;
      },
    });
  }

  confirmPasswordValidator(): ValidatorFn {
    return (formControl: AbstractControl): ValidationErrors | null => {
      const password = formControl.get('password');
      const confirmPassword = formControl.get('confirmPassword');

      if (!password || !confirmPassword) {
        return null;
      }

      const isMatchedPassword = confirmPassword?.value === password?.value;
      if (isMatchedPassword) {
        return null;
      }
      
      confirmPassword.setErrors({ passwordsNotMatched: true })
      return { passwordsNotMatched: true }
    }
  }

  //GETTER  
  get firstName() {
    return this.registerForm.get('firstName');
  }

  get lastName() {
    return this.registerForm.get('lastName');
  }

  get email() {
    return this.registerForm.get('email');
  }

  get password() {
    return this.registerForm.get('password');
  }

  get confirmPassword() {
    return this.registerForm.get('confirmPassword');
  }
}
