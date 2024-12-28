import { Component, inject, OnInit, output } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { AccountService } from '../_services/account.service';
import { TextInputComponent } from "../_forms/text-input/text-input.component";
import { DatePickerComponent } from "../_forms/date-picker/date-picker.component";
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, TextInputComponent, DatePickerComponent],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit {
  validationErrors: string[] | undefined; //Step3: added to catch server side validations
  private router = inject(Router);   //Step1: added router
  maxDate = new Date;
  private fb = inject(FormBuilder);
  private accountService = inject(AccountService);
  cancelRegister = output<boolean>();
  registerForm: FormGroup = new FormGroup({});

  ngOnInit(): void {
    this.initializeForm(); //calling initialize form
    this.maxDate.setFullYear(this.maxDate.getFullYear() - 18); //added this so guys cannot select dob if they are less than 18 years
  }

  initializeForm() {

    this.registerForm = this.fb.group({
      gender: ['male'],
      username: ['', Validators.required],
      knownAs: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
      city: ['', Validators.required],
      country: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(8)]], //array of validations added
      confirmPassword: ['',
        [Validators.required, this.matchValues('password')]]
    });
    this.registerForm.controls['password'].valueChanges.subscribe({
      next: () => {
        this.registerForm.controls['confirmPassword'].updateValueAndValidity();
      }
    })
  }



  matchValues(matchTo: string): ValidatorFn {
    return (control: AbstractControl) => {
      return control.value === control.parent?.get(matchTo)?.value ? null : { isMatching: true } //isMatching user defined property canbe any named is used to check errors i.e. true means errors
    }

  }

  register() {

    //step7: call the getdate only method to get the date part only of dob
    const dob = this.getDateOnly(this.registerForm.get('dateOfBirth')?.value);
    //Step8: The patchValue method is used in Angular's reactive forms to update the value of a form control or form group.
    //Step 8a: In this specific case, it is being used to update the dateOfBirth field of the form with the value of dob.
    this.registerForm.patchValue({ dateOfBirth: dob });
    this.accountService.register(this.registerForm.value).subscribe(   //step10: changed to this.registerForm. value so values are sent
      {
        next: _ => {
          this.router.navigateByUrl('/member'); //Step2: as they would be logged in after register, redirect them to member list page;
        },
        error: error => this.validationErrors = error //Step4: we capture server side validations and then will display into html page
      }
    )
  }

  //step6: create get date only method that returns date part in string
  private getDateOnly(dob: string | undefined) {
    if (!dob) return;
    return new Date(dob).toISOString().slice(0, 10); //step6a: slice removes the time part in the end so only date month year is taken
  }

  cancel() {
    this.cancelRegister.emit(false);
  }
}
