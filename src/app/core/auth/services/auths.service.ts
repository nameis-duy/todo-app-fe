import { LoginResponse } from './../../models/loginResponse.model';
import { LoginRequest } from './../../models/login.model';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { JwtService } from './jwt.service';
import { AppConstant } from '../../constants/constant';
import { catchError, Observable, tap } from 'rxjs';

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
}
