import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthsService } from '../../../core/auth/auths.service';
import { Router, RouterLink } from '@angular/router';
import { JwtService } from '../../../core/services/jwt.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  jwtService = inject(JwtService);
  authService = inject(AuthsService);
  toastr = inject(ToastrService);
  router = inject(Router);
  registerForm: FormGroup;

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
    });
  }

  onSubmit() {
    if (this.registerForm.invalid) {
      alert('invalid information');
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
        throw err;
      },
    });
  }
}
