import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {checkToken} from '../interceptors/token-interceptor';

@Injectable({
  providedIn: 'root',
})
export class UserService {

  http = inject(HttpClient);

  getUsers() {
    return this.http.get(`${environment.API_URL}/api/v1/users`, { context: checkToken() });
  }
}
