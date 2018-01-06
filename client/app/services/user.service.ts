import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Injectable()
export class UserService {

  // private headers = new Headers({ 'Content-Type': 'application/json', 'charset': 'UTF-8' });
  private headers = new Headers({ 'Content-Type': 'application/json', 'charset': 'UTF-8','Access-Control-Allow-Origin': '*' });

  private options = new RequestOptions({ headers: this.headers });

  constructor(private http: Http) { }

  register(user): Observable<any> {
    return this.http.post('/api/user/create', JSON.stringify(user), this.options).map(res => res.json());
  }

  login(credentials): Observable<any> {
    return this.http.post('/api/login', JSON.stringify(credentials), this.options);
  }
  
  loginGoogle(): Observable<any> {
    return this.http.get('http://localhost:3000/auth/google', this.options);
  }
  logOutGoogle(): Observable<any> {
    return this.http.get('http://localhost:3000/logout', this.options);
  }
  getUsers(): Observable<any> {
    return this.http.get('/api/users').map(res => res.json());
  }

  countUsers(): Observable<any> {
    return this.http.get('/api/users/count').map(res => res.json());
  }

  addUser(user): Observable<any> {
    return this.http.post('/api/user', JSON.stringify(user), this.options);
  }


  //Vaibhav Mali 27 Dec 2017 ...Start
  getLogedinUser(): Observable<any> {
    return this.http.get('/api/employees/getCurrentLoginDetails/', this.options).map(res => res.json());
  }

  getnewProjectRequests(): Observable<any> {
    return this.http.get('/api/employees/request/getprojectrequests', this.options).map(res => res.json());
  }

  UpdateProjectRequestsStatus(): Observable<any> {
    return this.http.get('api/employees/request/updateProjectRequestsStatus', this.options).map(res => res.json());
  }
 
  get_Accept_Cancel_ProjectRequests(): Observable<any> {
    return this.http.get('/api/employees/request/getAccept_Cancel_Projectrequests', this.options).map(res => res.json());
  }

  emplogout(Id): Observable<any> {
    return this.http.get(`/api/employees/logout/${Id}`,this.options).map(res => res.json());
  }

  //Vaibhav Mali 27 Dec 2017 ...End

  getUser(user): Observable<any> {
    return this.http.get(`/api/user/${user._id}`).map(res => res.json());
  }

  editUser(user): Observable<any> {
    return this.http.put(`/api/user/${user._id}`, JSON.stringify(user), this.options);
  }

  deleteUser(user): Observable<any> {
    return this.http.delete(`/api/user/${user._id}`, this.options);
  }

}
