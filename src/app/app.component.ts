import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoginComponent } from "./core/auth/login/login.component";
import { RegisterComponent } from "./core/auth/register/register.component";

@Component({
  selector: 'app-root',
  imports: [RegisterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'todo-app-fe';
}
