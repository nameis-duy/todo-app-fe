import { Component, inject, signal, ViewChild } from '@angular/core';
import { SidebarComponent } from "../../shared/components/sidebar/sidebar.component";
import { AccountService } from '../../core/services/account.service';
import { Account } from '../../shared/models/account.model';
import { ToastrService } from 'ngx-toastr';
import { LoaderComponent } from "../../shared/components/loader/loader.component";
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AppConstant } from '../../core/constants/constant';
import { RouterLink } from '@angular/router';
import { ShareService } from '../../core/services/shared.service';

@Component({
  selector: 'app-account',
  imports: [CommonModule, LoaderComponent, ReactiveFormsModule, RouterLink],
  templateUrl: './account.component.html',
  styleUrl: './account.component.scss'
})
export class AccountComponent {
  accountService = inject(AccountService);
  toastr = inject(ToastrService);
  sharedService = inject(ShareService);
  accountInfor: Account | null = null;
  accountInforForm?: FormGroup;

  phoneFormat = AppConstant.PHONE_FORMAT;
  userNameStoringKey = AppConstant.USER_NAME_STORING_KEY;

  @ViewChild(SidebarComponent) sidebarComponent!: SidebarComponent;
  isLoading = signal<boolean>(false);
  isUpdate = signal<boolean>(false);
  isSubmitted = signal<boolean>(false);

  constructor() {
    this.initForm();
  }

  ngOnInit() {
    this.getAccountInfor();
  }

  initForm(account?: Account) {
    this.accountInforForm = new FormGroup({
      firstName: new FormControl(account ? account.firstName : '', {
        validators: [Validators.required, Validators.maxLength(250), Validators.minLength(1)],
        nonNullable: true
      }),
      lastName: new FormControl(account ? account.lastName : '', {
        validators: [Validators.required, Validators.maxLength(100), Validators.minLength(1)],
        nonNullable: true
      }),
      email: new FormControl(account ? account.email : '', {
        validators: [Validators.required, Validators.email],
        nonNullable: true
      }),
      phone: new FormControl(account ? account.phone : '', {
        validators: [Validators.pattern(this.phoneFormat)],
        nonNullable: false
      }),
      id: new FormControl(account?.id)
    })
  }

  getAccountInfor() {
    this.isLoading.set(true);
    this.accountService.getAccountInfor().subscribe({
      next: (res) => {
        if (res.isSucceed) {
          this.accountInfor = res.data;
          this.initForm(this.accountInfor);
        }
        this.isLoading.set(false);
      },
      error: (err) => {
        console.log("Error get account information:" + err);
        this.isLoading.set(false);
        this.toastr.error("Server error", "ERROR");
      }
    })
  }

  updateAccount() {
    this.isLoading.set(true);
    if (this.accountInforForm?.invalid) {
      this.isLoading.set(false);
      this.isSubmitted.set(true);
      return;
    }

    this.accountService.updateAccount(this.accountInforForm?.value).subscribe({
      next: (res) => {
        if (res.isSucceed) {
          this.accountInfor = res.data;
          localStorage.setItem(this.userNameStoringKey, this.accountInfor.lastName);
          this.sharedService.sendMessage(this.accountInfor.lastName);
          this.toastr.success('Update successfully', "Success");
        }
        this.isLoading.set(false);
        this.isSubmitted.set(false);
        this.isUpdate.set(false);
      }, error: (err) => {
        console.log("Error update account information:" + err);
        this.isLoading.set(false);
        this.isSubmitted.set(false);
        this.isUpdate.set(false);
        this.toastr.error("Server error", "ERROR");
      }
    })
  }

  toggleUpdate(status: boolean) {
    if (!status) {
      this.initForm(this.accountInfor!);
    }
    this.isUpdate.set(status);
  }
  
  //GETTER
  get firstName() {
    return this.accountInforForm?.get('firstName');
  }
  
  get lastName() {
    return this.accountInforForm?.get('lastName');
  }
  
  get email() {
    return this.accountInforForm?.get('email');
  }
  
  get phone() {
    return this.accountInforForm?.get('phone');
  }
}