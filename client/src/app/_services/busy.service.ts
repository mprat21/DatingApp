import { inject, Injectable } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable({
  providedIn: 'root'
})
export class BusyService {
  //created this to keep a count
  busyRequestCount = 0;

  //injected ngx spinner
  spinnerService = inject(NgxSpinnerService);


  //this method adds the loading spinner
  //1st param is name so we keep it undefined and after it three things are passed i.e. type of spinner, background color,
  // color of spinner
  busy() {
    this.busyRequestCount++;
    this.spinnerService.show(undefined, {
      type: 'line-scale-party',
      bdColor: 'rgba(255,255,255,0)',
      color: '#333333'
    });
  }


  //this method hides the spinner where we set counter to 0 and then hide the spinner
  idle() {
    this.busyRequestCount--;
    if (this.busyRequestCount <= 0) {
      this.busyRequestCount = 0;
      this.spinnerService.hide();
    }

  }
}
