import { RegisterRequest } from './models/register.model';
import { LoginResponse } from './models/loginResponse.model';
import { LoginRequest } from './models/login.model';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { JwtService } from '../services/jwt.service';
import { AppConstant } from '../constants/constant';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthsService {
  http = inject(HttpClient);
  router = inject(Router);
  jwtService = inject(JwtService);
  baseUrl = AppConstant.URL;

  login(loginRequest: LoginRequest): Observable<{ loginRes: LoginResponse }> {
    const loginUrl = this.baseUrl + "auth/login";
    return this.http.post<{ loginRes: LoginResponse }>(loginUrl, loginRequest);
  }

  register(registerRequest: RegisterRequest): Observable<{ regisRes: boolean }> {
    const registerUrl = this.baseUrl + "auth/register";
    return this.http.post<{ regisRes: boolean }>(registerUrl, registerRequest);
  }

  logout() {
    this.jwtService.destroyToken();
  }

  isAuthenticated() : boolean {
    return !!this.jwtService.getToken();
  }
}
