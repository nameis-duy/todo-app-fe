import { Component, inject, input, output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
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
  priorityStoredKey = AppConstant.PRIORITY_KEY;
  formCreateSubmit = output<TaskCreateRequest>();
  formUpdateSubmit = output<TaskUpdateRequest>();
  task = input<Task>();
  isUpdate = input.required<boolean>();

  priorities: Dictionary[] = [];
  taskForm?: FormGroup;

  baseService = inject(BaseService);

  constructor() {
    this.getPriorities();
    this.createForm();
  }

  ngAfterViewInit() {
    this.createForm(this.task(), this.isUpdate());
  }

  createForm(task?: Task, isUpdate?: boolean) {
    console.log(task);
    console.log(isUpdate);
    let priority : string | undefined = '0';
    if (task === undefined) {
      task = this.task();
    }

    if (isUpdate) {
      priority = this.priorities.find(item => item.value === task?.priority)?.key.toString();
    }

    this.taskForm = new FormGroup({
      title: new FormControl(isUpdate ? task?.title : '', {
        validators: [Validators.required],
        nonNullable: true
      }),
      expiredAt: new FormControl(isUpdate ? new Date(task?.expiredAtUtc!).toISOString().slice(0, -1) : '', {
        validators: [Validators.required],
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
      this.isUpdate() ? this.formUpdateSubmit.emit(this.taskForm.value) : this.formCreateSubmit.emit(this.taskForm.value);
    } else {
      this.taskForm?.markAllAsTouched();
    }
  }
}
