import { Component, inject } from '@angular/core';
import { AuthsService } from '../../../core/auth/auths.service';
import { Router } from '@angular/router';
import { JwtService } from '../../../core/services/jwt.service';

@Component({
  selector: 'app-sidebar',
  imports: [],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent {
  authService = inject(AuthsService);
  jwtService = inject(JwtService);
  router = inject(Router);
  
  name = '';
  email = '';

  ngOnInit() {
    const userInfor = this.jwtService.getTokenInfor();
    this.name = userInfor['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'];
    this.email = userInfor['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'];
  }
  
  onLogout() {
    this.authService.logout();
    this.router.navigateByUrl("/login");
  }
}
