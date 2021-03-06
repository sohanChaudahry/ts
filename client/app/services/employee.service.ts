import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Injectable()
export class EmployeeService {

  private headers = new Headers({ 'Content-Type': 'application/json', 'charset': 'UTF-8'});

  private options = new RequestOptions({ headers: this.headers });

  constructor(private http: Http) { }

  getAllEmployeeDetailswithPagination(reqData): Observable<any> {
    return this.http.post('/api/employees/getAllEmployeeDetailswithPagination/', JSON.stringify(reqData), this.options).map(res => res.json());
  }
  getdetailsByEmailwithPagination(reqData): Observable<any> {
    return this.http.post('/api/employees/getdetailsByEmailwithPagination', JSON.stringify(reqData), this.options).map(res => res.json());
  } 
}
