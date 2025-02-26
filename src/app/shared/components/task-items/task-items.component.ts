import { Component, inject, input, output, signal } from '@angular/core';
import { Task } from '../../models/task.model';
import { TaskUpdateRequest } from '../../models/dtos/tasks/task-update-request.model';
import { TaskService } from '../../../core/services/task.service';
import { CommonModule } from '@angular/common';
import { AppConstant } from '../../../core/constants/constant';
import { Dictionary } from '../../models/dictionary.model';
import { StatusColorDirectiveDirective } from '../../directives/status-color-directive.directive';
import { ToastrService } from 'ngx-toastr';
import { LoaderComponent } from "../loader/loader.component";
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDialog } from '@angular/material/dialog';
import { FormModalComponent } from '../form-modal/form-modal.component';
import { DeleteConfirmModalComponent } from '../delete-confirm-modal/delete-confirm-modal.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-task-items',
  imports: [
    CommonModule,
    StatusColorDirectiveDirective,
    LoaderComponent,
    MatTooltipModule,
    MatTabsModule
  ],
  templateUrl: './task-items.component.html',
  styleUrl: './task-items.component.scss'
})
export class TaskItemsComponent {
  taskService = inject(TaskService);
  toastrService = inject(ToastrService);
  formModal = inject(MatDialog);
  deleteConfirmModal = inject(MatDialog);
  router = inject(Router);
  statusStoredKey = AppConstant.STATUS_STORING_KEY;
  priorityStoredKey = AppConstant.PRIORITY_STORING_KEY;

  task = input.required<Task>();
  tasks = input<Task[]>();
  pendingTasks = input<Task[]>();
  completeTasks = input<Task[]>();
  selectedId = output<number>();
  isLoading = signal<boolean>(false);
  isSelected = input<boolean>(false);

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
    const date = new Date(this.task().createdAt);
    this.dateStr = date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  openFormModal() {
    var updateFormModal = this.formModal.open(FormModalComponent, {
      width: '800px',
      maxWidth: '800px',
      enterAnimationDuration: '0.3s',
      exitAnimationDuration: '0.3s',
      autoFocus: "false",
      panelClass: "custom-modal-form",
      data: {
        formTitle: 'Edit Task',
        isUpdate: true,
        task: this.task()
      }
    });

    updateFormModal.afterClosed().subscribe(res => {
      if (res) {
        this.updateTask(res);
      }
    })
  }

  openDeleteConfirmModal() {
    var formModal = this.deleteConfirmModal.open(DeleteConfirmModalComponent, {
      width: '500px',
      maxWidth: '500px',
      enterAnimationDuration: '0.3s',
      exitAnimationDuration: '0.3s',
      autoFocus: "false",
      panelClass: "custom-modal-form",
      data: {
        task: this.task(),
        tasks: this.tasks()
      }
    })

    formModal.afterClosed().subscribe(res => {
      if (res) {
        this.removeTask(this.task().id);
      }
    })
  }

  updateTask(task: TaskUpdateRequest) {
    this.isLoading.set(true);
    task.priority = parseInt(task.priority.toString());
    this.taskService.updateTask(task).subscribe({
      next: (res) => {
        if (res.isSucceed) {
          this.task().title = res.data.title;
          this.task().description = res.data.description;
          this.task().priority = res.data.priority;
          this.task().expiredAt = res.data.expiredAt;
          this.task().imageUrl = res.data.imageUrl;
          document.getElementById(`prio-${this.task().id}`)?.setAttribute('color-code', this.task().priority);
          this.sortTasks(this.tasks()!);
          this.toastrService.success('Edit successfully', 'Success');
        }
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error edit task: ', err);
        if (err.status !== 400) {
          this.toastrService.error('Server error', 'Error');
        } else {
          this.toastrService.error('Update failed', 'Error');
        }
        this.isLoading.set(false);
      }
    })
  }

  removeTask(id: number) {
    this.isLoading.set(true);
    this.taskService.removeTask(id).subscribe({
      next: (res) => {
        if (res.isSucceed) {
          if (this.tasks()) {
            var indexToRemove = this.tasks()?.findIndex(t => t.id === id);
            this.tasks()?.splice(indexToRemove!, 1);
            this.selectedId.emit(this.tasks()?.at(0)?.id ?? -1);
            this.toastrService.success('Remove successfully', 'Success');
          }
        }
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error removing task: ', err);
        this.toastrService.error('Server error', 'Error');
        this.isLoading.set(false);
      }
    })
  }

  changeTaskStatus(id: number, currentCompletedStatus: boolean) {
    this.isLoading.set(true);
    const status = currentCompletedStatus ? 0 : 2; //if current status is complete : return change to pending status : else retrurn complete status
    const taskChangeRequest = {
      id,
      status
    }

    this.taskService.changeTaskStatus(taskChangeRequest).subscribe({
      next: (res) => {
        if (res.isSucceed) {
          this.task().isCompleted = !currentCompletedStatus;
          this.task().status = Object.keys(this.statusObj).find(key => this.statusObj[key] === status)!;
          if (!this.pendingTasks() || !this.completeTasks()) {
            this.toastrService.success(`${currentCompletedStatus ? 'Change Status' : 'Complete Task'} Succeed`, 'Success');
            this.router.navigate(['tasks']);
          }
          if (currentCompletedStatus) {
            this.pendingTasks()?.push(this.task());
            this.sortTasks(this.pendingTasks()!);
          } else {
            this.completeTasks()?.push(this.task());
            this.sortTasks(this.completeTasks()!)
          }
          var indexToRemove = this.tasks()?.findIndex(t => t.id === id);
          this.tasks()?.splice(indexToRemove!, 1);
          this.toastrService.success(`${currentCompletedStatus ? 'Change Status' : 'Complete Task'} Succeed`, 'Success');
        }
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error change task status: ', err);
        this.toastrService.error('Server error', 'Error');
        this.isLoading.set(false);
      }
    })
  }

  onClickDetail() {
    return this.selectedId.emit(this.task().id);
  }

  //SUPPORT FUNC
  sortTasks(tasks: Task[]) {
    tasks.sort((a, b) => {
      if (a.status !== b.status) {
        return this.statusObj[a.status] - this.statusObj[b.status];
      }

      if (a.priority !== b.priority) {
        return this.priorityObj[b.priority] - this.priorityObj[a.priority];
      }

      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
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
}
