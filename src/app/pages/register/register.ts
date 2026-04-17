import {Component, computed, inject, signal} from '@angular/core';
import {MatIcon} from '@angular/material/icon';
import {FormBuilder, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {CustomValidators} from '../../commons/custom-validators';
import {AuthService} from '../../services/auth.service';
import {SweetAlertService} from '../../services/sweet-alert.service';
import {Router} from '@angular/router';
import {CONSTANTS} from '../../commons/constants';
import {toSignal} from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-register',
  imports: [
    MatIcon,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {

  textFooter = CONSTANTS.TITLE_APP;
  $isLoading = signal(false);
  $showPassword = signal(false);
  $showConfirmPassword = signal(false);
  $showRegister = signal(false);
  authService = inject(AuthService);
  formBuilder = inject(FormBuilder);
  sweatAlertService = inject(SweetAlertService);
  router = inject(Router);
  formUser = this.formBuilder.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
  });

  formRegister = this.formBuilder.nonNullable.group({
    name: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    confirmPassword: ['', [Validators.required, Validators.minLength(8)]],
  }, {
    validators: [CustomValidators.matchFields('password', 'confirmPassword')]
  });

  getFieldEmailFUser() {
    return this.formUser.get('email');
  }

  getFieldName() {
    return this.formRegister.get('name');
  }
  getFieldEmail() {
    return this.formRegister.get('email');
  }

  getFieldPassword() {
    return this.formRegister.get('password');
  }

  getFieldConfirmPassword() {
    return this.formRegister.get('confirmPassword');
  }

  private readonly $passwordValue = toSignal(this.formRegister.controls.password.valueChanges, {
    initialValue: this.formRegister.controls.password.value,
  })

  private readonly $confirmPasswordValue = toSignal(this.formRegister.controls.confirmPassword.valueChanges, {
    initialValue: this.formRegister.controls.confirmPassword.value,
  })

  protected readonly $hasPasswordValue = computed(() => (this.$passwordValue() ?? '').length > 0);
  protected readonly $hasConfirmPasswordValue = computed(() => (this.$confirmPasswordValue() ?? '').length > 0);

  protected togglePasswordVisibility() {
    this.$showPassword.update(v => !v);
  }

  protected toggleConfirmPasswordVisibility() {
    this.$showConfirmPassword.update(v => !v);
  }


  onSubmitValidateUser() {
    if (this.formUser.valid) {
      this.$isLoading.set(true);
      const {email} = this.formUser.getRawValue();
      this.authService.isAvailable(email).subscribe({
        next: (data) => {
          this.$isLoading.set(false);
          if (data.isAvailable) {
            this.$showRegister.set(true);
            this.formRegister.controls.email.setValue(email);
          } else {
            this.router.navigate(['/login'] , { queryParams: { email }});
          }
        },
        error: (error) => {
          this.$isLoading.set(false);
          this.sweatAlertService.error(error.error.message);
        },
      });
    } else {
      this.formUser.markAllAsTouched();
    }
  }

  onSubmitRegister() {
    if (this.formRegister.valid) {
      this.$isLoading.set(true);
      const { name, email, password } = this.formRegister.getRawValue();
      this.authService.registerAndLogin(name, email, password).subscribe({
        next: () => {
          this.$isLoading.set(false);
          this.router.navigate(['/login']);
        },
        error: (error) => {
          this.$isLoading.set(false);
          console.error('Registration failed:', error);
          this.sweatAlertService.error(error.error.message);
        },
      });
    } else {
      this.formRegister.markAllAsTouched();
    }
  }


}
