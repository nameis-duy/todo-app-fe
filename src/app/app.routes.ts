import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { authGuard } from './core/auth/auth.guard';
import { AccountComponent } from './features/account/account.component';
import { ChangePasswordComponent } from './features/account/component/change-password/change-password.component';

export const routes: Routes = [
    {
        path: "",
        pathMatch: "full",
        component: HomeComponent,
        canActivate: [authGuard]
    },
    {
        path: "account",
        component: AccountComponent,
        canActivate: [authGuard]
    },
    {
        path: "account/password",
        component: ChangePasswordComponent,
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
