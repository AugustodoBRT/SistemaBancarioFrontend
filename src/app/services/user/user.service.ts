import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, tap } from 'rxjs';
import { User } from '../../models/User';
import { CookieService } from 'ngx-cookie-service';
import { environment } from '../../../environments/environment';
import { HistoryDTO } from '../../models/HistoryDTO';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');

  private userSubject = new BehaviorSubject<User | null>(null);

  public readonly user$ = this.userSubject.asObservable();

  constructor(private httpClient: HttpClient, private cookieService: CookieService) { }


  getUserLoggedIn(): Observable<User> {

    const cachedUser = this.userSubject.value;

    if (cachedUser) {
      return of(cachedUser);
    }

    const userInfoUrl = new URL(environment.apiUrlUserInfo, environment.baseUrl).toString();

    return this.httpClient.get<User>(userInfoUrl, {
      headers: this.headers,
      withCredentials: true
    }).pipe(
      tap(user => this.userSubject.next(user))
    );
  }

  getUserHistory(): Observable<HistoryDTO[]> {
    const url = new URL(environment.apiUrlGetUserHistory, environment.baseUrl).toString();

    return this.httpClient.get<HistoryDTO[]>(url, { headers: this.headers });
  }

  isUserLoggedIn(): boolean {
    return this.userSubject.value !== null;
  }

  logoutUser(): void {
    this.userSubject.next(null);
  }

}
