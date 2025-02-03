import { Component, inject, input, output, ViewChild } from '@angular/core';
import { Task } from '../../models/task.model';
import { TaskFormsComponent } from "../task-forms/task-forms.component";
import { TaskUpdateRequest } from '../../models/dtos/task-update-request.model';
import { TaskService } from '../../../core/services/task.service';
import { CommonModule } from '@angular/common';
import { AppConstant } from '../../../core/constants/constant';
import { Dictionary } from '../../models/dictionary.model';
import { StatusColorDirectiveDirective } from '../../directives/status-color-directive.directive';

@Component({
  selector: 'app-task-items',
  imports: [TaskFormsComponent, CommonModule, StatusColorDirectiveDirective],
  templateUrl: './task-items.component.html',
  styleUrl: './task-items.component.scss'
})
export class TaskItemsComponent {
  taskService = inject(TaskService);
  statusStoredKey = AppConstant.STATUS_STORING_KEY;
  priorityStoredKey = AppConstant.PRIORITY_STORING_KEY;

  @ViewChild(TaskFormsComponent) formComponent!: TaskFormsComponent;
  task = input.required<Task>();
  tasks = input<Task[]>();
  checked = input.required<boolean>();
  selectedId = output<number>();
  dateStr = '';
  statusObj: any;
  priorityObj: any;

  constructor() {
    const statusList = this.getStatus();
    const priorities = this.getPriorities();

    this.statusObj = Object.fromEntries(statusList.map(item => [item.value, item.key]));
    this.priorityObj = Object.fromEntries(priorities.map(item => [item.value, item.key]));
  }

  ngOnInit() {
    const date = new Date(this.task().createdAtUtc);
    this.dateStr = date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  ngAfterViewInit() {
    this.formComponent.createForm(this.task(), true);
  }

  updateTask(task: TaskUpdateRequest) {
    task.priority = parseInt(task.priority.toString());
    this.taskService.updateTask(task).subscribe({
      next: (res) => {
        if (res.isSucceed) {
          this.task().title = res.data.title;
          this.task().description = res.data.description;
          this.task().priority = res.data.priority;
          this.task().expiredAtUtc = res.data.expiredAtUtc;
          document.getElementById(`btn-update-modal-close-${this.task().id}`)?.click();
          document.getElementById(`prio-${this.task().id}`)?.setAttribute('color-code', this.task().priority);
          this.sortTasks();
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
          if (this.tasks()) {
            var indexToRemove = this.tasks()?.findIndex(t => t.id === id);
            this.tasks()?.splice(indexToRemove!, 1);
            const removeModal = document.getElementById(`remove-modal-${this.task().id}`);
            if (removeModal) {
              this.closeModal(removeModal);
            }
          }
        }
      },
      error: (err) => {
        console.error('Error removing task: ', err);
      }
    })
  }

  changeTaskStatus(id: number, isCompleted: boolean) {
    const status = isCompleted ? 0 : 2;
    const taskChangeRequest = {
      id,
      status
    }

    this.taskService.changeTaskStatus(taskChangeRequest).subscribe({
      next: (res) => {
        if (res.isSucceed) {
          this.task().isCompleted = !isCompleted;
          this.task().status = Object.keys(this.statusObj).find(key => this.statusObj[key] === status)!;
          this.sortTasks();
        }
      },
      error: (err) => {
        console.error('Error change task status: ', err);
      }
    })
  }

  onClickDetail() {
    return this.selectedId.emit(this.task().id);
  }

  //SUPPORT FUNC
  sortTasks() {
    this.tasks()?.sort((a, b) => {
      if (a.status !== b.status) {
        return this.statusObj[a.status] - this.statusObj[b.status];
      }

      return this.priorityObj[b.priority] - this.priorityObj[a.priority];
    })
  }

  getStatus(): Dictionary[] {
    const statusJson = localStorage.getItem(this.statusStoredKey);
    if (statusJson) {
      return JSON.parse(statusJson);
    }
    return [];
  }

  getPriorities(): Dictionary[] {
    const prioJson = localStorage.getItem(this.priorityStoredKey);
    if (prioJson) {
      return JSON.parse(prioJson);
    }
    return [];
  }

  closeModal(modal: HTMLElement) {
    modal.classList.remove('show');
    modal.style.display = 'none';
    modal.setAttribute('aria-hidden', 'true');
    modal.removeAttribute('aria-modal');
    modal.removeAttribute('role');
    document.body.classList.remove('modal-open');
    const modalBackdrop = document.querySelector('.modal-backdrop');
    if (modalBackdrop) {
      modalBackdrop.remove();
    }
  }
}
