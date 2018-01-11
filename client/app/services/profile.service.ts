import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Injectable()
export class ProfileService {

  private headers = new Headers({ 'Content-Type': 'application/json', 'charset': 'UTF-8'});

  private options = new RequestOptions({ headers: this.headers });

  constructor(private http: Http) { }
  
  saveProfile(reqData): Observable<any> {
    return this.http.post('/api/employees/save_update_Employees', JSON.stringify(reqData), this.options).map(res => res.json());
  }
  getAssetList(reqData): Observable<any> {
    return this.http.post('/api/assets/getAssetByEmpId', JSON.stringify(reqData), this.options).map(res => res.json());
  }
}
