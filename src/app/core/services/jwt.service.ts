import { inject, Injectable } from '@angular/core';
import { AppConstant } from '../constants/constant';
import { CookieService } from 'ngx-cookie-service';
import { jwtDecode, JwtPayload } from 'jwt-decode';

@Injectable({
    providedIn: 'root'
})
export class JwtService {
    jwtKey = AppConstant.JWT_STORING_KEY;
    jwtRefreshKey = AppConstant.JWT_STORING_REFRESH_KEY;
    cookieService = inject(CookieService);

    getToken(): string {
        return this.cookieService.get(this.jwtKey);
    }

    setToken(token: string): void {
        const expiredAt = new Date();
        expiredAt.setHours(expiredAt.getHours() + 1);
        this.cookieService.set(this.jwtKey, token, { path: '/', secure: true, sameSite: 'Strict', expires: expiredAt });
    }

    getRefreshToken(): string {
        return this.cookieService.get(this.jwtRefreshKey);
    }

    setRefreshToken(token: string): void {
        const expiredAt = new Date();
        expiredAt.setHours(expiredAt.getHours() + 24);
        this.cookieService.set(this.jwtRefreshKey, token, { path: '/', secure: true, sameSite: 'Strict', expires: expiredAt });
    }

    destroyToken(): void {
        localStorage.clear();
        this.cookieService.deleteAll();
    }

    getTokenInfor(): JwtPayload | any {
        const token = this.cookieService.get(this.jwtKey);
        if (token) {
            return jwtDecode(token);
        }

        return null;
    }
}
