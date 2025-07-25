import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Deposit } from '../../models/Deposit';
import { BankStatement } from '../../models/BankStatement';

@Injectable({
  providedIn: 'root'
})
export class BankStatementService {

  private headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');

  constructor(private httpClient: HttpClient) { }


  getAccountBankStatements(numeroConta: string): Observable<BankStatement[]> {
    
    const getUserBankStatementUrl = new URL(`${environment.apiGetUserBankStatementUrl}/${numeroConta}`, environment.baseUrl).toString();
  
    return this.httpClient.get<BankStatement[]>(getUserBankStatementUrl, {
      headers: this.headers
    });
  }
}
