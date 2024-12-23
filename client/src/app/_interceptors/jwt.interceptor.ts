import { HttpInterceptorFn } from '@angular/common/http';
import { AccountService } from '../_services/account.service';
import { inject } from '@angular/core';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const accountService = inject(AccountService);
  req = req.clone(
    {
      setHeaders: {
        Authorization: `Bearer ${accountService.currentUser()?.token}`
      }
    }
  );
  return next(req);  //here we send new request with authorization header. We have to tell our application about interceptor 
  // and we add it in app.config.ts in provideHttpClient
};
