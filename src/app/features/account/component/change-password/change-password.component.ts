import { Component, inject, signal } from '@angular/core';
import { LoaderComponent } from "../../../../shared/components/loader/loader.component";
import { HeadersComponent } from "../../../../shared/components/headers/headers.component";
import { SidebarComponent } from "../../../../shared/components/sidebar/sidebar.component";
import { Router, RouterLink } from '@angular/router';
import { AccountService } from '../../../../core/services/account.service';
import { ToastrService } from 'ngx-toastr';
import { AuthsService } from '../../../../core/auth/auths.service';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators
} from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-change-password',
  imports: [CommonModule,
    HeadersComponent,
    SidebarComponent,
    RouterLink,
    ReactiveFormsModule, LoaderComponent],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.scss'
})
export class ChangePasswordComponent {
  accountService = inject(AccountService);
  toatrs = inject(ToastrService);
  authService = inject(AuthsService);
  router = inject(Router);

  changePasswordForm?: FormGroup;

  isSubmitted = signal<boolean>(false);
  isLoading = signal<boolean>(false); 

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.changePasswordForm = new FormGroup({
      oldPassword: new FormControl('', {
        validators: [Validators.required, Validators.minLength(6), Validators.maxLength(50)],
        nonNullable: true
      }),
      newPassword: new FormControl('', {
        validators: [Validators.required, Validators.minLength(6), Validators.maxLength(50)],
        nonNullable: true
      }),
      confirmPassword: new FormControl('', {
        validators: [Validators.required],
        nonNullable: true
      }),
    }, { validators: this.confirmPasswordValidator() })
  }

  changePassword() {
    this.isLoading.set(true);

    if (this.changePasswordForm?.invalid) {
      this.isLoading.set(false);
      this.isSubmitted.set(true);
      return;
    }

    this.accountService.changePassword(this.changePasswordForm?.value).subscribe({
      next: (res) => {
        if (res.isSucceed) {
          this.authService.logout();
          this.router.navigateByUrl("/login");
          this.toatrs.success("Change password successfully", "Success");
        }
      },
      error: (err) => {
        console.log("Error while change password: " + err);
        this.toatrs.error("Server error", "Error");
        this.isLoading.set(false);
      }
    })
  }

  confirmPasswordValidator(): ValidatorFn {
    return (formControl: AbstractControl): ValidationErrors | null => {
      const password = formControl.get('newPassword');
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
  get oldPassword() {
    return this.changePasswordForm?.get('oldPassword');
  }

  get newPassword() {
    return this.changePasswordForm?.get('newPassword');
  }
  get confirmPassword() {
    return this.changePasswordForm?.get('confirmPassword');
  }
}
