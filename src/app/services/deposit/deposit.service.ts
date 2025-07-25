import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Account } from '../../models/Account';
import { Deposit } from '../../models/Deposit';

@Injectable({
  providedIn: 'root'
})
export class DepositService {

  private headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');

  constructor(private httpClient: HttpClient) { }


  deposit(deposit: Deposit): Observable<void> {

    const depositUrl = new URL(environment.apiDepositUrl, environment.baseUrl).toString();

    const requestBody: string = JSON.stringify(deposit);

    return this.httpClient.post<void>(depositUrl, requestBody, { headers: this.headers });
  }
}
