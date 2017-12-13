import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Injectable()
export class ProjectService {

  private headers = new Headers({ 'Content-Type': 'application/json', 'charset': 'UTF-8','Access-Control-Allow-Origin': '*'});

  private options = new RequestOptions({ headers: this.headers });

  constructor(private http: Http) { }

  getAllEmployee(): Observable<any> {
    return this.http.get('/api/employees/getAllEmployeeDetails/',this.options).map(res => res.json());
  }
}
