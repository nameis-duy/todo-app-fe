import { Component, inject, input, output } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { TaskCreateRequest } from '../../models/dtos/task-create-request.model';
import { Task } from '../../models/task.model';
import { CommonModule, formatDate } from '@angular/common';
import { TaskUpdateRequest } from '../../models/dtos/task-update-request.model';
import { Dictionary } from '../../models/dictionary.model';
import { BaseService } from '../../../core/services/base.service';
import { AppConstant } from '../../../core/constants/constant';

@Component({
  selector: 'app-task-forms',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './task-forms.component.html',
  styleUrl: './task-forms.component.scss'
})
export class TaskFormsComponent {
  priorityStoredKey = AppConstant.PRIORITY_STORING_KEY;
  formCreateSubmit = output<TaskCreateRequest>();
  formUpdateSubmit = output<TaskUpdateRequest>();
  task = input<Task>();
  isUpdate = input.required<boolean>();

  priorities: Dictionary[] = [];
  taskForm?: FormGroup;
  isSubmitted = false;

  baseService = inject(BaseService);

  constructor() {
    this.getPriorities();
    this.createForm();
  }

  ngAfterViewInit() {
    this.createForm(this.task(), this.isUpdate());
  }

  createForm(task?: Task, isUpdate?: boolean) {
    let priority: string | undefined = '0';
    if (task === undefined) {
      task = this.task();
    }

    if (isUpdate) {
      priority = this.priorities.find(item => item.value === task?.priority)?.key.toString();
    }

    this.taskForm = new FormGroup({
      title: new FormControl(isUpdate ? task?.title : '', {
        validators: [Validators.required, Validators.minLength(6), Validators.maxLength(150)],
        nonNullable: true
      }),
      expiredAt: new FormControl('', {
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
      id: new FormControl(task?.id)
    })

    if (isUpdate) {
      const expiredAtUtc = new Date(task?.expiredAtUtc!);
      const localDate = new Date(expiredAtUtc.getTime() - expiredAtUtc.getTimezoneOffset() * 60000)
        .toISOString().slice(0, -1);

      this.taskForm.get('expiredAt')?.setValue(localDate);
    }
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
      if (this.isUpdate()) {
        this.formUpdateSubmit.emit(this.taskForm.value);
      } else {
        this.formCreateSubmit.emit(this.taskForm.value);
        this.createForm(undefined, false);
      }
    } else {
      this.isSubmitted = true;
    }
  }

  validExpiredTimeValidator(isUpdate: boolean | undefined) : ValidatorFn {
    return (control: AbstractControl) : ValidationErrors | null => {
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
