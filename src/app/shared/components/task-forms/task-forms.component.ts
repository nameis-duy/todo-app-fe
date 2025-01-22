import { Component, output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TaskCreateRequest } from '../../models/dtos/task.create.request.model';

@Component({
  selector: 'app-task-forms',
  imports: [ReactiveFormsModule],
  templateUrl: './task-forms.component.html',
  styleUrl: './task-forms.component.scss'
})
export class TaskFormsComponent {
  formSubmit = output<TaskCreateRequest>();

  addForm: FormGroup;

  constructor() {
    this.addForm = new FormGroup({
      title: new FormControl('', {
        validators: [Validators.required],
        nonNullable: true
      }),
      expireDate: new FormControl('', {
        validators: [Validators.required],
        nonNullable: true
      }),
      priority: new FormControl('0', {
        validators: [Validators.required],
        nonNullable: true
      }),
      description: new FormControl('', {
        validators: [Validators.required],
        nonNullable: true
      }),
    })
  }

  onSubmit() {
    if (this.addForm.valid) {
      this.formSubmit.emit(this.addForm.value);
    } else {
      this.addForm.markAllAsTouched();
    }
  }
}
