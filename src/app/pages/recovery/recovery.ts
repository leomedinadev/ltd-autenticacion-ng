import {Component, computed, inject, signal} from '@angular/core';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatIcon} from '@angular/material/icon';
import {toSignal} from '@angular/core/rxjs-interop';
import {CustomValidators} from '../../commons/custom-validators';
import {CONSTANTS} from '../../commons/constants';
import {AuthService} from '../../services/auth.service';
import {SweetAlertService} from '../../services/sweet-alert.service';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-recovery',
  imports: [ReactiveFormsModule, MatIcon],
  templateUrl: './recovery.html',
  styleUrl: './recovery.css',
})
export class Recovery {

  textFooter = CONSTANTS.TITLE_APP;
  token = '';
  $showNewPassword = signal(false);
  $showConfirmPassword = signal(false);

  formBuilder = inject(FormBuilder);
  authService = inject(AuthService);
  sweetAlertService = inject(SweetAlertService);
  router = inject(Router);
  route = inject(ActivatedRoute);

  recoveryForm = this.formBuilder.nonNullable.group({
    newPassword: ['', [Validators.required, Validators.minLength(8)]],
    confirmPassword: ['', [Validators.required, Validators.minLength(8)]],
  }, {
    validators: [CustomValidators.matchFields('newPassword', 'confirmPassword')]
  });

  constructor() {
    this.route.queryParams.subscribe(params => {
      this.token = params['token'] ?? '';
      if (!this.token) {
        this.router.navigate(['/login']);
      }
    });
  }

  getFieldNewPassword() {
    return this.recoveryForm.get('newPassword');
  }

  getFieldConfirmPassword() {
    return this.recoveryForm.get('confirmPassword');
  }

  private readonly $newPasswordValue = toSignal(this.recoveryForm.controls.newPassword.valueChanges, {
    initialValue: this.recoveryForm.controls.newPassword.value,
  })

  private readonly $confirmPasswordValue = toSignal(this.recoveryForm.controls.confirmPassword.valueChanges, {
    initialValue: this.recoveryForm.controls.confirmPassword.value,
  })

  protected readonly $hasNewPasswordValue = computed(() => (this.$newPasswordValue() ?? '').length > 0);
  protected readonly $hasConfirmPasswordValue = computed(() => (this.$confirmPasswordValue() ?? '').length > 0);

  protected toggleNewPasswordVisibility() {
    this.$showNewPassword.update(v => !v);
  }

  protected toggleConfirmPasswordVisibility() {
    this.$showConfirmPassword.update(v => !v);
  }

  onSubmitRecovery() {
    if (this.recoveryForm.valid) {
      console.log('Recovery:', this.recoveryForm.getRawValue());
      const {newPassword} = this.recoveryForm.getRawValue();
      this.authService.changePassword(this.token, newPassword).subscribe({
        next: (data) => {
          console.log('Response: ', data);
          this.router.navigate(['/login']);
        },
        error: (error) => {
          let message = '';
          if ( typeof error.error.error === 'string') {
            if (typeof error.error.message === 'string') {
              message = error.error.message;
            } else if (Array.isArray(error.error.message)) {
              message = error.error.message.join('\n');
            }
          } else if (Array.isArray(error.error.error)) {
            message = error.error.message;
          }
          console.log(message);
          this.sweetAlertService.error(message);
        },
      })
    } else {
      this.recoveryForm.markAllAsTouched();
    }
  }
}
