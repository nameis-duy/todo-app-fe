import { Component } from '@angular/core';
import { TaskListComponent } from "../task-list/task-list.component";
import { HeadersComponent } from "../../shared/components/headers/headers.component";
import { SidebarComponent } from "../../shared/components/sidebar/sidebar.component";

@Component({
  selector: 'app-home',
  imports: [TaskListComponent, HeadersComponent, SidebarComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
}
