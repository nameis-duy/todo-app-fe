import { Component, inject, signal } from '@angular/core';
import { AuthsService } from '../../../core/auth/auths.service';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { JwtService } from '../../../core/services/jwt.service';
import { AppConstant } from '../../../core/constants/constant';
import { ShareService } from '../../../core/services/shared.service';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent {
  authService = inject(AuthsService);
  jwtService = inject(JwtService);
  shareService = inject(ShareService);
  router = inject(Router);

  userNameStoringKey = AppConstant.USER_NAME_STORING_KEY;
  
  name = signal<string>('');
  email = '';

  ngOnInit() {
    const userInfor = this.jwtService.getTokenInfor();
    this.shareService.sendMessage(localStorage.getItem(this.userNameStoringKey)!);
    this.shareService.message$.subscribe({
      next: (msg) => {
        this.name.set(msg);
      }
    })
    this.email = userInfor['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'];
  }
  
  onLogout() {
    this.authService.logout();
    this.router.navigateByUrl("/login");
  }
}
