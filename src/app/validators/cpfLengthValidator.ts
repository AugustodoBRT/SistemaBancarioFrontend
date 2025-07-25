import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function cpfLengthValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;

    if (value === null || value === undefined) {
      return { required: true };
    }

    const strValue = value.toString();

    if (strValue.length !== 11) {
      return { cpfLength: true };
    }

    return null;
  };
}
