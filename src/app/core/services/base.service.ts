import { inject, Injectable } from '@angular/core';
import { AppConstant } from '../constants/constant';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BaseService {
  private readonly API_URL = AppConstant.URL + "enum";

  http = inject(HttpClient);

  getPriorities() : Observable<{ [key: number]: string }> {
    return this.http.get<{ [key: number]: string }>(this.API_URL + "/priority");
  }

  getStatus() : Observable<{ [key: number]: string }> {
    return this.http.get<{ [key: number]: string }>(this.API_URL + "/status");
  }
}
