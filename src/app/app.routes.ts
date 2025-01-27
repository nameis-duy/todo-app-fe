import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { authGuard } from './core/auth/auth.guard';
import { TaskDetailComponent } from './features/task-detail/task-detail.component';

export const routes: Routes = [
    {
        path: "",
        pathMatch: "full",
        component: HomeComponent,
        canActivate: [authGuard]
    },
    {
        path: "tasks/:id",
        component: TaskDetailComponent,
        canActivate: [authGuard]
    },
    {
        path: "login",
        component: LoginComponent
    },
    {
        path: "register",
        component: RegisterComponent
    }
];
