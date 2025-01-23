import { Component, input, output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TaskCreateRequest } from '../../models/dtos/task-create-request.model';
import { Task } from '../../models/task.model';
import { formatDate } from '@angular/common';
import { TaskUpdateRequest } from '../../models/dtos/task-update-request.model';

@Component({
  selector: 'app-task-forms',
  imports: [ReactiveFormsModule],
  templateUrl: './task-forms.component.html',
  styleUrl: './task-forms.component.scss'
})
export class TaskFormsComponent {
  formCreateSubmit = output<TaskCreateRequest>();
  formUpdateSubmit = output<TaskUpdateRequest>();
  task = input<Task>();
  isUpdate = input.required<boolean>();

  taskForm?: FormGroup;

  constructor() {
    this.createForm();
  }

  createForm(task?: Task, isUpdate?: boolean) {
    if (task === undefined) {
      task = this.task();
    }

    console.log(task);
    console.log(this.task());

    this.taskForm = new FormGroup({
      title: new FormControl(isUpdate ? task?.title : '', {
        validators: [Validators.required],
        nonNullable: true
      }),
      expiredAt: new FormControl('', {
        validators: [Validators.required],
        nonNullable: true
      }),
      priority: new FormControl(isUpdate ? '1' : '0', {
        validators: [Validators.required],
        nonNullable: true
      }),
      description: new FormControl(isUpdate ? task?.title : '', {
        validators: [Validators.required],
        nonNullable: true
      }),
      id: new FormControl(task?.id)
    })

    isUpdate ? this.taskForm?.get('expiredAt')!
      .setValue(formatDate(task?.expiredAtUtc ?? new Date(), 'mm/dd/yyyy', 'en')) : '';
  }

  onSubmit() {
    if (this.taskForm?.valid) {
      this.isUpdate() ? this.formUpdateSubmit.emit(this.taskForm.value) : this.formCreateSubmit.emit(this.taskForm.value);
    } else {
      this.taskForm?.markAllAsTouched();
    }
  }
}
