import { CanActivateFn } from '@angular/router';
import { AccountService } from '../_services/account.service';
import { ToastrService } from 'ngx-toastr';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  const accontService =inject(AccountService);
  const toastr=inject(ToastrService);

  if(accontService.currentUser())
      return true;
  else {
    toastr.error("You shall not pass");
    return false;
  }
};
