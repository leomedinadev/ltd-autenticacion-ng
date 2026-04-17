import { Routes } from '@angular/router';
import {authGuard} from './guard/auth-guard';
import {redirectGuard} from './guard/redirect-guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', loadComponent: () => import('./pages/login/login').then((c) => c.Login), canActivate: [ redirectGuard ] },
  { path: 'register', loadComponent: () => import('./pages/register/register').then((c) => c.Register), canActivate: [ redirectGuard ] },
  { path: 'forgot-password', loadComponent: () => import('./pages/forgot-password-form/forgot-password-form').then((c) => c.ForgotPasswordForm), canActivate: [ redirectGuard ] },
  { path: 'recovery', loadComponent: () => import('./pages/recovery/recovery').then((c) => c.Recovery), canActivate: [ redirectGuard ] },
  { path: 'dashboard', loadComponent: () => import('./pages/dashboard/dashboard').then((c) => c.Dashboard) , canActivate: [ authGuard ]},
  { path: 'not-found', loadComponent: () => import('./pages/not-found/not-found').then((c) => c.NotFound)},
  { path: '**', redirectTo: 'not-found'}
];
