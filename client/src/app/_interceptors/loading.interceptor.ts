import { HttpInterceptorFn } from '@angular/common/http';
import { BusyService } from '../_services/busy.service';
import { inject } from '@angular/core';
import { delay, finalize } from 'rxjs';

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {


  //inject the busy service to access methods and call the spinner .busy()
  const busyService = inject(BusyService);
  busyService.busy();


  //after we get our request and its observable so use pipe and then add delay of 1 sec and 
  // then use finalize which will happen after the request is complete and has come back and here we set it back to idle 
  return next(req).pipe(
    delay(1000),
    finalize(
      () => {
        busyService.idle()
      }
    )
  );
};
