import { CommonModule } from '@angular/common';
import * as UC from '@uploadcare/file-uploader';
import {
  ChangeDetectionStrategy,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  ElementRef,
  inject, signal,
  ViewChild
} from '@angular/core';
import {
  AbstractControl,
  FormControl, FormGroup, FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BaseService } from '../../../core/services/base.service';
import { ToastrService } from 'ngx-toastr';
import { AppConstant } from '../../../core/constants/constant';
import { Task } from '../../models/task.model';
import { Dictionary } from '../../models/dictionary.model';
import { MAT_DIALOG_DATA, MatDialogClose, MatDialogRef } from '@angular/material/dialog';

UC.defineComponents(UC);

@Component({
  selector: 'app-form-modal',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    ReactiveFormsModule,
    CommonModule,
    MatDialogClose
  ],
  templateUrl: './form-modal.component.html',
  styleUrl: './form-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class FormModalComponent {
  baseService = inject(BaseService);
  toastr = inject(ToastrService);
  priorityStoredKey = AppConstant.PRIORITY_STORING_KEY;

  /* INPUT SECTION */
  data = inject(MAT_DIALOG_DATA);
  formDialogRef = inject(MatDialogRef<FormModalComponent>);
  inputData: any;
  task = signal<Task | undefined>(undefined);
  isUpdate = signal<boolean>(false);
  formTitle = signal<string>('Add New Task');

  /* Variable Declaration */
  priorities: Dictionary[] = [];
  taskForm?: FormGroup;
  isSubmitted = false;
  uploadedImageUrl = signal<string>('');
  uploadedFiles: UC.OutputFileEntry<'success'>[] = [];
  @ViewChild('config', { static: true }) imageUploadConfigRef!: ElementRef<InstanceType<UC.Config>>;
  @ViewChild('ctxProvider', { static: true }) ctxProviderRef!: ElementRef<InstanceType<UC.UploadCtxProvider>>;

  constructor() {
    this.getPriorities();
    this.createForm();
  }

  ngOnInit() {
    this.ctxProviderRef.nativeElement.addEventListener('change', this.handleFileUploadChangeEvent);
    if (this.data) {
      this.isUpdate.set(this.data.isUpdate);
      this.formTitle.set(this.data.formTitle);
      this.task.set(this.data.task);
      if (!this.isUpdate()) {
        this.taskForm?.get('expiredAt')?.setValue(this.formatDateString(new Date()));
      } else {
        this.createForm(this.task(), this.isUpdate());
      }
    }

    this.imageUploadConfigRef.nativeElement.localeDefinitionOverride = {
      en: {
        'photo__one': 'photo',
        'photo__many': 'photos',
        'photo__other': 'photos',

        'multiple': 'false',
        'upload-file': 'Browse',
        'upload-files': 'Browse',
        'choose-file': 'Choose photo',
        'choose-files': 'Choose photos',
        'drop-files-here': 'Drop photos here',
        'select-file-source': 'Select photo source',
        'edit-image': 'Edit photo',
        'no-files': 'No photos selected',
        'caption-edit-file': 'Edit photo',
        'files-count-allowed': 'Only {{count}} {{plural:photo(count)}} allowed',
        'files-max-size-limit-error': 'Photo is too big. Max photo size is {{maxFileSize}}.',
        'header-uploading': 'Uploading {{count}} {{plural:photo(count)}}',
        'header-succeed': '{{count}} {{plural:photo(count)}} uploaded',
        'header-total': '{{count}} {{plural:photo(count)}} selected',
      }
    }
  }

  ngOnDestroy() {
    this.ctxProviderRef.nativeElement.removeEventListener('change', this.handleFileUploadChangeEvent);
    this.imageUploadConfigRef.nativeElement.localeDefinitionOverride = null;
  }

  createForm(task?: Task, isUpdate?: boolean) {
    let priority: string | undefined = '0';
    if (task === undefined) {
      task = this.task();
    }

    if (isUpdate) {
      priority = this.priorities.find(item => item.value === task?.priority)?.key.toString();
      this.uploadedImageUrl.set(task?.imageUrl!);
    }

    this.taskForm = new FormGroup({
      title: new FormControl(isUpdate ? task?.title : '', {
        validators: [Validators.required, Validators.minLength(6), Validators.maxLength(150)],
        nonNullable: true
      }),
      expiredAt: new FormControl(isUpdate ? task?.expiredAt!.toString().split("+")[0] : '', {
        validators: [Validators.required, this.validExpiredTimeValidator(isUpdate)],
        nonNullable: true
      }),
      priority: new FormControl(isUpdate ? priority : '0', {
        validators: [Validators.required],
        nonNullable: true
      }),
      description: new FormControl(isUpdate ? task?.description : '', {
        validators: [Validators.required],
        nonNullable: true
      }),
      imageUrl: new FormControl(isUpdate ? task?.imageUrl : ''),
      status: new FormControl(isUpdate ? (task?.isCompleted ? 2 : 0) : 0),
      id: new FormControl(task?.id)
    })
  }

  formatDateString(formatDate: Date, validMinuteExpired?: number): string {
    validMinuteExpired ??= 31;
    formatDate.setMinutes(formatDate.getMinutes() + validMinuteExpired);
    let year = formatDate.getFullYear();
    let month = String(formatDate.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    let day = String(formatDate.getDate()).padStart(2, '0');
    let hours = String(formatDate.getHours()).padStart(2, '0');
    let minutes = String(formatDate.getMinutes()).padStart(2, '0');
    let seconds = String(formatDate.getSeconds()).padStart(2, '0');

    // Format the date as 'YYYY-MM-DDTHH:mm:ss'
    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
  }

  getPriorities(): void {
    const prioJson = localStorage.getItem(this.priorityStoredKey);
    if (prioJson) {
      const priorities = JSON.parse(prioJson);
      this.priorities = priorities;
    }
  }

  onSubmit() {
    if (this.taskForm?.valid) {
      this.taskForm.get('imageUrl')!.setValue(this.uploadedImageUrl());
      this.formDialogRef.close(this.taskForm.value);
    } else {
      this.isSubmitted = true;
    }
  }

  validExpiredTimeValidator(isUpdate: boolean | undefined): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const now = new Date();
      const expireAt = new Date(control?.value);

      if (isUpdate && !control.dirty) {
        return null;
      }

      const diffInMs = expireAt.getTime() - now.getTime();
      if (diffInMs <= 0) {
        return { invalidExpiredTime: true }
      }

      const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
      if (diffInMinutes < 30) {
        return { invalidExpiredTime: true }
      }

      return null;
    }
  }

  handleFileUploadChangeEvent = (e: UC.EventMap['change']) => {
    if (e.detail.failedCount === 0) {
      this.uploadedFiles = e.detail.allEntries.filter(f => f.status === 'success') as UC.OutputFileEntry<'success'>[];
      if (this.uploadedFiles.length !== 0) {
        this.uploadedImageUrl.set(this.uploadedFiles[0].cdnUrl);
      }
    } else {
      this.toastr.error('Upload Failed', 'Error')
    }
  }

  //GETTER
  get title() {
    return this.taskForm?.get('title');
  }

  get expiredAt() {
    return this.taskForm?.get('expiredAt');
  }

  get priority() {
    return this.taskForm?.get('priority');
  }

  get description() {
    return this.taskForm?.get('description');
  }
}