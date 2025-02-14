import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeadersComponent } from "./shared/components/headers/headers.component";
import { AuthsService } from './core/auth/auths.service';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from "./shared/components/sidebar/sidebar.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeadersComponent, CommonModule, SidebarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  authService = inject(AuthsService);
  isAuthen = signal<boolean>(false);
  
  ngDoCheck() {
    this.isAuthen.set(this.authService.isAuthenticated());
  }
}
