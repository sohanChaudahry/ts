import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Injectable()
export class FeedbackService {

  // private headers = new Headers({ 'Content-Type': 'application/json', 'charset': 'UTF-8' });
  private headers = new Headers({ 'Content-Type': 'application/json', 'charset': 'UTF-8','authorization':localStorage.getItem('token') });

  private options = new RequestOptions({ headers: this.headers });

  constructor(private http: Http) { }

  getFeedbackApi(): Observable<any> {
    return this.http.get('/api/feedbacks').map(res => res.json());
  }
  
}
