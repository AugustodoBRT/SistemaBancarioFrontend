import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Deposit } from '../../models/Deposit';
import { Withdrawal } from '../../models/Withdrawal';

@Injectable({
  providedIn: 'root'
})
export class WithDrawalService {

  private headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');

  constructor(private httpClient: HttpClient) { }


  withdraw(withdrawal: Withdrawal): Observable<void> {

    const withdrawalUrl = new URL(environment.apiWithdrawalUrl, environment.baseUrl).toString();

    const requestBody: string = JSON.stringify(withdrawal);

    return this.httpClient.post<void>(withdrawalUrl, requestBody, { headers: this.headers });
  }
}
