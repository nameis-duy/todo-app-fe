import { Component, inject } from '@angular/core';
import { AuthsService } from '../../../core/auth/auths.service';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { JwtService } from '../../../core/services/jwt.service';
import { AppConstant } from '../../../core/constants/constant';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent {
  authService = inject(AuthsService);
  jwtService = inject(JwtService);
  router = inject(Router);

  userNameStoringKey = AppConstant.USER_NAME_STORING_KEY;
  
  name = '';
  email = '';

  ngOnInit() {
    const userInfor = this.jwtService.getTokenInfor();
    this.name = localStorage.getItem(this.userNameStoringKey)!;
    this.email = userInfor['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'];
  }

  updateName() {
    this.name = localStorage.getItem(this.userNameStoringKey)!;
  }
  
  onLogout() {
    this.authService.logout();
    this.router.navigateByUrl("/login");
  }
}
