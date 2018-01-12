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
  saveAssetDetail(reqData): Observable<any> {
    return this.http.post('/api/assets/save_update_assets', JSON.stringify(reqData), this.options).map(res => res.json());
  }
  get_repair_request_history(reqData): Observable<any> {
    return this.http.post('/api/assets/get_repair_request_history', JSON.stringify(reqData), this.options).map(res => res.json());
  }
  saveRepairRequest(reqData): Observable<any> {
    return this.http.post('/api/assets/save_repair_request', JSON.stringify(reqData), this.options).map(res => res.json());
  }
  deleteAssets(prodID): Observable<any> {
    return this.http.get(`/api/assets/deleteAssets/${prodID}`,this.options).map(res => res.json());
  }
}
