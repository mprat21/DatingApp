import { NgIf } from '@angular/common';
import { Component, input, Self } from '@angular/core';
import { ControlValueAccessor, FormControl, NgControl, ReactiveFormsModule } from '@angular/forms';
import { BsDatepickerConfig, BsDatepickerModule } from 'ngx-bootstrap/datepicker';


@Component({
  selector: 'app-date-picker',
  standalone: true,
  imports: [ReactiveFormsModule, BsDatepickerModule, NgIf],   //add the imports in array
  templateUrl: './date-picker.component.html',
  styleUrl: './date-picker.component.css'
})
export class DatePickerComponent implements ControlValueAccessor {
  maxDate = input<Date>();
  label = input<string>('');
  bsConfig?: Partial<BsDatepickerConfig>;   //using partial makes every property inside bsconfig optional to fix error, BsDatepickerConfig has config of date picker

  constructor(@Self() public ngControl: NgControl) {
    this.ngControl.valueAccessor = this;

    //defined  properties for bsConfig here
    this.bsConfig = {
      containerClass: 'theme-red',   //set theme as red
      dateInputFormat: 'DD MMMM YYYY' // date format
    }
  }

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
