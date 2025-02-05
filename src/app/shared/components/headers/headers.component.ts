import { Component } from '@angular/core';

@Component({
  selector: 'app-headers',
  imports: [],
  templateUrl: './headers.component.html',
  styleUrl: './headers.component.scss'
})
export class HeadersComponent {
  today: Date = new Date();
  daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
}
