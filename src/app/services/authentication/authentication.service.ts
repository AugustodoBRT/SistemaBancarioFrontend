import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginUser } from '../../models/LoginUser';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { UserService } from '../user/user.service';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { LoginResponse } from '../../models/LoginResponse';
import { ConfirmService } from '../confirm/confirm.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');

  constructor(private httpClient: HttpClient, private userService: UserService, private cookieService: CookieService, private router: Router,
    private confirmService: ConfirmService
  ) { }


  login(loginUser: LoginUser): Observable<LoginResponse> {
    const loginUserUrl = new URL(environment.apiLoginUserUrl, environment.baseUrl).toString();

    const requestBody: string = JSON.stringify(loginUser);

    return this.httpClient.post<LoginResponse>(loginUserUrl, requestBody, { headers: this.headers });
  }

  logoutUser() {
    this.cookieService.deleteAll();
    this.userService.logoutUser();

    this.router.navigate(['/login']).then(() => {
      window.location.reload();
    });
  }

  logoutUserSessionExpired() {
    this.cookieService.deleteAll();
    this.userService.logoutUser();

    this.router.navigate(['/login'], { queryParams: { sessionExpired: 'true' } }).then(() => {
      window.location.reload();
    });
  }

  forgotPassword(cpf: string): Observable<void> {
    const url = new URL(environment.apiUrlUpdatePassword, environment.baseUrl).toString();

    const body = { cpf };

    return this.httpClient.post<void>(url, body, {
      headers: this.headers,
      withCredentials: true
    });
  }
}
