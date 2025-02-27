import { Component, inject, input, signal, SimpleChanges } from '@angular/core';
import { Task } from '../../shared/models/task.model';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { StatusColorDirectiveDirective } from '../../shared/directives/status-color-directive.directive';
import { TaskService } from '../../core/services/task.service';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog } from '@angular/material/dialog';
import { TaskUpdateRequest } from '../../shared/models/dtos/tasks/task-update-request.model';
import { FormModalComponent } from '../../shared/components/form-modal/form-modal.component';
import { ToastrService } from 'ngx-toastr';
import { Dictionary } from '../../shared/models/dictionary.model';
import { AppConstant } from '../../core/constants/constant';
import { DeleteConfirmModalComponent } from '../../shared/components/delete-confirm-modal/delete-confirm-modal.component';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { StringCamelToSpacePipe } from '../../shared/pipes/string-camel-to-space.pipe';

@Component({
  selector: 'app-task-detail',
  imports: [
    CommonModule,
    StatusColorDirectiveDirective,
    MatTooltipModule,
    RouterLink,
    StringCamelToSpacePipe
  ],
  templateUrl: './task-detail.component.html',
  styleUrl: './task-detail.component.scss'
})
export class TaskDetailComponent {
  taskService = inject(TaskService);
  toastrService = inject(ToastrService);
  formModal = inject(MatDialog);
  deleteConfirmModal = inject(MatDialog);
  router = inject(Router);

  statusStoredKey = AppConstant.STATUS_STORING_KEY;
  priorityStoredKey = AppConstant.PRIORITY_STORING_KEY;

  task$ = input<Observable<Task | undefined>>();
  task: Task | undefined = undefined;
  taskId: string | null = null;

  dateStr = '';
  expiredDateStr = '';
  isLoading = signal<boolean>(false);
  pendingTasks = input<Task[]>();
  completedTasks = input<Task[]>();
  tasks = signal<Task[] | undefined>([]);
  statusObj: any;
  priorityObj: any;

  constructor(private route: ActivatedRoute) {
    const statusList = this.getStatus();
    const priorities = this.getPriorities();

    this.statusObj = Object.fromEntries(statusList.map(item => [item.value, item.key]));
    this.priorityObj = Object.fromEntries(priorities.map(item => [item.value, item.key]));
  }

  ngOnInit() {
    this.taskId = this.route.snapshot.paramMap.get('id');

    if (this.taskId) {
      this.isLoading.set(true);
      this.taskService.getTaskById(parseInt(this.taskId)).subscribe({
        next: (res) => {
          if (res.isSucceed) {
            this.task = res.data;
          } else {
            this.router.navigate(['tasks']);
          }
          this.isLoading.set(false);
        },
        error: (err) => {
          console.log("Error get task detail: " + err);
          this.router.navigate(['tasks']);
        }
      })
    } else {
      this.task$()?.subscribe((t) => {
        this.task = t;
      })
    }
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
        task: this.task
      }
    });

    updateFormModal.afterClosed().subscribe(res => {
      if (res) {
        this.updateTask(res);
      }
    })
  }

  openDeleteModal() {
    var formModal = this.deleteConfirmModal.open(DeleteConfirmModalComponent, {
      width: '500px',
      maxWidth: '500px',
      enterAnimationDuration: '0.3s',
      exitAnimationDuration: '0.3s',
      autoFocus: "false",
      panelClass: "custom-modal-form",
      data: {
        task: this.task,
        tasks: this.tasks
      }
    })

    formModal.afterClosed().subscribe(res => {
      if (res) {
        this.removeTask(this.task!.id);
      }
    })
  }

  updateTask(task: TaskUpdateRequest) {
    this.isLoading.set(true);
    task.priority = parseInt(task.priority.toString());
    this.taskService.updateTask(task).subscribe({
      next: (res) => {
        if (res.isSucceed) {
          this.task!.title = res.data.title;
          this.task!.description = res.data.description;
          this.task!.priority = res.data.priority;
          this.task!.expiredAt = res.data.expiredAt;
          this.task!.imageUrl = res.data.imageUrl;
          document.getElementById(`btn-update-modal-close-${this.task!.id}`)?.click();
          document.getElementById(`prio-${this.task!.id}`)?.setAttribute('color-code', this.task!.priority);
          this.sortTasks();
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
          if (this.tasks) {
            var indexToRemove = this.tasks()?.findIndex(t => t.id === id);
            this.tasks()?.splice(indexToRemove!, 1);
            this.task = this.tasks()![0];
          }
        }
        this.toastrService.success('Remove successfully', 'Success');
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error removing task: ', err);
        this.toastrService.error('Server error', 'Error');
        this.isLoading.set(false);
      }
    })
  }

  //SUPPORT FUNC
  sortTasks() {
    this.tasks()?.sort((a, b) => {
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