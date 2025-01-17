import { Injectable } from '@angular/core';
import { AppConstant } from '../../constants/constant';

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
        window.localStorage[this.jwtKey] = token;
    }

    getRefreshToken(): string {
        return window.localStorage[this.jwtRefreshKey];
    }

    setRefreshToken(token: string): void {
        window.localStorage[this.jwtRefreshKey] = token;
    }

    destroyToken(): void {
        window.localStorage.removeItem(this.jwtKey);
        window.localStorage.removeItem(this.jwtRefreshKey);
    }
}
