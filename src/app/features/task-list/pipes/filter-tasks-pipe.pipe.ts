import { Pipe, PipeTransform } from '@angular/core';
import { Task } from '../../../shared/models/task.model';

@Pipe({
  name: 'filterTasksPipe'
})
export class FilterTasksPipePipe implements PipeTransform {

  transform(tasks: Task[], searchText: string): Task[] {
    if (!searchText) {
      return tasks;
    }
     return tasks.filter(t => t.title.toLocaleLowerCase().includes(searchText.trim().toLocaleLowerCase()));
  }

}
