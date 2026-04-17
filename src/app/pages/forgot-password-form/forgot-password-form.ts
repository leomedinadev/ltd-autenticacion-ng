import {Component, inject, signal} from '@angular/core';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatIcon} from '@angular/material/icon';
import {AuthService} from '../../services/auth.service';
import {SweetAlertService} from '../../services/sweet-alert.service';

@Component({
  selector: 'app-forgot-password-form',
  imports: [ReactiveFormsModule, MatIcon],
  templateUrl: './forgot-password-form.html',
  styleUrl: './forgot-password-form.css',
})
export class ForgotPasswordForm {

  $sendEmail = signal(false);
  formBuilder = inject(FormBuilder);
  authService = inject(AuthService);
  sweetAlertService = inject(SweetAlertService);

  forgotPasswordForm = this.formBuilder.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
  });

  getFieldEmail() {
    return this.forgotPasswordForm.get('email');
  }

  onSubmitForgotPassword() {
    if (this.forgotPasswordForm.valid) {
      console.log('Forgot password:', this.forgotPasswordForm.getRawValue());
      const {email} = this.forgotPasswordForm.getRawValue();
      this.authService.recovery(email).subscribe({
        next: (data) => {
          console.log('Recovery successful:', data);
        },
        error: (error) => {
          console.error('Recovery failed:', error);
          let message = 'No pudo realizar la operación, por favor intentelo mas tarde.';
          if (error.error?.name === 'EntityNotFoundError') {
            message = 'Correo no registrado.';
          }
          this.sweetAlertService.error(message);
        },
      })
    } else {
      this.forgotPasswordForm.markAllAsTouched();
    }
  }
}
