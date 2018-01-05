import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { RoutingModule } from './routing.module';
import { SharedModule } from './shared/shared.module';

import {PopupModule} from 'ng2-opd-popup';
// import {DatePickerModule} from 'ng2-datepicker-bootstrap';
import { FormsModule } from '@angular/forms';

import { UserService } from './services/user.service';
import { ProjectService } from './services/project.service';
import { TaskService } from './services/task.service';
import { ProfileService } from './services/profile.service';
import { HomeService } from './services/home.service';
import { RecursiveService } from './services/recursive.service';
import { EmployeeService } from './services/employee.service';

import { AuthService } from './services/auth.service';
import { AuthGuardLogin } from './services/auth-guard-login.service';
import { AuthGuardAdmin } from './services/auth-guard-admin.service';
import { AngularDateTimePickerModule } from 'angular2-datetimepicker';
// import {A2Edatetimepicker} from 'ng2-eonasdan-datetimepicker';
 
import { AppComponent } from './app.component';
import { AboutComponent } from './about/about.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './logout/logout.component';
import { AccountComponent } from './account/account.component';
import { AdminComponent } from './admin/admin.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { ProjectComponent } from './project/project.component';
import {SelectModule} from 'ng2-select';
import { TaskComponent } from './task/task.component';
import { ProfileComponent } from './profile/profile.component';
import { EmployeeComponent } from './employee/employee.component';

 @NgModule({
  imports: [
    RoutingModule,
    SharedModule,
    PopupModule.forRoot(),
    SelectModule,
     // DatePickerModule,
     FormsModule,
      AngularDateTimePickerModule,
    //  A2Edatetimepicker

  ],
  declarations: [
    AppComponent,
    AboutComponent,
    RegisterComponent,
    LoginComponent,
    LogoutComponent,
    AccountComponent,
    AdminComponent,
    NotFoundComponent,
    ProjectComponent,
    TaskComponent,
    ProfileComponent,
    EmployeeComponent
  ],
  providers: [
    AuthService,
    AuthGuardLogin,
    AuthGuardAdmin,
    UserService,
    ProjectService,
    TaskService,
    ProfileService,
    RecursiveService,
    HomeService,EmployeeService
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent]
})

export class AppModule { }
