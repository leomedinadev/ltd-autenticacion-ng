import {AbstractControl, ValidationErrors, ValidatorFn} from '@angular/forms';

export class CustomValidators {
  static noWhitespace(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = (control.value ?? '').toString();
      if (value.length === 0) {
        return null;
      }
      return value.trim().length === 0 ? {whitespace: true} : null;
    };
  }

  static matchFields(field: string, confirmField: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const group = control;
      const fieldControl = group.get(field);
      const confirmControl = group.get(confirmField);

      if (!fieldControl || !confirmControl) {
        return null;
      }

      const mismatch = fieldControl.value !== confirmControl.value;
      if (mismatch) {
        const currentErrors = confirmControl.errors ?? {};
        confirmControl.setErrors({...currentErrors, fieldMismatch: true});
      } else {
        const {fieldMismatch, ...rest} = confirmControl.errors ?? {};
        confirmControl.setErrors(Object.keys(rest).length > 0 ? rest : null);
      }

      return null;
    };
  }
}
