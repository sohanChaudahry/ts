import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { RoutingModule } from './routing.module';
import { SharedModule } from './shared/shared.module';

import {PopupModule} from 'ng2-opd-popup';
// import {DatePickerModule} from 'ng2-datepicker-bootstrap';
// import { FormsModule } from '@angular/forms';

import { UserService } from './services/user.service';
import { AuthService } from './services/auth.service';
import { GreenHouseTypeService } from './services/greenHouseType.service';
import { GreenHouseService } from './services/greenHouse.service';
import { ActivitiesService } from './services/activities.services';
import { FeedbackService } from './services/feedback.service';
import { MessageService } from './services/message.service';
import { AuthGuardLogin } from './services/auth-guard-login.service';
import { AuthGuardAdmin } from './services/auth-guard-admin.service';

 
import { AppComponent } from './app.component';
import { AboutComponent } from './about/about.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './logout/logout.component';
import { AccountComponent } from './account/account.component';
import { AdminComponent } from './admin/admin.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { GreenHouseTypeComponent } from './greenhousetype/greenHouseType.component';
import { GreenHouseComponent } from './greenhouse/greenHouse.component';
import { ActivitiesComponent } from './activities/activities.component';
import { FeedbackComponent } from './feedback/feedback.component';
import { MessageComponent } from './message/message.component';


 @NgModule({
  imports: [
    RoutingModule,
    SharedModule,
    PopupModule.forRoot(),
     // DatePickerModule,
    // FormsModule
  ],
  declarations: [
    AppComponent,
    AboutComponent,
    RegisterComponent,
    LoginComponent,
    LogoutComponent,
    AccountComponent,
    AdminComponent,
    GreenHouseTypeComponent,
    GreenHouseComponent,
    ActivitiesComponent,
    NotFoundComponent,
    FeedbackComponent,
    MessageComponent
  ],
  providers: [
    AuthService,
    AuthGuardLogin,
    AuthGuardAdmin,
    UserService,
    GreenHouseTypeService,
    GreenHouseService,
    ActivitiesService,
    FeedbackService,
    MessageService
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent]
})

export class AppModule { }
