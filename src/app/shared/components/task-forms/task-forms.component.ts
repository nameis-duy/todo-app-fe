import { Component, inject, input, output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TaskCreateRequest } from '../../models/dtos/task-create-request.model';
import { Task } from '../../models/task.model';
import { CommonModule, formatDate } from '@angular/common';
import { TaskUpdateRequest } from '../../models/dtos/task-update-request.model';
import { Dictionary } from '../../models/dictionary.model';
import { BaseService } from '../../../core/services/base.service';

@Component({
  selector: 'app-task-forms',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './task-forms.component.html',
  styleUrl: './task-forms.component.scss'
})
export class TaskFormsComponent {
  formCreateSubmit = output<TaskCreateRequest>();
  formUpdateSubmit = output<TaskUpdateRequest>();
  task = input<Task>();
  isUpdate = input.required<boolean>();

  priorities: Dictionary[] = [];
  taskForm?: FormGroup;

  baseService = inject(BaseService);

  constructor() {
    this.createForm();
    this.getPriorities();
  }

  ngAfterViewInit() {
    this.createForm(this.task(), this.isUpdate());
  }

  createForm(task?: Task, isUpdate?: boolean) {
    console.log(task);
    if (task === undefined) {
      task = this.task();
    }

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

  getPriorities(): void {
    this.baseService.getPriorities().subscribe({
      next: (res) => {
        this.priorities = Object.entries(res).map(([key, value]) => ({
          key: Number(key),
          value: value
        }));
      },
      error: (err) => {
        console.error('Error fetching enum api:', err);
      }
    })
  }

  onSubmit() {
    if (this.taskForm?.valid) {
      this.isUpdate() ? this.formUpdateSubmit.emit(this.taskForm.value) : this.formCreateSubmit.emit(this.taskForm.value);
    } else {
      this.taskForm?.markAllAsTouched();
    }
  }
}
