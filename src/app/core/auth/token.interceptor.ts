import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { JwtService } from '../services/jwt.service';

export const customInterceptor: HttpInterceptorFn = (req, next) => {
  const jwtService = inject(JwtService);
  const token = jwtService.getToken();
  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      }
    })
  }

  return next(req);
};
