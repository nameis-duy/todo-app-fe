import { Component, inject } from '@angular/core';
import { TaskListComponent } from "../task-list/task-list.component";
import { BaseService } from '../../core/services/base.service';
import { AppConstant } from '../../core/constants/constant';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-home',
  imports: [TaskListComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  priorityStoredKey = AppConstant.PRIORITY_STORING_KEY;
  statusStoredKey = AppConstant.STATUS_STORING_KEY;
  baseService = inject(BaseService);
  http = inject(HttpClient);

  constructor() {
    this.getPriorities();
    this.getStatus();
  }

  getPriorities(): void {
    if (!localStorage.getItem(this.priorityStoredKey)) {
      this.baseService.getPriorities().subscribe({
        next: (res) => {
          const priorities = Object.entries(res).map(([key, value]) => ({
            key: Number(key),
            value: value
          }));

          const prioritiesJson = JSON.stringify(priorities);
          localStorage.setItem(this.priorityStoredKey, prioritiesJson);
        },
        error: (err) => {
          console.error('Error fetching priority values:', err);
        }
      })
    }
  }

  getStatus(): void {
    if (!localStorage.getItem(this.statusStoredKey)) {
      this.baseService.getStatus().subscribe({
        next: (res) => {
          const status = Object.entries(res).map(([key, value]) => ({
            key: Number(key),
            value: value
          }));

          const statusJson = JSON.stringify(status);
          localStorage.setItem(this.statusStoredKey, statusJson);
        },
        error: (err) => {
          console.error('Error fetching status values:', err);
        }
      })
    }
  }
}
