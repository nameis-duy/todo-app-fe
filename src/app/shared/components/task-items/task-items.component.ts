import { Component, inject, input, ViewChild } from '@angular/core';
import { Task } from '../../models/task.model';
import { TaskFormsComponent } from "../task-forms/task-forms.component";
import { TaskUpdateRequest } from '../../models/dtos/task-update-request.model';
import { TaskService } from '../../../core/services/task.service';

@Component({
  selector: 'app-task-items',
  imports: [TaskFormsComponent],
  templateUrl: './task-items.component.html',
  styleUrl: './task-items.component.scss'
})
export class TaskItemsComponent {
  taskService = inject(TaskService);

  @ViewChild(TaskFormsComponent) formComponent!: TaskFormsComponent;
  task = input.required<Task>();
  checked = input.required<boolean>();
  dateStr = '';
  colorCode = 'Low';

  ngOnInit() {
    const date = new Date(this.task().createdAtUtc);
    this.dateStr = date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });

    this.colorCode = this.task().priority;
  }

  ngAfterViewInit() {
    console.log('calling');
    console.log(this.task());
    this.formComponent.createForm(this.task(), true);
  }

  updateTask(task: TaskUpdateRequest) {
    task.priority = parseInt(task.priority.toString());
    this.taskService.updateTask(task).subscribe({
      next: (res) => {
        console.log(res);
        if (res.isSucceed) {
          this.task().title = res.data.title;
          this.task().description = res.data.description;
          this.task().priority = res.data.priority;
          this.task().expiredAtUtc = res.data.expiredAtUtc;
          alert('succeed');
          const modal = document.getElementById(`update-modal-${this.task().id}`);
          if (modal != null) {
            modal.style.display = 'none';
            document.querySelectorAll('.modal-backdrop').forEach(el => el.remove());
          }
          document.getElementById(`prio-${this.task().id}`)?.setAttribute('color-code', this.task().priority);
        }
      },
      error: (err) => {
        console.error('Error edit task: ', err);
      }
    })
  }

  removeTask(id: number) {
    this.taskService.removeTask(id).subscribe({
      next: (res) => {
        if (res.isSucceed) {
          alert('succeed');
        }
      },
      error: (err) => {
        console.error('Error removing task: ', err);
      }
    })
  }
}
