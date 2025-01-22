import { Component, inject } from '@angular/core';
import { AuthsService } from '../../core/auth/auths.service';
import { Router } from '@angular/router';
import { TaskListComponent } from "../task-list/task-list.component";

@Component({
  selector: 'app-home',
  imports: [TaskListComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  authService = inject(AuthsService);
  router = inject(Router);
  
  onLogout() {
    this.authService.logout();
    this.router.navigateByUrl("/login");
  }
}
