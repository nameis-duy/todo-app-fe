import { Component, inject } from '@angular/core';
import { AuthsService } from '../../../core/auth/auths.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  imports: [],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent {
  authService = inject(AuthsService);
  router = inject(Router);
  
  onLogout() {
    this.authService.logout();
    this.router.navigateByUrl("/login");
  }
}
