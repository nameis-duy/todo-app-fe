import { Component, inject } from '@angular/core';
import { TaskService } from '../../core/services/task.service';
import { Task } from '../../shared/models/task.model';
import { CommonModule } from '@angular/common';
import { TaskItemsComponent } from "../../shared/components/task-items/task-items.component";
import { TaskFormsComponent } from "../../shared/components/task-forms/task-forms.component";
import { TaskCreateRequest } from '../../shared/models/dtos/task-create-request.model';

@Component({
  selector: 'app-task-list',
  imports: [CommonModule, TaskItemsComponent, TaskFormsComponent],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.scss'
})
export class TaskListComponent {
  taskService = inject(TaskService);

  tasks: Task[] = [];
  isLoading = true;

  ngOnInit() {
    this.loadTasks();
  }

  loadTasks(): void {
    this.taskService.getTasks().subscribe({
      next: (response) => {
        if (response.isSucceed) {
          this.tasks = response.data;
          this.isLoading = false;
        }
      },
      error: (err) => {
        console.error('Error fetching tasks api:', err);
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
          console.log(this.tasks);
          alert('succeed');
          const modal = document.getElementById(`add-modal`);
          if (modal != null) {
            modal.style.display = 'none';
            document.querySelectorAll('.modal-backdrop').forEach(el => el.remove());
          }
        }
      },
      error: (err) => {
        console.error('Error adding task: ', err);
      }
    })
  }
}
