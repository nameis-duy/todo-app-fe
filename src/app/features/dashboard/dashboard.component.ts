import { Task } from './../../shared/models/task.model';
import { Component, inject, signal } from '@angular/core';
import { ShareService } from '../../core/services/shared.service';
import { TaskItemsComponent } from "../../shared/components/task-items/task-items.component";
import { TaskService } from '../../core/services/task.service';
import { ToastrService } from 'ngx-toastr';
import { ProgressBarComponent } from "./components/progress-bar/progress-bar.component";
import { StatusColorDirectiveDirective } from '../../shared/directives/status-color-directive.directive';
import { AppConstant } from '../../core/constants/constant';
import { Dictionary } from '../../shared/models/dictionary.model';
import { CommonModule } from '@angular/common';
import { LoaderComponent } from "../../shared/components/loader/loader.component";
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-dashboard',
  imports: [
    TaskItemsComponent,
    StatusColorDirectiveDirective,
    ProgressBarComponent,
    CommonModule,
    LoaderComponent,
    MatDividerModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  priorityStoredKey = AppConstant.PRIORITY_STORING_KEY;

  shareService = inject(ShareService);
  taskService = inject(TaskService);
  toastr = inject(ToastrService);

  userName = signal<string>('');
  todayPendingTasks = signal<Task[]>([]);
  pendingTasks = signal<Task[]>([]);
  completedTasks = signal<Task[]>([]);

  pendingTask = signal<number>(0);
  completedTask = signal<number>(0);
  inProgressTask = signal<number>(0);

  isLoading = signal<boolean>(false);
  latestTaskDate = signal<Date | undefined>(undefined);
  dateDiff = signal<string>('');

  priorityObj: any;

  ngOnInit() {
    this.shareService.message$.subscribe((name) => {
      this.userName.set(name);
    });
    this.loadTasks();
  }

  loadTasks(): void {
    this.isLoading.set(true);
    this.taskService.getTasks().subscribe({
      next: (response) => {
        if (response.isSucceed) {
          const sortedTasks = this.sortTasks(response.data);
          if (sortedTasks.length !== 0) {
            const pending = sortedTasks.filter(t => !t.isCompleted);
            const completed = sortedTasks.filter(t => t.isCompleted);

            this.todayPendingTasks.set(pending.filter(t => this.calculateDateDiff(new Date(), new Date(t.createdAt)) === 0).splice(0, 2));

            const total = response.data.length;
            this.pendingTask.set((pending.length / total) * 100);
            this.completedTask.set((completed.length / total) * 100);
            this.inProgressTask.set(100 - this.pendingTask() - this.completedTask());

            if (this.todayPendingTasks.length < 2) {
              this.pendingTasks.set(pending.splice(this.todayPendingTasks().length, 2 - this.todayPendingTasks().length));
            }
            this.completedTasks.set(completed.splice(0, 1));

            this.latestTaskDate.set(pending[0].createdAt);
            this.calculateDisplayDate();
          }
        }
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error fetching tasks api:', err);
        this.toastr.error('Server error', 'Error');
        // this.isLoading.set(false);
      }
    })
  }

  //SUPPORT FUNC
  sortTasks(tasks: Task[]): Task[] {
    if (!this.priorityObj) {
      this.initStatusAndPrioritiesObj();
    }

    tasks.sort((a, b) => {
      const firstDate = new Date(a.createdAt).getTime();
      const secondDate = new Date(b.createdAt).getTime()
      if (firstDate !== secondDate) {
        return secondDate - firstDate;
      }

      return this.priorityObj[b.priority] - this.priorityObj[a.priority]
    })

    return tasks;
  }

  calculateDisplayDate() {
    const today = new Date();
    if (this.latestTaskDate()) {
      const diffInDays = this.calculateDateDiff(today, new Date(this.latestTaskDate()!));
      let dateDiffValue = '';
      if (diffInDays === 0) {
        dateDiffValue = 'Today';
      } else if (diffInDays === 1) {
        dateDiffValue = 'Yesterday'
      } else if (diffInDays < 7) {
        dateDiffValue = `${diffInDays} days ago`
      } else if (diffInDays >= 7) {
        const weekDiffs = Math.ceil(diffInDays / 7);
        dateDiffValue = `${weekDiffs} week${weekDiffs === 1 ? '' : 's'} ago`
      }
      this.dateDiff.set(dateDiffValue);
    }
  }

  calculateDateDiff(firstDate: Date, secondDate: Date) {
    const diffInMs = Math.abs(firstDate.getTime() - secondDate.getTime());
    const msInDay = 1000 * 60 * 60 * 24;
    return Math.floor(diffInMs / msInDay);;
  }

  initStatusAndPrioritiesObj() {
    const priorities: Dictionary[] = JSON.parse(localStorage.getItem(this.priorityStoredKey)!);

    this.priorityObj = Object.fromEntries(priorities.map(item => [item.value, item.key]));
  }
}
