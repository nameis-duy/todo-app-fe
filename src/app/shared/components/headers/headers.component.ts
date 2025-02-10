import { SearchService } from './../../../core/services/search.service';
import { Component, inject } from '@angular/core';

@Component({
  selector: 'app-headers',
  imports: [],
  templateUrl: './headers.component.html',
  styleUrl: './headers.component.scss'
})
export class HeadersComponent {
  searchService = inject(SearchService);
  searchText = '';

  today: Date = new Date();
  daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  searchTask() {
    this.searchService.searchTask(this.searchText);
  }

  updateSearchText(searchInput: string) {
    this.searchText = searchInput;
    this.searchService.searchTask(searchInput);
  }
}
