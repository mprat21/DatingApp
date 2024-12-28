import { NgIf } from '@angular/common';
import { Component, input, Self } from '@angular/core';
import { ControlValueAccessor, FormControl, NgControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-text-input',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf],
  templateUrl: './text-input.component.html',
  styleUrl: './text-input.component.css'
})

//Step1: implement to ControlValueAccessor and just add methods from interface with no code added to it
export class TextInputComponent implements ControlValueAccessor {
  type = input<string>('text'); //Step2: property for taking input type say password, default is text
  label = input<string>('');  //Step3: property for taking lavel say Username label of password label


  //Step4: we pass individual elements say username, password and each one would have its own ngControl object like FormControl
  constructor(@Self() public ngControl: NgControl) {
    this.ngControl.valueAccessor = this;

  }

  //Step6:  we created this getter so we can make use of it to access  over the typescript error we get when accessing [formControl]
  get control(): FormControl {
    return this.ngControl.control as FormControl;
  }


  writeValue(obj: any): void {
  }
  registerOnChange(fn: any): void {
  }
  registerOnTouched(fn: any): void {
  }



}
