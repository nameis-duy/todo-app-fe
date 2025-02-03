import { Component, inject, input } from '@angular/core';
import { Task } from '../../shared/models/task.model';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { StatusColorDirectiveDirective } from '../../shared/directives/status-color-directive.directive';
import { TaskFormsComponent } from "../../shared/components/task-forms/task-forms.component";
import { TaskUpdateRequest } from '../../shared/models/dtos/task-update-request.model';
import { TaskService } from '../../core/services/task.service';

@Component({
  selector: 'app-task-detail',
  imports: [CommonModule, StatusColorDirectiveDirective, TaskFormsComponent],
  templateUrl: './task-detail.component.html',
  styleUrl: './task-detail.component.scss'
})
export class TaskDetailComponent {
  taskService = inject(TaskService);

  task$ = input<Observable<Task | undefined>>();
  task : Task | undefined = undefined;
  dateStr = '';
  expiredDateStr = '';

  ngOnInit() {
    this.task$()?.subscribe((t) => {
      this.task = t;
      if (this.task) {
        const date = new Date(this.task!.createdAtUtc);
        const expired = new Date(this.task.expiredAtUtc);
        this.dateStr = date.toLocaleDateString('vi-VN', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
        this.expiredDateStr = expired.toLocaleDateString('vi-VN', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
      }
    })
  }

  updateTask(task: TaskUpdateRequest) {
      task.priority = parseInt(task.priority.toString());
      this.taskService.updateTask(task).subscribe({
        next: (res) => {
          if (res.isSucceed) {
            this.task!.title = res.data.title;
            this.task!.description = res.data.description;
            this.task!.priority = res.data.priority;
            this.task!.expiredAtUtc = res.data.expiredAtUtc;
            document.getElementById(`btn-update-modal-close-${this.task!.id}`)?.click();
            document.getElementById(`prio-${this.task!.id}`)?.setAttribute('color-code', this.task!.priority);
          }
        },
        error: (err) => {
          console.error('Error edit task: ', err);
        }
      })
    }
}
