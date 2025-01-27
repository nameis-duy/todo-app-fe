import { Injectable } from '@angular/core';
import { AppConstant } from '../constants/constant';

@Injectable({
    providedIn: 'root'
})
export class JwtService {
    jwtKey = AppConstant.JWT_STORING_KEY;
    jwtRefreshKey = AppConstant.JWT_STORING_REFRESH_KEY;

    getToken(): string {
        return window.localStorage[this.jwtKey];
    }

    setToken(token: string): void {
        window.localStorage.setItem(this.jwtKey, token);
    }

    getRefreshToken(): string {
        return window.localStorage[this.jwtRefreshKey];
    }

    setRefreshToken(token: string): void {
        window.localStorage.setItem(this.jwtRefreshKey, token);
    }

    destroyToken(): void {
        window.localStorage.clear();
    }
}
