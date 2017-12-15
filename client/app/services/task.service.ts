import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Injectable()
export class TaskService {

  private headers = new Headers({ 'Content-Type': 'application/json', 'charset': 'UTF-8'});

  private options = new RequestOptions({ headers: this.headers });

  constructor(private http: Http) { }
  
  getTaskAssigedFrom(id): Observable<any> {
    return this.http.get(`/api/tasks/getDetailsByAssignFrom/${id}`,this.options).map(res => res.json());
  }
  getTaskAssigedToUs(id): Observable<any> {
    return this.http.get(`/api/tasks/getDetailsByAssignTo/${id}`,this.options).map(res => res.json());
  }
  getProjectDetailById(prodID): Observable<any> {
    return this.http.get(`/api/projects/getdetails/${prodID}`,this.options).map(res => res.json());
  }
  saveTaskDetail(reqData): Observable<any> {
    return this.http.post('/api/tasks/save_update_Tasks', JSON.stringify(reqData), this.options).map(res => res.json());
  }
}
