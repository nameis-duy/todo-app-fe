import { Component, input } from '@angular/core';
import { Task } from '../../shared/models/task.model';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-task-detail',
  imports: [CommonModule],
  templateUrl: './task-detail.component.html',
  styleUrl: './task-detail.component.scss'
})
export class TaskDetailComponent {
  task$ = input<Observable<Task | undefined>>();
  task : Task | undefined = undefined;
  dateStr = '';

  ngOnInit() {
    this.task$()?.subscribe((t) => {
      this.task = t;
    })
    
    if (this.task !== undefined) {
      const date = new Date(this.task!.createdAtUtc);
      this.dateStr = date.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    }
  }

  ngAfterViewChecked() {
    if (this.task !== undefined) {
      const date = new Date(this.task!.createdAtUtc);
      this.dateStr = date.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    }
  }
}
