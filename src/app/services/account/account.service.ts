import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginUser } from '../../models/LoginUser';
import { Observable, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Account } from '../../models/Account';
import { AccountLimit } from '../../models/AccountLimit';
import { Transference } from '../../models/Transference';
import { ChavePix } from '../../models/ChavePix';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  private headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');

  constructor(private httpClient: HttpClient) { }


  getUserAccounts(): Observable<Account[]> {
    const getUserAccountsUrl = new URL(environment.apiGetUserAccountsUrl, environment.baseUrl).toString();

    return this.httpClient.get<Account[]>(getUserAccountsUrl, { headers: this.headers });
  }

  getAccountPix(chavePix: string): Observable<Account> {
    const getAccountPixUrl = new URL(environment.apiGetAccountPixUrl, environment.baseUrl).toString();

    return this.httpClient.get<Account>(getAccountPixUrl, {
      headers: this.headers,
      params: { chavePix: chavePix } 
    });
  }


  getAllAccounts(): Observable<Account[]> {
    const getAllAccountsUrl = new URL(environment.apiGetAllAccountsUrl, environment.baseUrl).toString();

    return this.httpClient.get<Account[]>(getAllAccountsUrl, { headers: this.headers });
  }

  createAccount(): Observable<Account> {
    const createUserAccountsUrl = new URL(environment.apiCreateUserAccountUrl, environment.baseUrl).toString();

    return this.httpClient.post<Account>(createUserAccountsUrl, { headers: this.headers });
  }

  newAccountLimit(newLimit: AccountLimit): Observable<void> {

    const updateLimitUrl = new URL(environment.apiUpdateLimitUrl, environment.baseUrl).toString();

    return this.httpClient.put<void>(updateLimitUrl, newLimit, { headers: this.headers });
  }

  newPix(chavePix: ChavePix): Observable<void> {

    const updatePixUrl = new URL(environment.apiUpdatePixUrl, environment.baseUrl).toString();

    return this.httpClient.put<void>(updatePixUrl, chavePix, { headers: this.headers });
  }

  transference(transference: Transference): Observable<void> {
    const transferencetUrl = new URL(environment.apiTransferenceUrl, environment.baseUrl).toString();

    return this.httpClient.put<void>(transferencetUrl, transference, { headers: this.headers });
  }

  pixTransference(transference: Transference): Observable<void> {
    const transferencePixUrl = new URL(environment.apiUpdatePixUrl, environment.baseUrl).toString();

    return this.httpClient.post<void>(transferencePixUrl, transference, { headers: this.headers });
  }
}
