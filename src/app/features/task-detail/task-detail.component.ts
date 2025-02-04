import { Component, inject, input } from '@angular/core';
import { Task } from '../../shared/models/task.model';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { StatusColorDirectiveDirective } from '../../shared/directives/status-color-directive.directive';
import { TaskService } from '../../core/services/task.service';

@Component({
  selector: 'app-task-detail',
  imports: [CommonModule, StatusColorDirectiveDirective],
  templateUrl: './task-detail.component.html',
  styleUrl: './task-detail.component.scss'
})
export class TaskDetailComponent {
  taskService = inject(TaskService);

  task$ = input<Observable<Task | undefined>>();
  task: Task | undefined = undefined;
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
}
