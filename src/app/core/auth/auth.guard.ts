import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthsService } from './auths.service';

export const authGuard: CanActivateFn = (route, state) => {
  if (inject(AuthsService).isAuthenticated()) {
    return true;
  }
  inject(Router).navigateByUrl('/login');
  return false;
};
