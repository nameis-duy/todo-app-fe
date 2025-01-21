import { Component, inject } from '@angular/core';
import { AuthsService } from '../../core/auth/auths.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [],
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
