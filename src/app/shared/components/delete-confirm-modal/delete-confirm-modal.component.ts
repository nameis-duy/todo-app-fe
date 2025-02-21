import { Component, inject, input, signal } from '@angular/core';
import { Task } from '../../models/task.model';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from '@angular/material/dialog';

@Component({
  selector: 'app-delete-confirm-modal',
  imports: [
    MatDialogContent,
    MatDialogActions,
    MatDialogTitle,
    MatDialogClose
  ],
  templateUrl: './delete-confirm-modal.component.html',
  styleUrl: './delete-confirm-modal.component.scss'
})
export class DeleteConfirmModalComponent {
  task!: Task;
  tasks = input<Task[]>();
  data = inject(MAT_DIALOG_DATA);
  inputData: any;
  dialogRef = inject(MatDialogRef<boolean>);
  
  ngOnInit() {
    if (this.data) {
      this.task = this.data.task;
      this.tasks = this.data.tasks;
    }
  }

  handleConfirm() {
    this.dialogRef.close(true);
  }
}
