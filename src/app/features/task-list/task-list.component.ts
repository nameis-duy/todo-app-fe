import { Component, inject, signal, } from '@angular/core';
import { TaskService } from '../../core/services/task.service';
import { Task } from '../../shared/models/task.model';
import { CommonModule } from '@angular/common';
import { TaskItemsComponent } from "../../shared/components/task-items/task-items.component";
import { TaskCreateRequest } from '../../shared/models/dtos/tasks/task-create-request.model';
import { TaskDetailComponent } from "../task-detail/task-detail.component";
import { BehaviorSubject } from 'rxjs';
import { AppConstant } from '../../core/constants/constant';
import { Dictionary } from '../../shared/models/dictionary.model';
import { ToastrService } from 'ngx-toastr';
import { CdkDragDrop, CdkDropList, CdkDrag, moveItemInArray } from '@angular/cdk/drag-drop';
import { TaskUpdateRequest } from '../../shared/models/dtos/tasks/task-update-request.model';
import { LoaderComponent } from "../../shared/components/loader/loader.component";
import { FilterTasksPipePipe } from './pipes/filter-tasks-pipe.pipe';
import { SearchService } from '../../core/services/search.service';
import { MatDialog } from '@angular/material/dialog';
import { FormModalComponent } from '../../shared/components/form-modal/form-modal.component';
import { Dialog } from '@angular/cdk/dialog';
import { MatTabChangeEvent, MatTabsModule } from '@angular/material/tabs';
import { MatSelectModule } from '@angular/material/select';
import { FilterDropdownComponent } from "./components/filter-dropdown/filter-dropdown.component";
import { DateRange } from '../../shared/models/filter/date-range.modal';


@Component({
  selector: 'app-task-list',
  imports: [
    CommonModule,
    TaskItemsComponent,
    TaskDetailComponent,
    CdkDrag, CdkDropList,
    LoaderComponent,
    FilterTasksPipePipe,
    MatTabsModule,
    MatSelectModule,
    FilterDropdownComponent
],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.scss'
})
export class TaskListComponent {
  taskService = inject(TaskService);
  toastr = inject(ToastrService);
  searchService = inject(SearchService);
  addForm = inject(Dialog);
  statusStoredKey = AppConstant.STATUS_STORING_KEY;
  priorityStoredKey = AppConstant.PRIORITY_STORING_KEY;
  defaultImageUrl = AppConstant.DEFAULT_TASK_IMG_URL;

  // @ViewChild('home', { static: true }) home!: ElementRef;
  // @ViewChild('profile', { static: true }) profile!: ElementRef;
  form = inject(MatDialog);

  pendingTasks = signal<Task[]>([]);
  completedTasks = signal<Task[]>([]);
  currentTab = signal<number>(0);
  isLoading = signal(false);
  searchText = signal<string>('');
  isAddModalPopup = signal<boolean>(false)
  statusObj: any;
  priorityObj: any;

  selectedId = signal<number>(-1);
  private selectedTask = new BehaviorSubject<Task | undefined>(undefined);
  selectedTask$ = this.selectedTask.asObservable();

  //FITLER VARIABLES
  selectedPrios = signal<string[]>([]);
  selectedCreatedDateRange = signal<DateRange | undefined>(undefined);
  selectedExpiredDateRange = signal<DateRange | undefined>(undefined);

  ngOnInit() {
    this.loadTasks();
    this.searchService.searchText$.subscribe({
      next: (searchInput) => {
        this.searchText.set(searchInput);
        this.isLoading.set(false);
      }
    })

    // this.home.nativeElement.addEventListener('click', () => {
    //   document.getElementById('profile')?.classList.remove('active');
    //   document.getElementById('home')?.classList.add('active');
    //   this.home.nativeElement.classList.add('active');
    //   this.profile.nativeElement.classList.remove('active');
    //   this.currentTab.set(0);
    // })

    // this.profile.nativeElement.addEventListener('click', () => {
    //   document.getElementById('home')?.classList.remove('active');
    //   document.getElementById('profile')?.classList.add('active');
    //   this.profile.nativeElement.classList.add('active');
    //   this.home.nativeElement.classList.remove('active');
    //   this.currentTab.set(1);
    // })
  }

  openFormModal() {
    var formModal = this.form.open(FormModalComponent, {
      width: '800px',
      maxWidth: '800px',
      enterAnimationDuration: '0.3s',
      exitAnimationDuration: '0.3s',
      autoFocus: "false",
      panelClass: "custom-modal-form",
      data: {
        formTitle: 'Add New Task',
        isUpdate: false
      }
    })

    formModal.backdropClick().subscribe(() => {
      this.toggleAddPopUp(false);
    })

    formModal.afterOpened().subscribe(() => {
      this.toggleAddPopUp(true);
    })

    formModal.afterClosed().subscribe(res => {
      if (res) {
        this.addTask(res);
      }
    })
  }

  loadTasks(): void {
    this.isLoading.set(true);
    this.taskService.getTasks().subscribe({
      next: (response) => {
        if (response.isSucceed) {
          this.pendingTasks.set(response.data.filter(t => !t.isCompleted));
          this.completedTasks.set(response.data.filter(t => t.isCompleted));
          this.selectedTask.next(this.pendingTasks()[0]);
          this.selectedId.set(this.pendingTasks()[0].id);
        }
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error fetching tasks api:', err);
        this.toastr.error('Server error', 'Error');
        this.isLoading.set(false);
      }
    })
  }

  addTask(task: TaskCreateRequest): void {
    this.isLoading.set(true);
    task.priority = parseInt(task.priority.toString());
    if (!task.imageUrl) {
      task.imageUrl = this.defaultImageUrl;
    }
    this.taskService.addTask(task).subscribe({
      next: (res) => {
        if (res.isSucceed) {
          this.pendingTasks().push(res.data);
          this.sortPendingTasks();
          this.toastr.success('Add successfully', 'Success');
        }
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error adding task: ', err);
        this.toastr.error('Server error', 'Error');
        this.isLoading.set(false);
      }
    })
  }

  selectTask(id: number) {
    let task = this.pendingTasks().find(task => task.id === id);
    if (!task) {
      task = this.completedTasks().find(task => task.id === id)
    }
    this.selectedTask.next(task);
    this.selectedId.set(task?.id!);
  }

  updateTask(task: TaskUpdateRequest) {
    this.isLoading.set(true);
    this.taskService.updateTask(task).subscribe({
      next: (res) => {
        if (res.isSucceed) {
          this.toastr.success('Change successfully', 'Success');
        }
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error update task: ', err);
        this.isLoading.set(false);
      }
    })
  }

  dropHandle(event: CdkDragDrop<Task[]>) {
    let selectedTask = this.currentTab() == 0 ? this.pendingTasks()[event.previousIndex] : this.completedTasks()[event.previousIndex];
    const targetTask = this.currentTab() == 0 ? this.pendingTasks()[event.currentIndex] : this.completedTasks()[event.currentIndex];
    moveItemInArray(this.currentTab() == 0 ? this.pendingTasks() : this.completedTasks(), event.previousIndex, event.currentIndex);
    if (event.previousIndex === event.currentIndex) {
      return;
    }
    selectedTask.priority = targetTask.priority;
    selectedTask.status = targetTask.status;
    selectedTask.isCompleted = targetTask.isCompleted;

    if (!this.statusObj || !this.priorityObj) {
      this.initStatusAndPrioritiesObj();
    }

    this.updateTask({
      id: selectedTask.id,
      title: selectedTask.title,
      description: selectedTask.description,
      priority: this.priorityObj[selectedTask.priority],
      status: this.statusObj[selectedTask.status],
      expiredAt: selectedTask.expiredAt,
      imageUrl: selectedTask.imageUrl
    });
  }

  handleTabChange(e: MatTabChangeEvent) {
    this.currentTab.set(e.index);
  }

  handleFilterPriorities(selectedPrios: string[]) {
    this.selectedPrios.set(selectedPrios);
  }

  handleFilterCreatedDate(selectedDateRange: DateRange | undefined) {
    this.selectedCreatedDateRange.set(selectedDateRange);
  }

  handleFilterExpiredDate(selectedDateRange: DateRange | undefined) {
    this.selectedExpiredDateRange.set(selectedDateRange);
  }

  toggleAddPopUp(status: boolean) {
    this.isAddModalPopup.set(status);
  }

  //SUPPORT FUNC
  sortPendingTasks() {
    if (!this.statusObj || !this.priorityObj) {
      this.initStatusAndPrioritiesObj();
    }

    this.pendingTasks().sort((a, b) => {
      if (a.status !== b.status) {
        return this.statusObj[a.status] - this.statusObj[b.status];
      }

      if (a.priority !== b.priority) {
        return this.priorityObj[b.priority] - this.priorityObj[a.priority];
      }

      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    })
  }

  initStatusAndPrioritiesObj() {
    const statusList: Dictionary[] = JSON.parse(localStorage.getItem(this.statusStoredKey)!);
    const priorities: Dictionary[] = JSON.parse(localStorage.getItem(this.priorityStoredKey)!);

    this.statusObj = Object.fromEntries(statusList.map(item => [item.value, item.key]));
    this.priorityObj = Object.fromEntries(priorities.map(item => [item.value, item.key]));
  }
}
