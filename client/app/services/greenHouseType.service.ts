import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Injectable()
export class GreenHouseTypeService {

  // private headers = new Headers({ 'Content-Type': 'application/json', 'charset': 'UTF-8' });
  private headers = new Headers({ 'Content-Type': 'application/json', 'charset': 'UTF-8','authorization':localStorage.getItem('token') });

  private options = new RequestOptions({ headers: this.headers });

  constructor(private http: Http) { }

  getGreenHouseTypes(): Observable<any> {
    return this.http.get('/api/greenHouseType/get').map(res => res.json());
  }

  countGreenHouseTypes(): Observable<any> {
    return this.http.get('/api/greenHouseType/count').map(res => res.json());
  }

  addGreenHouseType(greenHouseType): Observable<any> {
    return this.http.post('/api/greenhouseType/create', JSON.stringify(greenHouseType), this.options).map(res => res.json());
  }

  updateGreenHouseType(greenHouseType,id): Observable<any> {
    return this.http.put(`/api/greenhouseType/update/${id}`, JSON.stringify(greenHouseType), this.options).map(res => res.json());
  }

  getGreenHouseType(greenHouseType): Observable<any> {
    return this.http.get(`/api/greenHouseType/${greenHouseType._id}`).map(res => res.json());
  }

  deleteGreenHouseType(greenHouseType): Observable<any> {
    return this.http.delete(`/api/greenHouseType/${greenHouseType._id}`, this.options);
  }

  addActivitiesApi(activities): Observable<any> {
    return this.http.post('/api/activities/save', JSON.stringify(activities), this.options).map(res => res.json());
  }
 
  getActivityById(Act): Observable<any> {  
    return this.http.get(`/api/activities/getActivities/${Act._id}`).map(res => res.json());
  }
}
