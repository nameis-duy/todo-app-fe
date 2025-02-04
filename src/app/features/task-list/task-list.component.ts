import { Component, inject } from '@angular/core';
import { TaskService } from '../../core/services/task.service';
import { Task } from '../../shared/models/task.model';
import { CommonModule } from '@angular/common';
import { TaskItemsComponent } from "../../shared/components/task-items/task-items.component";
import { TaskFormsComponent } from "../../shared/components/task-forms/task-forms.component";
import { TaskCreateRequest } from '../../shared/models/dtos/task-create-request.model';
import { TaskDetailComponent } from "../task-detail/task-detail.component";
import { BehaviorSubject } from 'rxjs';
import { AppConstant } from '../../core/constants/constant';
import { Dictionary } from '../../shared/models/dictionary.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-task-list',
  imports: [CommonModule, TaskItemsComponent, TaskFormsComponent, TaskDetailComponent],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.scss'
})
export class TaskListComponent {
  taskService = inject(TaskService);
  toastr = inject(ToastrService);
  statusStoredKey = AppConstant.STATUS_STORING_KEY;
  priorityStoredKey = AppConstant.PRIORITY_STORING_KEY;

  tasks: Task[] = [];
  isLoading = true;
  statusObj: any;
  priorityObj: any;

  private selectedTask = new BehaviorSubject<Task | undefined>(undefined);
  selectedTask$ = this.selectedTask.asObservable();

  ngOnInit() {
    this.loadTasks();
  }

  loadTasks(): void {
    this.taskService.getTasks().subscribe({
      next: (response) => {
        if (response.isSucceed) {
          this.tasks = response.data;
          this.selectedTask.next(this.tasks[0]);
          this.isLoading = false;
        }
      },
      error: (err) => {
        console.error('Error fetching tasks api:', err);
        this.toastr.error('Server error', 'Error');
        this.isLoading = false;
      }
    })
  }

  addTask(task: TaskCreateRequest): void {
    task.priority = parseInt(task.priority.toString());
    this.taskService.addTask(task).subscribe({
      next: (res) => {
        if (res.isSucceed) {
          this.tasks.push(res.data);
          this.sortTasks();
          document.getElementById(`btn-close-add-modal`)?.click();
          this.toastr.success('Add successfully', 'Success')
        }
      },
      error: (err) => {
        console.error('Error adding task: ', err);
        this.toastr.error('Server error', 'Error');
      }
    })
  }

  selectTask(id: number) {
    this.selectedTask.next(this.tasks.find(task => task.id === id));
  }

  //SUPPORT FUNC
  sortTasks() {
    if (!this.statusObj || !this.priorityObj) {
      const statusList: Dictionary[] = JSON.parse(localStorage.getItem(this.statusStoredKey)!);
      const priorities: Dictionary[] = JSON.parse(localStorage.getItem(this.priorityStoredKey)!);

      this.statusObj = Object.fromEntries(statusList.map(item => [item.value, item.key]));
      this.priorityObj = Object.fromEntries(priorities.map(item => [item.value, item.key]));
    }

    this.tasks.sort((a, b) => {
      if (a.status !== b.status) {
        return this.statusObj[a.status] - this.statusObj[b.status];
      }

      if (a.priority !== b.priority) {
        this.priorityObj[b.priority] - this.priorityObj[a.priority];
      }

      return new Date(a.createdAtUtc).getTime() - new Date(b.createdAtUtc).getTime();
    })
  }
}
