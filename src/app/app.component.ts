import { Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { JwtService } from './core/services/jwt.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'TodoApp';
  jwtService = inject(JwtService);
  router = inject(Router);

  ngOnInit() {
    const token = this.jwtService.getToken();
    if (!token && this.router.url !== 'register') {
      this.router.navigateByUrl('/login');
    }
  }
}
