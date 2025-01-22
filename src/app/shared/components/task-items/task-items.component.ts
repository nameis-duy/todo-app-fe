import { Component, input } from '@angular/core';
import { Task } from '../../models/task.model';

@Component({
  selector: 'app-task-items',
  imports: [],
  templateUrl: './task-items.component.html',
  styleUrl: './task-items.component.scss'
})
export class TaskItemsComponent {
  task = input.required<Task>();
  checked = input.required<boolean>();
}
