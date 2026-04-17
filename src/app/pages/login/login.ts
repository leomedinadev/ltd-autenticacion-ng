import {Component, computed, inject, signal} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatIcon} from '@angular/material/icon';
import {toSignal} from '@angular/core/rxjs-interop';
import {AuthService} from '../../services/auth.service';
import {Router} from '@angular/router';
import {SweetAlertService} from '../../services/sweet-alert.service';
import {CONSTANTS} from '../../commons/constants';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, MatIcon],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {

  $isLoading = signal(false);
  $showPassword = signal(false);

  textFooter = CONSTANTS.TITLE_APP;

  authService = inject(AuthService);
  router = inject(Router);
  sweetAlertService = inject(SweetAlertService);

  loginForm = new FormGroup({
    email: new FormControl('' , { nonNullable: true, validators: [Validators.required, Validators.email]}),
    password: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(8)] }),
  });

  getFieldEmail() {
    return this.loginForm.get('email');
  }

  getFieldPassword() {
    return this.loginForm.get('password');
  }
  private readonly $passwordValue = toSignal(this.loginForm.controls.password.valueChanges, {
    initialValue: this.loginForm.controls.password.value,
  })

  protected readonly $hasPasswordValue = computed(() => (this.$passwordValue() ?? '').length > 0);

  protected togglePasswordVisibility() {
    this.$showPassword.update(v => !v);
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.$isLoading.set(true);
      console.log('Form submitted:');
      const {email, password} = this.loginForm.getRawValue();
      console.log(`Email: ${email}, Password: ${password}`);
      this.authService.login(email, password).subscribe({
        next: (data) => {
          this.$isLoading.set(false);
          console.log('Login successful:', data);
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          this.$isLoading.set(false);
          console.error('Login failed:', error);
          let message = '\'Credenciales incorrectas';
          if (error.error?.name === 'EntityNotFoundError') {
            message = 'El usuario no existe';
          }
          this.sweetAlertService.error(message);
        },
      });
    } else {
      this.loginForm.markAllAsTouched();
    }
  }
}
