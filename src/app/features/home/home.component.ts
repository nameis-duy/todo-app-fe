import { Component, inject } from '@angular/core';
import { TaskListComponent } from "../task-list/task-list.component";
import { HeadersComponent } from "../../shared/components/headers/headers.component";
import { SidebarComponent } from "../../shared/components/sidebar/sidebar.component";
import { BaseService } from '../../core/services/base.service';
import { AppConstant } from '../../core/constants/constant';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-home',
  imports: [TaskListComponent, HeadersComponent, SidebarComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  priorityStoredKey = AppConstant.PRIORITY_KEY;
  baseService = inject(BaseService);
  http = inject(HttpClient);

  constructor() {
    this.getPriorities();
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
          console.error('Error fetching enum api:', err);
        }
      })
    }
  }
}
