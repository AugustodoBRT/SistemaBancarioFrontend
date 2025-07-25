import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Client} from '../../models/Client';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  private headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');

  constructor(private httpClient: HttpClient) { }


  registerClient(client: Client): Observable<void> {
    const registerClientUrl = new URL(environment.apiRegisterUserUrl, environment.baseUrl).toString();

    const requestBody: string = JSON.stringify(client);

    return this.httpClient.post<void>(registerClientUrl, requestBody, {headers:this.headers});
  }
}
