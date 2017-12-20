import { Component } from '@angular/core';
import { AuthService } from './services/auth.service';
import { RecursiveService } from './services/recursive.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {

  constructor(public auth: AuthService,
  private recursiveService :RecursiveService) { 

  }
  ngOnInit() {
    this.auth.getLogedinUserData();
    this.recursiveService.checkUserLogedIn();
  }
  logout(){
    window.location.href='http://localhost:3000/logout';
    localStorage.clear();
  }
}
