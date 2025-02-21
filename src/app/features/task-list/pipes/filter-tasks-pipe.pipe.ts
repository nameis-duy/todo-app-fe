import { Pipe, PipeTransform } from '@angular/core';
import { Task } from '../../../shared/models/task.model';
import { DateRange } from '../../../shared/models/filter/date-range.modal';

@Pipe({
  name: 'filterTasksPipe'
})
export class FilterTasksPipePipe implements PipeTransform {

  transform(tasks: Task[], searchText: string, priorities: string[] | undefined, 
    createdDateRage: DateRange | undefined, expiredDateRange: DateRange | undefined): Task[] {
    if (!searchText && (!priorities || priorities.length === 0) && !createdDateRage && !expiredDateRange) {
      return tasks;
    }
    let filteredTask = [...tasks];
    if (searchText) {
      filteredTask = filteredTask.filter(t => t.title.toLocaleLowerCase().includes(searchText.trim().toLocaleLowerCase()));
    }
    if (priorities && priorities.length !== 0) {
      filteredTask = filteredTask.filter(t => priorities!.includes(t.priority));
    }
    if (createdDateRage) {
      filteredTask = filteredTask.filter(t => new Date(t.createdAt).getDate() >= new Date(createdDateRage.start!).getDate()
        && new Date(t.createdAt).getDate() <= new Date(createdDateRage.end!).getDate());
    }
    if (expiredDateRange) {
      filteredTask = filteredTask.filter(t => new Date(t.createdAt).getDate() >= new Date(expiredDateRange.start!).getDate()
        && new Date(t.createdAt).getDate() <= new Date(expiredDateRange.end!).getDate());
    }
    return filteredTask;
  }
}
