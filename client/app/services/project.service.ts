import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Injectable()
export class ProjectService {

  private headers = new Headers({ 'Content-Type': 'application/json', 'charset': 'UTF-8'});

  private options = new RequestOptions({ headers: this.headers });

  constructor(private http: Http) { }

  getAllEmployee(): Observable<any> {
    return this.http.get('/api/employees/getAllEmployeeDetails/',this.options).map(res => res.json());
  }
  getrequestedProjects(): Observable<any> {
    return this.http.get('/api/employees/getrequestedProjects',this.options).map(res => res.json());
  }
  getEmpDetailApi(reqData): Observable<any> {
    return this.http.post('/api/employees/getdetailsByEmail', JSON.stringify(reqData), this.options).map(res => res.json());
  }
  getProjectDetailById(prodID): Observable<any> {
    return this.http.get(`/api/projects/getdetails/${prodID}`,this.options).map(res => res.json());
  }
  accpetProject(prodID): Observable<any> {
    return this.http.get(`/api/employees/request/accept/${prodID}`,this.options).map(res => res.json());
  }
  rejectProject(prodID): Observable<any> {
    return this.http.get(`/api/employees/request/cancel/${prodID}`,this.options).map(res => res.json());
  }
  saveProjectDetails(reqData): Observable<any> {
    return this.http.post('/api/projects/save', JSON.stringify(reqData), this.options).map(res => res.json());
  }
  removeAssignUser(reqData): Observable<any> {
    return this.http.post('/api/followers/delete', JSON.stringify(reqData), this.options).map(res => res.json());
  }
  deleteProject(prodID): Observable<any> {
    return this.http.get(`/api/projects/delete/${prodID}`,this.options).map(res => res.json());
  }
  getTaskDetailsByAssignFrom(reqData): Observable<any> {
    return this.http.post('/api/tasks/getDetailsByAssignFrom', JSON.stringify(reqData), this.options).map(res => res.json());
  }
  getDetailsByAssignTo(reqData): Observable<any> {
    return this.http.post(' /api/tasks/getDetailsByAssignTo', JSON.stringify(reqData), this.options).map(res => res.json());
  } 
}
