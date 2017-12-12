import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Injectable()
export class GreenHouseService {

  // private headers = new Headers({ 'Content-Type': 'application/json', 'charset': 'UTF-8' });
  private headers = new Headers({ 'Content-Type': 'application/json', 'charset': 'UTF-8','authorization':localStorage.getItem('token') });

  private options = new RequestOptions({ headers: this.headers });

  constructor(private http: Http) { }

  getGreenHouses(): Observable<any> {
    return this.http.get('/api/greenHouse/get').map(res => res.json());
  }

  countGreenHouses(): Observable<any> {
    return this.http.get('/api/greenHouse/count').map(res => res.json());
  }

  addGreenHouse(greenHouse): Observable<any> {
    return this.http.post('/api/greenhouse/create', greenHouse,this.options).map(res => res.json());
  }

  // updateGreenHouse(greenHouse,id): Observable<any> {
  //   return this.http.put(`/api/greenhouse/update/${id}`, greenHouse,this.options).map(res => res.json());
  // }

  getGreenHouse(greenHouse): Observable<any> {
    return this.http.get(`/api/greenHouse/${greenHouse._id}`).map(res => res.json());
  }

  editGreenHouse(greenHouse,id): Observable<any> {
    return this.http.put(`/api/greenHouse/update/${id}`, JSON.stringify(greenHouse), this.options).map(res => res.json());
  }

  deleteGreenHouse(greenHouse): Observable<any> {
    return this.http.delete(`/api/greenHouse/${greenHouse._id}`, this.options);
  }

  getGreenHouseActivity(GNId): Observable<any> {
    return this.http.get(`/api/greenHouse/getActivities/${GNId}`).map(res => res.json());
  }
}
