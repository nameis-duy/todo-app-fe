import { Component, inject, signal } from '@angular/core';
import { HeadersComponent } from "../../shared/components/headers/headers.component";
import { SidebarComponent } from "../../shared/components/sidebar/sidebar.component";
import { AccountService } from '../../core/services/account.service';
import { Account } from '../../shared/models/account.model';
import { ToastrService } from 'ngx-toastr';
import { LoaderComponent } from "../../shared/components/loader/loader.component";
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-account',
  imports: [CommonModule, HeadersComponent, SidebarComponent, LoaderComponent, ReactiveFormsModule],
  templateUrl: './account.component.html',
  styleUrl: './account.component.scss'
})
export class AccountComponent {
  accountService = inject(AccountService);
  toastr = inject(ToastrService);
  accountInfor: Account | null = null;
  accountInforForm?: FormGroup;

  isLoading = signal<boolean>(false);
  isUpdate = signal<boolean>(false);

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
        validators: [Validators.required],
        nonNullable: true
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

  toggleUpdate(status: boolean) {
    if (!status) {
      this.initForm(this.accountInfor!);
    }
    this.isUpdate.set(status);
  }
}
