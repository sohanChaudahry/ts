import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Injectable()
export class ActivitiesService {

  private headers = new Headers({ 'Content-Type': 'application/json', 'charset': 'UTF-8','authorization':localStorage.getItem('token') });
  private options = new RequestOptions({ headers: this.headers });

  constructor(private http: Http) { }

  getActivities(): Observable<any> {
    return this.http.get('/api/activities').map(res => res.json());
  }

  countActivities(): Observable<any> {
    return this.http.get('/api/activities/count').map(res => res.json());
  }

  addActivities(activities): Observable<any> {
    return this.http.post('/api/activities/create', JSON.stringify(activities), this.options).map(res => res.json());
  }
 
  getActivity(activities): Observable<any> {
    return this.http.get(`/api/activities/${activities._id}`).map(res => res.json());
  }

  editActivities(activities): Observable<any> {
    return this.http.put(`/api/activities/update/${activities._id}`, JSON.stringify(activities), this.options).map(res => res.json());
  }

  deleteActivities(activities): Observable<any> {
    return this.http.delete(`/api/activities/${activities._id}`, this.options);
  }

}
