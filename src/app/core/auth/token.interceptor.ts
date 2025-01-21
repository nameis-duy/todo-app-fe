import { HttpInterceptorFn } from '@angular/common/http';
import { AppConstant } from '../constants/constant';
import { inject } from '@angular/core';
import { JwtService } from '../services/jwt.service';

export const customInterceptor: HttpInterceptorFn = (req, next) => {
  const jwtService = inject(JwtService);
  const token = jwtService.getToken();
  const clonedReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  })

  return next(clonedReq);
};
